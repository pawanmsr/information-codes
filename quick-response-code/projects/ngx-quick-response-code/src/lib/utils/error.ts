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

    public blocks(version: number): number | undefined {
        switch (this.level) {
            case ERROR_CORRECTION_LEVEL.LOW:
                // TODO
                break;
            case ERROR_CORRECTION_LEVEL.MEDIUM:
                break;
            case ERROR_CORRECTION_LEVEL.QUARTILE:
                break;
            case ERROR_CORRECTION_LEVEL.HIGH:
                break;

            default:
                break;
        }

        return undefined;
    }
}
