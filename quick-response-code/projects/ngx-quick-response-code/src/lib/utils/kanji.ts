import { KANJI_TABLE } from "./tables";

export class KanjiEncoder {
    private kanjiTable: Record<string, number>= {}
    
    constructor() {
        for (const key in KANJI_TABLE) {
            let characters: string[] = key.split("");
            let value: number = KANJI_TABLE[key];

            for (const character of characters) {
                this.kanjiTable[character] = value;
                value += 1;
            }
        }
    }

    public encode(text: string): Uint16Array<ArrayBuffer> {
        let data: Uint16Array<ArrayBuffer> = new Uint16Array(text.length);
        for (let i = 0; i < text.length; i++) {
            if (text[i] in this.kanjiTable) {
                data[i] = this.kanjiTable[text[i]];
                continue;
            }

            throw new Error(text[i] + " is not a valid Shift JIS character.");
        }
        
        return data;
    }
}
