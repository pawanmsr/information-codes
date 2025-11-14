import { ALPHANUMERIC_GROUP_SIZE, ALPHANUMERIC_MULTIPLIER, ALPHANUMERIC_REGULAR_EXPRESSION, BLOCK_COUNT, CODEWORD_COUNT, PADDING_DATA } from './constants';
import { BITS_IN_BYTE, BITS_IN_KANJI, BYTE_REGULAR_EXPRESSION, CHARACTER_CAPACITY } from './constants';
import { ENCODING, ERROR_CORRECTION_LEVEL, FORMAT_DATA_LENGTH, KANJI_KANA_REGULAR_EXPRESSION } from './constants';
import { NUMERIC_GROUP_SIZE, NUMERIC_REGULAR_EXPRESSION, VERSION, VERSION_DATA_LENGTH, VERSION_MULTIPLIER } from './constants';
import { KanjiEncoder } from './kanji';
import { ALPHANUMERIC_TABLE, bitsInAlphaNumericGroup, bitsInNumericGroup, encodingIndex, indexLevel, levelIndex } from './tables';
import { characterCountLength, tableIndex, totalDataCodewords } from './tables';
import { Specification } from './types';

export class Analyzer {
    private specification: Specification;

    private data: Uint8Array;
    private formatData: Uint8Array;
    private versionData: Uint8Array;

    constructor(private text: string) {
        this.specification = this.optimalSpecification();

        this.versionData = new Uint8Array(VERSION_DATA_LENGTH);
        this.formatData = new Uint8Array(FORMAT_DATA_LENGTH);

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

    public bitLength(): number {
        switch (this.specification.encoding) {
            case ENCODING.NUMERIC:
                return bitsInNumericGroup(NUMERIC_GROUP_SIZE) * 
                    Math.floor(this.text.length / NUMERIC_GROUP_SIZE) + 
                        bitsInNumericGroup(this.text.length % NUMERIC_GROUP_SIZE);
                break;
            
            case ENCODING.ALPHANUMERIC:
                return bitsInAlphaNumericGroup(ALPHANUMERIC_GROUP_SIZE) * 
                    Math.floor(this.text.length / ALPHANUMERIC_GROUP_SIZE) + 
                        bitsInAlphaNumericGroup(this.text.length & 1);
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
        let version: number = this.specification.version;
        for (let i: number = VERSION_DATA_LENGTH - 1; i >= 0; i--) {
            this.versionData[i] = version & 1;
            version >>= 1;
        }

        return this.versionData;
    }

    public getLevel(): number {
        return this.specification.level;
    }

    public setMaskPattern(pattern: number): boolean {
        let decimal: number;
        this.specification.pattern = pattern;

        decimal = this.specification.level;
        for (let i: number = 1; i >= 0; i--) {
            this.formatData[i] = decimal & 1;
            decimal >>= 1;
        }

        if (decimal !== 0) {
            return false;
        }

        decimal = this.specification.pattern;
        for (let i: number = FORMAT_DATA_LENGTH - 1; i > 1; i--) {
            this.formatData[i] = decimal & 1;
            decimal >>= 1;
        }

        if (decimal !== 0) {
            return false;
        }

        return true;
    }

    public getFormatData(): Uint8Array {
        return this.formatData;
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
            for (let i = levelIndex(ERROR_CORRECTION_LEVEL.HIGH); i >= levelIndex(minimumLevel); i--) {
                let index: number = (version - 1 + i) * VERSION_MULTIPLIER + encodingIndex(encoding);
                if (CHARACTER_CAPACITY[index] < characterCount) {
                    continue;
                }
                
                return {
                    encoding: encoding,
                    version: version,
                    level: indexLevel(i),
                    pattern: -1
                };
            }

            version++;
        }

        return {
            encoding: encoding,
            version: 0,
            level: -1,
            pattern: -1
        };
    }

    private fillData(index: number, value: number, size: number): number {
        if (index + size > this.data.length) {
            return index;
        }

        for (let i = index + size - 1; i >= index; i--) {
            this.data[i] = value & 1;
            value >>= 1;
        }

        return index + size;
    }

    private fillNumeric(index: number): number {
        let i: number = 0;
        while (i + NUMERIC_GROUP_SIZE <= this.text.length) {
            let value: number = parseInt(this.text.substring(i, i + NUMERIC_GROUP_SIZE), 10);
            index = this.fillData(index, value, bitsInNumericGroup(NUMERIC_GROUP_SIZE));
            
            i += NUMERIC_GROUP_SIZE;
        }

        if (i < this.text.length) {
            let value: number = parseInt(this.text.substring(i), 10);
            index = this.fillData(index, value, bitsInNumericGroup(this.text.length - i));
        }

        return index;
    }

    private fillAlphanumeric(index: number): number {
        let i: number = 0;
        while (i + ALPHANUMERIC_GROUP_SIZE <= this.text.length) {
            let value: number = ALPHANUMERIC_TABLE[this.text[i]] * ALPHANUMERIC_MULTIPLIER +
                ALPHANUMERIC_TABLE[this.text[i + 1]];
            index = this.fillData(index, value, bitsInAlphaNumericGroup(ALPHANUMERIC_GROUP_SIZE));

            i += ALPHANUMERIC_GROUP_SIZE;
        }

        if (i < this.text.length) {
            index = this.fillData(index, ALPHANUMERIC_TABLE[this.text[i]],
                bitsInAlphaNumericGroup(1));
        }

        return index;
    }

    private fillByte(index: number): number {
        let encoder: TextEncoder = new TextEncoder();
        let characterArray: Uint8Array = encoder.encode(this.text);

        for (const character of characterArray) {
            index = this.fillData(index, character, BITS_IN_BYTE);
        }

        return index;
    }

    private fillKanjiKana(index: number): number {
        let encoder: KanjiEncoder = new KanjiEncoder();
        let characterArray: Uint16Array = encoder.encode(this.text);

        for (const character of characterArray) {
            let value: number = character - 
                (character >= 0x8140 && character <= 0x9FFC ? 0x8140 : 0xC140);
            index = this.fillData(index, (value >> 8) * 0xC0 + (value & 0xFF), BITS_IN_KANJI);
        }

        return index;
    }

    public encode(): Uint8Array {
        let index: number = 0;

        index = this.fillData(index, this.specification.encoding, 4);
        index = this.fillData(index, this.text.length,
            characterCountLength(this.specification.version,
                this.specification.encoding));

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

        // Terminator Bits
        index = this.fillData(index, 0,
            Math.min(4, this.data.length - index));
        // Padding Bits
        index = this.fillData(index, 0,
            Math.ceil(index / 8) * 8 - index);

        let i: number = 0;
        while (index < this.data.length) {
            index = this.fillData(index, PADDING_DATA[i], BITS_IN_BYTE);
            i ^= 1;
        }

        if (index !== this.data.length) {
            throw Error("Data sequence and size mismatch.");
        }
        return this.data;
    }

    public getBlocks(): Uint8Array[] {
        let index: number = 0;
        let blocks: Uint8Array[] = [];
        const look: number = tableIndex(this.specification.version, this.specification.level);
        for (let i = 0; i < BLOCK_COUNT.GROUP_ONE[look]; i++) {
            blocks.push(this.data.slice(index, index + 
                CODEWORD_COUNT.GROUP_ONE[look] * BITS_IN_BYTE));
            index += CODEWORD_COUNT.GROUP_ONE[look] * BITS_IN_BYTE;
        }

        for (let i = 0; i < BLOCK_COUNT.GROUP_TWO[look]; i++) {
            blocks.push(this.data.slice(index, index + 
                CODEWORD_COUNT.GROUP_TWO[look] * BITS_IN_BYTE));
            index += CODEWORD_COUNT.GROUP_TWO[look] * BITS_IN_BYTE;
        }

        return blocks;
    }
}
