import { Coordinate } from "./types";
import { ALIGNMENT_PATTERN_CENTER, BITS_IN_BYTE, PENALTY } from "./constants";
import { POSITION_MARKER_CENTER, POSITION_MARKER_SIZE, SIMILARITY_PATTERN } from "./constants";
import { VERSION_DATA_LENGTH, VERSION_ERROR_LENGTH } from "./constants";

export class Matrix {
    private matrix: Uint8Array;
    private special: Uint8Array;
    
    constructor(private size: number) {
        this.matrix = new Uint8Array(size * size);
        this.special = new Uint8Array(size * size);
    }

    public condition(pattern: number, row: number, column: number): boolean {
        switch (pattern) {
            case 0:
                return (row + column) % 2 === 0;
                break;
            case 1:
                return row % 2 === 0;
                break;
            case 2:
                return column % 3 === 0;
                break;
            case 3:
                return (row + column) % 3 === 0;
                break;
            case 4:
                return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
                break;
            case 5:
                return (row + column) % 2 + (row * column) % 3 === 0;
                break;
            case 6:
                return ((row * column) % 3 + row * column) % 2 === 0;
                break;
            case 7:
                return ((row * column) % 3 + row + column) % 2 === 0;
                break;
        
            default:
                break;
        }

        return false;
    }

    public get(row: number, column: number): number {
        return this.matrix[this.index(row, column)];
    }

    private index(row: number, column: number): number {
        if (row < 0 || row >= this.size || column < 0 || column >= this.size) {
            return -1;
        }

        return this.size * row + column;
    }

    private set(value: number, index: number, special: boolean = false): boolean {
        if (index < 0 || this.special[index]) {
            return false;
        }

        this.matrix[index] = value;
        
        if (special) {
            this.special[index] = 1;
        }

        return true;
    }

    public placeFinderPattern(center: Coordinate): void {
        let value: number = 0;
        for (let d = POSITION_MARKER_CENTER + 1; d > 0; d--) {
            for (let i = center.x - d; i <= center.x + d; i++) {
                this.set(value, this.index(i, center.y - d), true);
                this.set(value, this.index(i, center.y + d), true);
            }

            for (let j = center.y - d; j <= center.y + d; j++) {
                this.set(value, this.index(center.x - d, j), true);
                this.set(value, this.index(center.x + d, j), true);
            }

            value = (value + 1) % 2;
        }

        this.set(1, this.index(center.x, center.y), true);
    }

    public placeAlignmentPattern(center: Coordinate): void {
        let value: number = 1;
        for (let d = ALIGNMENT_PATTERN_CENTER; d >= 0; d--) {
            for (let i = center.x - d; i <= center.x + d; i++) {
                this.set(value, this.index(i, center.y - d), true);
                this.set(value, this.index(i, center.y + d), true);
            }

            for (let j = center.y - d; j <= center.y + d; j++) {
                this.set(value, this.index(center.x - d, j), true);
                this.set(value, this.index(center.x + d, j), true);
            }

            value ^= 1;
        }
    }

    public addTimingPattern(): void {
        let value: number = 1;
        for (let k = POSITION_MARKER_SIZE + 1; k < this.size - POSITION_MARKER_SIZE - 1; k++) {
            this.set(value, this.index(POSITION_MARKER_SIZE - 1, k), true);
            this.set(value, this.index(k, POSITION_MARKER_SIZE - 1), true);

            value ^= 1;
        }
    }

    public addFormatInformation(data: Uint8Array): void {
        let i: number = 0;
        for (let k = 0; k <= POSITION_MARKER_SIZE + 1; k++) {
            if (this.set(data[i], this.index(POSITION_MARKER_SIZE + 1, k), true)) {
                i++;
            }
        }

        for (let k = POSITION_MARKER_SIZE; k >= 0; k--) {
            if (this.set(data[i], this.index(k, POSITION_MARKER_SIZE + 1), true)) {
                i++;
            }
        }

        let j: number = 0;
        for (let k = this.size - 1; k > this.size - POSITION_MARKER_SIZE - 1; k--) {
            if (this.set(data[j], this.index(k, POSITION_MARKER_SIZE + 1), true)) {
                j++;
            }
        }

        for (let k = POSITION_MARKER_SIZE + 1; k > 0; k--) {
            if (this.set(data[j], this.index(POSITION_MARKER_SIZE + 1, this.size - k), true)) {
                j++;
            }
        }

        // The dark module
        this.set(1, this.index(this.size - POSITION_MARKER_SIZE - 1, POSITION_MARKER_SIZE + 1), true);
    }

    public addVersionInformation(version: number, data: Uint8Array): boolean {
        if (version < 7) {
            return false;
        }

        let index: number = VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH - 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 6; j++) {
                this.set(data[index], this.index(this.size - 1 - POSITION_MARKER_SIZE - 3 + (i % 3), j), true);
                this.set(data[index], this.index(j, this.size - 1 - POSITION_MARKER_SIZE - 3 + (i % 3)), true);

                index++;
            }
        }

        return index === -1;
    }

    public addData(data: Uint8Array): void {
        let up: boolean = true;
        let index: number = 0;
        let j: number = this.size - 1;
        while (j >= 0) {
            // Check for timing pattern
            let skip: boolean = true;
            for (let i = 0; i < this.size; i++) {
                skip &&= this.special[this.index(i, j)] > 0;
            }

            if (skip) {
                j--;
                continue;
            }

            let shift: number = 0;
            if (up) {
                for (let i = this.size - 1; i >= 0; i--) {
                    if (index >= data.length) {
                        break;
                    }

                    if (this.set(data[index], this.index(i + shift, j), false)) {
                        index++;
                    }

                    shift ^= 1;
                }
            } else {
                for (let i = 0; i < this.size; i++) {
                    if (index >= data.length) {
                        break;
                    }
                    
                    if (this.set(data[index], this.index(i + shift, j), false)) {
                        index++;
                    }

                    shift ^= 1;
                }
            }

            up = !up;
        }
    }

    private maskedModule(pattern: number, row: number, column: number): number {
        let module: number = this.matrix[this.index(row, column)] ^ 
            (!this.special[this.index(row, column)] && 
                this.condition(pattern, row, column) ? 1 : 0);

        return module;
    }

    private consecutiveFivePenalty(pattern: number): number {
        // Compute mask pattern penalty
        let penalty: number = 0;
        for (let i = 0; i < this.size; i++) {
            let count: number = 0;
            let value: number = -1;
            for (let j = 0; j < this.size; j++) {
                let module: number = this.maskedModule(pattern, i, j);
                if (module != value) {
                    count = 0;
                }

                value = module;
                count++;

                if (count >= 5) {
                    penalty += (count === 5 ? PENALTY.CONSECUTIVE_FIVE :
                        PENALTY.CONSECUTIVE_FIVE_PLUS);
                }
            }
        }

        for (let j = 0; j < this.size; j++) {
            let count: number = 0;
            let value: number = -1;
            for (let i = 0; i < this.size; i++) {
                let module: number = this.maskedModule(pattern, i, j);
                if (module !== value) {
                    count = 0;
                }

                value = module;
                count++;

                if (count >= 5) {
                    penalty += (count === 5 ? PENALTY.CONSECUTIVE_FIVE :
                        PENALTY.CONSECUTIVE_FIVE_PLUS);
                }
            }
        }

        return penalty;
    }

    private sameTwoCrossTwoPenalty(pattern: number): number {
        let penalty: number = 0;
        for (let i = 0; i < this.size - 1; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                let value: number = -1;
                let count: number = 0;

                for (let r = 0; r < 2; r++) {
                    for (let c = 0; c < 2; c++) {
                        let module: number = this.maskedModule(pattern, i + r, j + c);
                        if (module !== value) {
                            count = 0;
                        }

                        value = module;
                        count++;
                    }
                }

                if (count == 4) {
                    penalty += PENALTY.SAME_TWO_CROSS_TWO;
                }
            }
        }

        return penalty;
    }

    private finderPatternSimilarityPenalty(pattern: number): number {
        let penalty: number = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j <= this.size - SIMILARITY_PATTERN.length; j++) {
                let match: boolean = true;
                for (let k = 0; k < SIMILARITY_PATTERN.length; k++) {
                    let module: number = this.maskedModule(pattern, i, j + k);
                    match &&= module === SIMILARITY_PATTERN[k];
                }

                if (match) {
                    penalty += PENALTY.FINDER_PATTERN_SIMILARITY;
                }
            }

            for (let j = this.size - 1; j >= SIMILARITY_PATTERN.length - 1; j++) {
                let match: boolean = true;
                for (let k = 0; k < SIMILARITY_PATTERN.length; k++) {
                    let module: number = this.maskedModule(pattern, i, j - k);
                    match &&= module === SIMILARITY_PATTERN[k];
                }

                if (match) {
                    penalty += PENALTY.FINDER_PATTERN_SIMILARITY;
                }
            }
        }

        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i <= this.size - SIMILARITY_PATTERN.length; i++) {
                let match: boolean = true;
                for (let k = 0; k < SIMILARITY_PATTERN.length; k++) {
                    let module: number = this.maskedModule(pattern, i + k, j);
                    match &&= module === SIMILARITY_PATTERN[k];
                }

                if (match) {
                    penalty += PENALTY.FINDER_PATTERN_SIMILARITY;
                }
            }

            for (let i = this.size - 1; i >= SIMILARITY_PATTERN.length - 1; i++) {
                let match: boolean = true;
                for (let k = 0; k < SIMILARITY_PATTERN.length; k++) {
                    let module: number = this.maskedModule(pattern, i - k, j);
                    match &&= module === SIMILARITY_PATTERN[k];
                }

                if (match) {
                    penalty += PENALTY.FINDER_PATTERN_SIMILARITY;
                }
            }
        }

        return penalty;
    }

    private unevenRatioPenalty(pattern: number): number {
        // Compute mask pattern penalty
        let darks: number = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let module: number = this.maskedModule(pattern, i, j);
                if (module === 1) {
                    darks++;
                }
            }
        }

        let multiplier: number = Math.ceil(darks * 100 / (this.size * this.size * 5));
        let penalty: number = Math.min(multiplier, 10 - multiplier) * PENALTY.UNEVEN_RATIO;

        return penalty;
    }

    public applyMask(): number {
        // Find optimal mask pattern
        let minimumMaskPenalty: number = -1;
        let optimalMaskPattern: number = -1;
        for (let pattern: number = 0; pattern < BITS_IN_BYTE; pattern++) {
            let penalty: number = 0;
            
            penalty += this.consecutiveFivePenalty(pattern);
            penalty += this.sameTwoCrossTwoPenalty(pattern);
            penalty += this.finderPatternSimilarityPenalty(pattern);
            penalty += this.unevenRatioPenalty(pattern);

            if (minimumMaskPenalty === -1 || penalty < minimumMaskPenalty) {
                minimumMaskPenalty = penalty;
                optimalMaskPattern = pattern
            }
        }

        // Apply mask pattern
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let module: number = this.maskedModule(optimalMaskPattern, i, j);
                this.matrix[this.index(i, j)] = module;
            }
        }

        return optimalMaskPattern;
    }

    public interleave(blocks: Uint8Array[]): Uint8Array {
        let length: number = 0;
        blocks.forEach(block => {
            length += block.length;
        });

        let interleaved: Uint8Array = new Uint8Array(length);
        
        let i: number = 0;
        let j: number = 0;
        while (i < length) {
            for (const block of blocks) {
                if (j >= block.length) continue;
                
                interleaved.set(block.slice(j, j + BITS_IN_BYTE), i);
                i += BITS_IN_BYTE;
            }

            j += BITS_IN_BYTE;
        }

        return interleaved;
    }

    public merge(blocks: Uint8Array[]): Uint8Array {
        let length: number = 0;
        blocks.forEach(block => {
            length += block.length;
        });

        let merged: Uint8Array = new Uint8Array(length);

        let i: number = 0;
        for (const block of blocks) {
            merged.set(block, i);
            i += block.length;
        }

        return merged;
    }
}
