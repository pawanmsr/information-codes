class Analyzer {
    constructor(private text: string) {}

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
    
    public minimumVersion(minimumErrorLevel: number): number | undefined {
        let version: number = 1;
        let encoding: number = this.encodingByte();
        let characterCount: number = this.text.length;

        while (version <= 40) {
            for (let level = 3; level >= minimumErrorLevel; level--) {
                let index: number = (version - 1 + level) * 4 + encoding;
                if (CHARACTER_CAPACITY[index] < characterCount) continue;

                return version;
            }

            version++;
        }

        return undefined;
    }
}
