import * as alphanumericTable from './alphanumeric.json';
import { BLOCK_COUNT, CHARACTER_COUNT, CODEWORD_COUNT, ERROR_CORRECTION_CODEWORDS_PER_BLOCK, VERSION_MULTIPLIER } from './constants';
import * as kanjiTable from './sjis.json';

interface Dictionary {
    [key: string]: number
}

// Look Up Tables //
export const ALPHANUMERIC_TABLE: Dictionary = alphanumericTable;
export const KANJI_TABLE: Dictionary = kanjiTable;

export function tableIndex(version: number, level: number): number {
    return (version - 1) * VERSION_MULTIPLIER + level;
}

export function blockCount(version: number, level: number): number {
    let index: number = tableIndex(version, level);
    let count: number = BLOCK_COUNT.GROUP_ONE[index] + BLOCK_COUNT.GROUP_TWO[index];

    return count;
}

export function totalDataCodewords(version: number, level: number): number {
    let index: number = tableIndex(version, level);
    let count: number = CODEWORD_COUNT.GROUP_ONE[index] * BLOCK_COUNT.GROUP_ONE[index] +
        CODEWORD_COUNT.GROUP_TWO[index] * BLOCK_COUNT.GROUP_TWO[index];

    return count;
}

export function characterCountLength(version: number, encoding: number): number {
    let index: number = 0;
    for (const range of CHARACTER_COUNT.RANGES) {
        if (range.MIN > version || range.MAX < version) {
            index++;
            continue;
        }

        break;
    }

    let length: number = CHARACTER_COUNT.BITS[(encoding - 1) * 
        CHARACTER_COUNT.RANGES.length + index];
    
    return length;
}

export function errorCorrectionCodewordsPerBlock(version: number, level: number): number {
    let index: number = tableIndex(version, level);
    let count: number = ERROR_CORRECTION_CODEWORDS_PER_BLOCK[index];
    
    return count;
}

export function totalErrorCorrectionCodewords(version: number, level: number): number {
    let index: number = tableIndex(version, level);
    let count: number = ERROR_CORRECTION_CODEWORDS_PER_BLOCK[index] * 
        (BLOCK_COUNT.GROUP_ONE[index] + BLOCK_COUNT.GROUP_TWO[index]);

    return count;
}
