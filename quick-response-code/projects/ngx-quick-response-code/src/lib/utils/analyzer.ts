class Analyzer {
    private version: number;
    private encoding: number;
    private data: Uint8Array;

    constructor(private text: string, private level: number) {
        this.encoding = this.encodingByte();
        this.version = this.minimumVersion();

        let length: number = this.getDataLength(this.version, this.level);
        this.data = new Uint8Array(length);
    }

    public encodingByte(): number {
        if (NUMERIC_REGULAR_EXPRESSION.test(this.text)) {
            return 0b0001;
        }

        if (ALPHANUMERIC_REGULAR_EXPRESSION.test(this.text)) {
            return 0b0010;
        }

        if (BYTE_REGULAR_EXPRESSION.test(this.text)) {
            return 0b0100;
        }

        if (KANJI_KANA_REGULAR_EXPRESSION.test(this.text)) {
            return 0b1000;
        }

        return 0b0111;
    }

    public bitLength(): number {
        switch (this.encoding) {
            case 1:
                return 10 * Math.floor(this.text.length / 3) + 
                    (this.text.length % 3 ? (this.text.length % 3) * 3 + 1 : 0);
                break;
            
            case 2:
                return 11 * Math.floor(this.text.length / 2) + 
                    6 * (this.text.length & 1)
                break;
            
            case 3:
                return this.text.length * 8;
                break;
            
            case 4:
                return this.text.length * 13;
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
            for (let level = 3; level >= this.level; level--) {
                let index: number = (version - 1 + level) * 4 + this.encoding;
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

        return CHARACTER_COUNT.BITS[(this.encoding - 1) * 3 + index];
    }

    public getDataLength(version: number, level: number): number {
        let index: number = (version - 1) * 4 + level;
        let length: number = CODEWORD_COUNT.GROUP_ONE[index] * BLOCK_COUNT.GROUP_ONE[index] +
            CODEWORD_COUNT.GROUP_TWO[index] * BLOCK_COUNT.GROUP_TWO[index];

        return length;
    }

    private fillData(index: number, value: number, size: number): number {
        for (let i = index + size - 1; i >= index; i--) {
            this.data[i] = value % 2;
            value /= 2;
        }
        
        return (index + size) % this.data.length;
    }

    public encode(): Uint8Array {
        let index: number = 0;

        return this.data;
    }
}
