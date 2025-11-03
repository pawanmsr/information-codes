const NUMERIC_REGULAR_EXPRESSION = /^\d*$/;
const ALPHANUMERIC_REGULAR_EXPRESSION = /^[\dA-Z $%*+-./:]*$/;
const BYTE_REGULAR_EXPRESSION = /^[\x00-\xff]*$/;
const KANJI_KANA_REGULAR_EXPRESSION = /^[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]*$/u;

const POSITION_MARKER_SIZE: number = 7;
const ALIGNMENT_PATTERN_SIZE: number = 5;
