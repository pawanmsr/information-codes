class Analyzer {
    private version: number;
    private encoding: number;


    constructor(private text: string, private level: number) {
        this.encoding = this.encodingByte();
        this.version = this.minimumVersion();
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
                break;
        }

        // TODO: calculate length for ECI
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

    private characterCountLength(version: number): number {
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

    public encodedData(): Uint8Array {
        let length: number = 4 + this.characterCountLength(this.version) + this.bitLength();

        length += length % 8 ? 8 - length % 8 : 0;
        let data: Uint8Array = new Uint8Array(length);

        // TODO: construct data

        return data;
    }
}
