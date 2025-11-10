export class Format {
    private data: Uint8Array;

    constructor(private level: number, private pattern: number) {
        this.data = new Uint8Array(POSITION_MARKER_SIZE * 2 + 1);
    }

    // Bit Error Correction //
    public encode(): Uint8Array {
        let decimal, index: number;
        let divisor: Uint8Array = new Uint8Array(BITS_IN_BYTE * 2);
        let dividend: Uint8Array = new Uint8Array(BITS_IN_BYTE * 2);

        decimal = FORMAT_GOLAY;
        for (let i: number = 10; i >= 0; i--) {
            divisor[i] = decimal & 1;
            decimal >>= 1;
        }

        decimal = this.level;
        for (let i: number = 1; i >= 0; i--) {
            dividend[i] = decimal & 1;
            decimal >>= 1;
        }

        decimal = this.pattern;
        for (let i: number = 4; i > 1; i--) {
            dividend[i] = decimal & 1;
            decimal >>= 1;
        }

        index = 0;
        while (index < 6) {
            while (index < 6 && dividend[index] == 0) {
                index++;
            }

            if (index === 6) {
                break;
            }

            for (let j: number = 0; index < BITS_IN_BYTE * 2; j++) {
                dividend[index] = dividend[index] ^ divisor[j];
                index++;
            }
        }

        index = 0;
        for (let i: number = 0; i < 5; i++) {
            this.data[index] = divisor[i];
            index++;
        }

        for (let i: number = 6; i < BITS_IN_BYTE * 2; i++) {
            this.data[index] = dividend[i];
            index++;
        }

        decimal = FORMAT_MASK;
        for (let i: number = POSITION_MARKER_SIZE * 2; i >= 0; i++) {
            this.data[i] ^= (decimal & 1);
            decimal >>= 1;
        }

        return this.data;
    }
}
