class ErrorCorrection {
    constructor(private level: number) {
        this.generateTables();
    }

    private logs: Uint8Array = new Uint8Array(FIELD_SIZE);
    private powers: Uint8Array = new Uint8Array(FIELD_SIZE);

    private generateTables(): void {
        let element: number = 1;
        for (let exponent = 0; exponent < FIELD_SIZE; exponent++) {
            this.logs[element] = exponent;
            this.powers[exponent] = element;

            element <<= 1;
            if (element >= FIELD_SIZE) {
                element ^= FIELD_MODULO;
            }
        }
    }

    private arithmetic(x: number, y: number): number {
        return x ^ y;
    }
    
    private multiply(x: number, y: number): number {
        let exponent: number = this.logs[x] + this.logs[y];
        if (exponent >= FIELD_SIZE) {
            exponent %= 255;
        }

        return this.powers[exponent];
    }

    private polynomialDivision(divisor: Uint8Array, divident: Uint8Array): Uint8Array {
        let n: number = divisor.length;
        let m: number = divident.length;
        for (let i = m - 1; i >= n - 1; i--) {
            let quotient: number = divident[i];
            for (let j = 0; j < n; j++) {
                divident[i - j] = this.arithmetic(divident[i - j],
                    this.multiply(quotient, divisor[n - 1 - j]));
            }
        }

        return divident.slice(0, n - 1);
    }

    public totalCodewords(version: number): number {
        let index: number = (version - 1) * VERSION_MULTIPLIER + this.level;
        return ERROR_CORRECTION_CODEWORDS_PER_BLOCK[index] * 
            (BLOCK_COUNT.GROUP_ONE[index] + BLOCK_COUNT.GROUP_TWO[index]);
    }
}
