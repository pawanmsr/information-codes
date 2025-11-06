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
    
    private polynomialProduct(x: Uint8Array, y: Uint8Array): Uint8Array {
        let z: Uint8Array = new Uint8Array(x.length + y.length - 1);
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < y.length; j++) {
                z[i + j] = this.arithmetic(z[i + j],
                    this.multiply(x[i], y[j]));
            }
        }

        return z;
    }

    private generatePolynomial(n: number): Uint8Array {
        let coefficients: Uint8Array = new Uint8Array([this.powers[0]]);
        for (let d = 0; d < n; d++) {
            // Coefficients are elements of Galois(256).
            // Elements in Galois Field are positive integers.
            let multiplier: Uint8Array = new Uint8Array([this.powers[0], this.powers[d]]);
            coefficients = this.polynomialProduct(coefficients, multiplier);
        }

        return coefficients;
    }

    private messagePolynomial(data: Uint8Array): Uint8Array {
        let length: number = data.length / BITS_IN_BYTE;
        let coefficients: Uint8Array = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            let value: number = 0;
            let multiplier: number = 1;
            for (let j = (i + 1) * BITS_IN_BYTE - 1; j >= i * BITS_IN_BYTE; j--) {
                value += data[j] * multiplier;
                multiplier *= 2;
            }

            coefficients[i] = value;
        }

        return coefficients;
    }

    public totalCodewords(version: number): number {
        let index: number = (version - 1) * VERSION_MULTIPLIER + this.level;
        let count: number = ERROR_CORRECTION_CODEWORDS_PER_BLOCK[index] * 
            (BLOCK_COUNT.GROUP_ONE[index] + BLOCK_COUNT.GROUP_TWO[index]);

        return count;
    }
}
