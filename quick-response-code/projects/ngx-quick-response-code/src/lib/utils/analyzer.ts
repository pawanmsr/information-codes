import { KanjiEncoder } from './kanji';
import { ALPHANUMERIC_TABLE } from './tables';
import { characterCountLength, tableIndex, totalDataCodewords } from './tables';
import { Specification } from './types';

export class Analyzer {
    private specification: Specification;
    
    private data: Uint8Array;
    private versionData: Uint8Array;

    constructor(private text: string) {
        this.specification = this.optimalSpecification();

        this.versionData = new Uint8Array(VERSION_DATA_LENGTH);

        let count: number = totalDataCodewords(this.specification.version,
            this.specification.level);
        this.data = new Uint8Array(count * BITS_IN_BYTE);
        this.encode();
    }

    public encodingByte(): number {
        if (NUMERIC_REGULAR_EXPRESSION.test(this.text)) {
            return ENCODING.NUMERIC;
        }

        if (ALPHANUMERIC_REGULAR_EXPRESSION.test(this.text)) {
            return ENCODING.ALPHANUMERIC;
        }

        if (BYTE_REGULAR_EXPRESSION.test(this.text)) {
            return ENCODING.BYTE;
        }

        if (KANJI_KANA_REGULAR_EXPRESSION.test(this.text)) {
            return ENCODING.KANJI;
        }

        return ENCODING.ECI;
    }

    public bitsInNumericGroup(groupSize: number): number {
        if (groupSize === 0) return 0;
        return groupSize * 3 + 1;
    }

    public bitsInAlphaNumericGroup(groupSize: number): number {
        if (groupSize === 0) return 0;
        return groupSize * 5 + 1;
    }

    public bitLength(): number {
        switch (this.specification.encoding) {
            case ENCODING.NUMERIC:
                return this.bitsInNumericGroup(NUMERIC_GROUP_SIZE) * 
                    Math.floor(this.text.length / NUMERIC_GROUP_SIZE) + 
                        this.bitsInNumericGroup(this.text.length % NUMERIC_GROUP_SIZE);
                break;
            
            case ENCODING.ALPHANUMERIC:
                return this.bitsInAlphaNumericGroup(ALPHANUMERIC_GROUP_SIZE) * 
                    Math.floor(this.text.length / ALPHANUMERIC_GROUP_SIZE) + 
                        this.bitsInAlphaNumericGroup(this.text.length & 1);
                break;
            
            case ENCODING.BYTE:
                return this.text.length * BITS_IN_BYTE;
                break;
            
            case ENCODING.KANJI:
                return this.text.length * BITS_IN_KANJI;
                break;
        
            default:
                // TODO: calculate length for ECI
                break;
        }

        return 0;
    }

    public getVersion(): number {
        return this.specification.version;
    }

    public getVersionData(): Uint8Array {
        return this.versionData;
    }

    public setMinimumVersionAndLevel(version: number, level: number): Specification {
        this.specification = this.optimalSpecification(version, level);
        return this.specification;
    }
    
    private optimalSpecification(minimumVersion: number = VERSION.MIN,
        minimumLevel: number = ERROR_CORRECTION_LEVEL.LOW): Specification {
        let encoding: number = this.encodingByte();
        
        let characterCount: number = this.text.length;
        let version: number = minimumVersion;

        while (version <= VERSION.MAX) {
            for (let level = ERROR_CORRECTION_LEVEL.HIGH; level >= minimumLevel; level--) {
                let index: number = (version - 1 + level) * VERSION_MULTIPLIER + encoding;
                if (CHARACTER_CAPACITY[index] < characterCount) {
                    continue;
                }
                
                return {
                    encoding: encoding,
                    version: version,
                    level: level
                };
            }

            version++;
        }

        return {
            encoding: encoding,
            version: 0,
            level: -1
        };
    }

    private fillData(index: number, value: number, size: number): number {
        for (let i = index + size - 1; i >= index; i--) {
            this.data[i] = value % 2;
            value /= 2;
        }

        return (index + size) % this.data.length;
    }

    private fillNumeric(index: number): number {
        let i: number = 0;
        while (i + NUMERIC_GROUP_SIZE <= this.data.length) {
            let value: number = parseInt(this.text.substring(i, NUMERIC_GROUP_SIZE), 10);
            index = this.fillData(index, value, this.bitsInNumericGroup(NUMERIC_GROUP_SIZE));
            
            i += NUMERIC_GROUP_SIZE;
        }

        if (i < this.data.length) {
            let value: number = parseInt(this.text.substring(i), 10);
            index = this.fillData(index, value,
                this.bitsInAlphaNumericGroup(this.text.length - i));
        }

        return index % this.data.length;
    }

    private fillAlphanumeric(index: number): number {
        let i: number = 0;
        while (i + ALPHANUMERIC_GROUP_SIZE <= this.text.length) {
            let value: number = ALPHANUMERIC_TABLE[this.text[i]] * ALPHANUMERIC_MULTIPLIER +
                ALPHANUMERIC_TABLE[this.text[i + 1]];
            index = this.fillData(index, value,
                this.bitsInAlphaNumericGroup(ALPHANUMERIC_GROUP_SIZE));

            i += ALPHANUMERIC_GROUP_SIZE;
        }

        if (i < this.text.length) {
            index = this.fillData(index, ALPHANUMERIC_TABLE[this.text[i]],
                this.bitsInAlphaNumericGroup(1));
        }

        return index % this.data.length;
    }

    private fillByte(index: number): number {
        let encoder: TextEncoder = new TextEncoder();
        let characterArray: Uint8Array = encoder.encode(this.text);

        for (const character of characterArray) {
            index = this.fillData(index, character, BITS_IN_BYTE);
        }

        return index % this.data.length;
    }

    private fillKanjiKana(index: number): number {
        let encoder: KanjiEncoder = new KanjiEncoder();
        let characterArray: Uint16Array = encoder.encode(this.text);

        for (const character of characterArray) {
            let value: number = character - 
                (character >= 0x8140 && character <= 0x9FFC ? 0x8140 : 0xC140);
            index = this.fillData(index, (value >> 8) * 0xC0 + (value & 0xFF), BITS_IN_KANJI);
        }

        return index % this.data.length;
    }

    public encode(): Uint8Array {
        let index: number = 0;

        index = this.fillData(index, this.specification.encoding, 4);
        index = this.fillData(index, this.text.length,
            characterCountLength(this.specification.version, this.specification.encoding));
        switch (this.specification.encoding) {
            case ENCODING.NUMERIC:
                index = this.fillNumeric(index);
                break;
            
            case ENCODING.ALPHANUMERIC:
                index = this.fillAlphanumeric(index);
                break;
            
            case ENCODING.BYTE:
                index = this.fillByte(index);
                break;
            
            case ENCODING.KANJI:
                index = this.fillKanjiKana(index);
                break;
        
            default:
                break;
        };
        index = this.fillData(index, 0, this.data.length - index);
        
        if (index !== 0) {
            throw Error("Data sequence and size mismatch.");
        }

        return this.data;
    }

    public blocks(): Uint8Array[] {
        let index: number = 0;
        let blocks: Uint8Array[] = [];
        let look: number = tableIndex(this.specification.version, this.specification.level);
        for (let i = 0; i < BLOCK_COUNT.GROUP_ONE[look]; i++) {
            blocks.push(this.data.slice(index,
                index + CODEWORD_COUNT.GROUP_ONE[look] * BITS_IN_BYTE - 1));
            index += CODEWORD_COUNT.GROUP_ONE[look] * BITS_IN_BYTE;
        }

        for (let i = 0; i < BLOCK_COUNT.GROUP_TWO[look]; i++) {
            blocks.push(this.data.slice(index,
                index + CODEWORD_COUNT.GROUP_TWO[look] * BITS_IN_BYTE - 1));
            index += CODEWORD_COUNT.GROUP_TWO[look] * BITS_IN_BYTE;
        }

        return blocks;
    }
}
