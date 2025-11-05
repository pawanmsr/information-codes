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

    public totalCodewords(version: number): number {
        let index: number = (version - 1) * VERSION_MULTIPLIER + this.level;
        return ERROR_CORRECTION_CODEWORDS_PER_BLOCK[index] * 
            (BLOCK_COUNT.GROUP_ONE[index] + BLOCK_COUNT.GROUP_TWO[index]);
    }
}
