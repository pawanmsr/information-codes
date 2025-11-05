import { KanjiEncoder } from './kanji';
import { ALPHANUMERIC_TABLE } from './tables';

export class Analyzer {
    private version: number;
    private encoding: number;
    private data: Uint8Array;

    constructor(private text: string, private level: number) {
        this.encoding = this.encodingByte();
        this.version = this.minimumVersion();

        let length: number = this.totalDataCodewords(this.version, this.level);
        this.data = new Uint8Array(length * BITS_IN_BYTE);
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
        switch (this.encoding) {
            case ENCODING.NUMERIC:
                return this.bitsInNumericGroup(NUMERIC_GROUP_SIZE) * 
                    Math.floor(this.text.length / NUMERIC_GROUP_SIZE) + 
                        this.bitsInNumericGroup(this.text.length % NUMERIC_GROUP_SIZE);
                break;
            
            case ENCODING.ALPHANUMERIC:
                return this.bitsInAlphaNumericGroup(ALPHANUMERIC_GROUP_SIZE) * 
                    Math.floor(this.text.length / ALPHANUMERIC_GROUP_SIZE) + 
                        this.bitsInAlphaNumericGroup(this.text.length & 1)
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
    
    public minimumVersion(): number {
        let version = VERSION.MIN;
        let characterCount: number = this.text.length;

        while (this.version <= VERSION.MAX) {
            for (let level = ERROR_CORRECTION_LEVEL.HIGH; level >= this.level; level--) {
                let index: number = (version - 1 + level) * VERSION_MULTIPLIER + this.encoding;
                if (CHARACTER_CAPACITY[index] < characterCount) continue;
                
                return version;
            }

            version++;
        }

        return 0;
    }

    public characterCountLength(version: number): number {
        let index: number = 0;
        for (const range of CHARACTER_COUNT.RANGES) {
            if (range.MIN > version || range.MAX < version) {
                index++;
                continue;
            }

            break;
        }

        let length: number = CHARACTER_COUNT.BITS[(this.encoding - 1) * 
            CHARACTER_COUNT.RANGES.length + index];
        
        return length;
    }

    public totalDataCodewords(version: number, level: number): number {
        let index: number = (version - 1) * VERSION_MULTIPLIER + level;
        let count: number = CODEWORD_COUNT.GROUP_ONE[index] * BLOCK_COUNT.GROUP_ONE[index] +
            CODEWORD_COUNT.GROUP_TWO[index] * BLOCK_COUNT.GROUP_TWO[index];

        return count;
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
            index = this.fillData(index, value, this.bitsInAlphaNumericGroup(this.text.length - i));
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

        index = this.fillData(index, this.encoding, 4);
        index = this.fillData(index, this.text.length,
            this.characterCountLength(this.version));
        switch (this.encoding) {
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
        
        return this.data;
    }
}
