class KanjiEncoder {
    constructor() {}

    public encode(text: string): Uint16Array<ArrayBuffer> {
        let data: Uint16Array<ArrayBuffer> = new Uint16Array(text.length);
        for (let i = 0; i < text.length; i++) {
            if (text[i] in KANJI_TABLE) {
                data[i] = KANJI_TABLE[text[i]];
                continue;
            }

            // TODO: throw error?
        }
        
        return data;
    }
}
