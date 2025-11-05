class ErrorCorrection {
    constructor(private level: number) {}

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
