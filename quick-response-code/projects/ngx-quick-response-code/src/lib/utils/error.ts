import { BITS_IN_BYTE, FIELD_MODULO, FIELD_SIZE, FORMAT_DATA_LENGTH, FORMAT_ERROR_LENGTH } from "./constants";
import { FORMAT_GOLAY, VERSION_DATA_LENGTH, VERSION_ERROR_LENGTH, VERSION_GOLAY } from "./constants";
import { blockCount, errorCorrectionCodewordsPerBlock, totalErrorCorrectionCodewords } from "./tables";

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
        for (let i = 0; i <= m - n; i++) {
            let quotient: number = dividend[i];
            for (let j = 0; j < n; j++) {
                dividend[i + j] = this.arithmetic(dividend[i + j],
                    this.multiply(quotient, divisor[j]));
            }
        }

        return dividend.slice(m - n + 1, m);
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

            coefficients[i] = value;
        }

        return coefficients;
    }

    private errorBlock(remainder: Uint8Array): Uint8Array {
        let length: number = remainder.length * BITS_IN_BYTE;
        let block: Uint8Array = new Uint8Array(length);

        for (let i = 0; i < remainder.length; i++) {
            for (let j = 0; j < BITS_IN_BYTE; j++) {
                block[(i + 1) * BITS_IN_BYTE - 1 - j] = remainder[i] & 1;
                remainder[i] >>= 1;
            }
        }
        
        return block;
    }

    public encode(): Uint8Array {
        let index: number = 0;
        let divisor: Uint8Array = this.generatorPolynomial();

        for (const block of this.blocks) {
            let dividend: Uint8Array = this.messagePolynomial(block);
            let remainder: Uint8Array = this.polynomialDivision(divisor, dividend);

            let errorBlock: Uint8Array = this.errorBlock(remainder);
            this.data.set(errorBlock, index);
            index += errorBlock.length;
        }

        return this.data;
    }

    public getErrorBlocks(): Uint8Array[] {
        let index: number = 0;
        let blocks: Uint8Array[] = [];
        for (let i = 0; i < blockCount(this.version, this.level); i++) {
            blocks.push(this.data.slice(index, index + 
                errorCorrectionCodewordsPerBlock(this.version, this.level) * BITS_IN_BYTE));
            index += errorCorrectionCodewordsPerBlock(this.version, this.level) * BITS_IN_BYTE;
        }

        return blocks;
    }

    public formatError(data: Uint8Array): Uint8Array {
        let decimal, index: number;
        let dividend: Uint8Array = new Uint8Array(FORMAT_DATA_LENGTH + FORMAT_ERROR_LENGTH);
        let divisor: Uint8Array = new Uint8Array(FORMAT_DATA_LENGTH + FORMAT_ERROR_LENGTH + 1);

        dividend.set(data, 0);

        decimal = FORMAT_GOLAY;
        for (let i: number = FORMAT_ERROR_LENGTH; i >= 0; i--) {
            divisor[i] = decimal & 1;
            decimal >>= 1;
        }

        index = 0;
        while (index < FORMAT_DATA_LENGTH) {
            while (index < FORMAT_DATA_LENGTH + FORMAT_ERROR_LENGTH && dividend[index] === 0) {
                index++;
            }

            for (let i: number = 0; index + i < FORMAT_DATA_LENGTH + FORMAT_ERROR_LENGTH; i++) {
                dividend[index + i] = this.arithmetic(dividend[index + i], divisor[i]);
            }

            index++;
        }

        return dividend.slice(FORMAT_DATA_LENGTH, FORMAT_DATA_LENGTH + FORMAT_ERROR_LENGTH);
    }

    public versionError(data: Uint8Array): Uint8Array {
        let decimal, index: number;
        let dividend: Uint8Array = new Uint8Array(VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH);
        let divisor: Uint8Array = new Uint8Array(VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH + 1);
        
        dividend.set(data, 0);

        decimal = VERSION_GOLAY;
        for (let i: number = VERSION_ERROR_LENGTH; i >= 0; i--) {
            divisor[i] = decimal & 1;
            decimal >>= 1;
        }

        index = 0;
        while (index < VERSION_DATA_LENGTH) {
            while (index < VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH && dividend[index] === 0) {
                index++;
            }

            for (let i: number = 0; index + i < VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH; i++) {
                dividend[index + i] = this.arithmetic(dividend[index + i], divisor[i]);
            }

            index++;
        }

        return dividend.slice(VERSION_DATA_LENGTH, VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH);
    }
}
