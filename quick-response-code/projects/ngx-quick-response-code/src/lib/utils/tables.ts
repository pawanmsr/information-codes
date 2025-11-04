import * as alphanumericTable from './alphanumeric.json'
import * as kanjiTable from './sjis.json'

interface Dictionary {
    [key: string]: number
}

// Look Up Tables //
export const ALPHANUMERIC_TABLE: Dictionary = alphanumericTable;
export const KANJI_TABLE: Dictionary = kanjiTable;
