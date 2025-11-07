import { Coordinate } from "./types";

class Matrix {
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
                return (row / 2 + column / 3) % 2 === 0;
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

    public addFormatInformation(format: Uint8Array): void {
        let i: number = 0;
        for (let k = 0; k < POSITION_MARKER_SIZE + 2; k++) {
            if (this.set(format[i], this.index(POSITION_MARKER_SIZE + 1, k), true)) {
                i++;
            }
        }

        for (let k = POSITION_MARKER_SIZE; k >= 0; k--) {
            if (this.set(format[i], this.index(k, POSITION_MARKER_SIZE + 1), true)) {
                i++;
            }
        }

        let j: number = 0;
        for (let k = 0; k < POSITION_MARKER_SIZE + 1; k++) {
            if (this.set(format[j], this.index(POSITION_MARKER_SIZE + 1, this.size - 1 - k), true)) {
                j++;
            }
        }

        for (let k = this.size - 1; k > this.size - POSITION_MARKER_SIZE - 1; k--) {
            if (this.set(format[j], this.index(k, POSITION_MARKER_SIZE + 1), true)) {
                j++;
            }
        }

        // The dark module
        this.set(1, this.index(this.size - POSITION_MARKER_SIZE - 1, POSITION_MARKER_SIZE + 1), true);
    }

    public addVersionInformation(version: number): boolean {
        if (version < 7) {
            return false;
        }

        // Encode version information

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 6; j++) {
                this.set(1, this.index(this.size - POSITION_MARKER_SIZE - 2 - i, j), true);
                this.set(1, this.index(j, this.size - POSITION_MARKER_SIZE - 2 - i), true);
            }
        }

        return true;
    }

    public addData(data: Uint8Array): void {
        let up: boolean = true;
        let index: number = 0;
        for (let j = this.size - 1; j >= 0; j-=2) {
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

    private consecutiveFivePenalty(): number {
        // Computer mask pattern penalty
        return 0;
    }

    private sameTwoCrossTwoPenalty(): number {
        // Computer mask pattern penalty
        return 0;
    }

    private finderPatternSimilarityPenalty(): number {
        // Computer mask pattern penalty
        return 0;
    }

    private unevenRatioPenalty(): number {
        // Computer mask pattern penalty
        return 0;
    }

    public applyMask(): void {
        // Find optimal mask pattern
        let minimumMaskPenalty: number = -1;
        let optimalMaskPattern: number = -1;
        for (let pattern: number = 0; pattern < BITS_IN_BYTE; pattern++) {
            let penalty: number = 0;
            penalty += this.consecutiveFivePenalty();
            penalty += this.sameTwoCrossTwoPenalty();
            penalty += this.finderPatternSimilarityPenalty();
            penalty += this.unevenRatioPenalty();

            if (minimumMaskPenalty === -1 || penalty < minimumMaskPenalty) {
                minimumMaskPenalty = penalty;
                optimalMaskPattern = pattern
            }
        }

        // TODO: Apply optimal mask pattern
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
                
                for (let k = 0; k < BITS_IN_BYTE; k++) {
                    interleaved[i] = block[j + k];
                    i++;
                }
            }

            j += BITS_IN_BYTE;
        }

        return interleaved;
    }
}
