export class Format {
    private data: Uint8Array;

    constructor(private pattern: number, private level: number) {
        this.data = new Uint8Array(POSITION_MARKER_SIZE * 2 + 1);
    }

    // Bit Error Correction //
}
