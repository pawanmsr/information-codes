import { blockCount, errorCorrectionCodewordsPerBlock, tableIndex, totalErrorCorrectionCodewords } from "./tables";

export class ErrorCorrection {
    private data: Uint8Array;

    constructor(private version: number, private level: number, private blocks: Uint8Array[]) {
        this.generateTables();

        let count: number = totalErrorCorrectionCodewords(this.version, this.level);
        this.data = new Uint8Array(count * BITS_IN_BYTE);
        this.encode();
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

    private polynomialDivision(divisor: Uint8Array, dividend: Uint8Array): Uint8Array {
        let n: number = divisor.length;
        let m: number = dividend.length;
        for (let i = m - 1; i >= n - 1; i--) {
            let quotient: number = dividend[i];
            for (let j = 0; j < n; j++) {
                dividend[i - j] = this.arithmetic(dividend[i - j],
                    this.multiply(quotient, divisor[n - 1 - j]));
            }
        }

        return dividend.slice(0, n - 1);
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

    private generatorPolynomial(): Uint8Array {
        let degree: number = errorCorrectionCodewordsPerBlock(this.version, this.level);
        let coefficients: Uint8Array = new Uint8Array([this.powers[0]]);
        for (let d = 0; d < degree; d++) {
            // Coefficients are elements of Galois(256).
            // Elements in Galois Field are positive integers.
            let multiplier: Uint8Array = new Uint8Array([this.powers[0], this.powers[d]]);
            coefficients = this.polynomialProduct(coefficients, multiplier);
        }

        return coefficients;
    }

    private messagePolynomial(block: Uint8Array): Uint8Array {
        let length: number = block.length / BITS_IN_BYTE;
        let padding: number = errorCorrectionCodewordsPerBlock(this.version, this.level);
        let coefficients: Uint8Array = new Uint8Array(length + padding);
        for (let i = 0; i < length; i++) {
            let value: number = 0;
            let multiplier: number = 1;
            for (let j = (i + 1) * BITS_IN_BYTE - 1; j >= i * BITS_IN_BYTE; j--) {
                value += block[j] * multiplier;
                multiplier <<= 1;
            }

            coefficients[length + padding - i] = value;
        }

        return coefficients;
    }

    private errorBlock(remainder: Uint8Array): Uint8Array {
        let length: number = remainder.length * BITS_IN_BYTE;
        let block: Uint8Array = new Uint8Array(length);

        remainder.reverse();
        for (let i = 0; i < remainder.length; i++) {
            for (let j = 0; j < BITS_IN_BYTE; j++) {
                block[(i + 1) * BITS_IN_BYTE - j - 1] = remainder[i] % 2;
                remainder[i] >>= 1;
            }
        }
        
        return block;
    }

    public encode(): Uint8Array {
        let index: number = 0;

        for (const block of this.blocks) {
            let divisor: Uint8Array = this.generatorPolynomial();
            let dividend: Uint8Array = this.messagePolynomial(block);
            let remainder: Uint8Array = this.polynomialDivision(divisor, dividend);

            let errorBlock: Uint8Array = this.errorBlock(remainder);
            for (const value of errorBlock) {
                this.data[index] = value;
                index++;
            }
        }

        return this.data;
    }

    public errorBlocks(): Uint8Array[] {
        let index: number = 0;
        let blocks: Uint8Array[] = [];
        let look: number = tableIndex(this.version, this.level);
        for (let i = 0; i < blockCount(this.version, this.level); i++) {
            blocks.push(this.data.slice(index,
                index + ERROR_CORRECTION_CODEWORDS_PER_BLOCK[look] * BITS_IN_BYTE - 1));
            index += ERROR_CORRECTION_CODEWORDS_PER_BLOCK[look] * BITS_IN_BYTE;
        }

        return blocks;
    }
}
