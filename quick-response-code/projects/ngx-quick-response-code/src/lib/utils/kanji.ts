import { KANJI_TABLE } from "./tables";

export class KanjiEncoder {
    constructor() {}

    public encode(text: string): Uint16Array<ArrayBuffer> {
        let data: Uint16Array<ArrayBuffer> = new Uint16Array(text.length);
        for (let i = 0; i < text.length; i++) {
            if (text[i] in KANJI_TABLE) {
                data[i] = KANJI_TABLE[text[i]];
                continue;
            }

            throw new Error(text[i] + " is not a valid Shift JIS character.");
        }
        
        return data;
    }
}
