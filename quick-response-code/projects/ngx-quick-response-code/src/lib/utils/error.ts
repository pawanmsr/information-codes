class ErrorCorrection {
    constructor(private level: number) {}

    public blocks(version: number): number | undefined {
        switch (this.level) {
            case ErrorLevel.L:
                // TODO
                break;
            case ErrorLevel.M:
                break;
            case ErrorLevel.Q:
                break;
            case ErrorLevel.H:
                break;
        
            default:
                break;
        }

        return undefined;
    }
}