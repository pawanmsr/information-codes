class ErrorCorrection {
    constructor(private level: number) {}

    public blocks(version: number): number | undefined {
        switch (this.level) {
            case ErrorCorrectionLevel.LOW:
                // TODO
                break;
            case ErrorCorrectionLevel.MEDIUM:
                break;
            case ErrorCorrectionLevel.QUARTILE:
                break;
            case ErrorCorrectionLevel.HIGH:
                break;

            default:
                break;
        }

        return undefined;
    }
}