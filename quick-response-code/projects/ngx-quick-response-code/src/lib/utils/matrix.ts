import { Color, Coordinate, Special } from "./types";
import { ALIGNMENT_PATTERN_CENTER, BITS_IN_BYTE, BYTE_END, FORMAT_COMMENCE, FORMAT_MASK, PENALTY, QUIET_ZONE_SIZE, VALID_HEX_LENGTH } from "./constants";
import { POSITION_MARKER_CENTER, POSITION_MARKER_SIZE, SIMILARITY_PATTERN } from "./constants";
import { VERSION_DATA_LENGTH, VERSION_ERROR_LENGTH } from "./constants";

export class Matrix {
    private matrix: Uint8Array;
    private special: Uint8Array;
    
    constructor(private size: number,
        private quiet: number = QUIET_ZONE_SIZE, private scale: number = 1) {
        this.quiet = Math.max(this.quiet, QUIET_ZONE_SIZE);
        this.scale = Math.ceil(Math.abs(this.scale));

        this.matrix = new Uint8Array(size * size);
        this.special = new Uint8Array(size * size);
    }

    public condition(pattern: number, row: number, column: number): boolean {
        switch (pattern) {
            case 0:
                return (row + column) % 2 === 0;
            
            case 1:
                return row % 2 === 0;
            
            case 2:
                return column % 3 === 0;
            
            case 3:
                return (row + column) % 3 === 0;
            
            case 4:
                return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
            
            case 5:
                return (row + column) % 2 + (row * column) % 3 === 0;
            
            case 6:
                return ((row * column) % 3 + row * column) % 2 === 0;
            
            case 7:
                return ((row * column) % 3 + row + column) % 2 === 0;
        
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

    private set(value: number, index: number, special: Special = 0): boolean {
        if (index < 0) {
            return false;
        }

        if (this.special[index] > 0 && this.special[index] !== special) {
            return false;
        }

        this.matrix[index] = Math.max(Math.min(Math.round(value), 1), 0);
        this.special[index] = Math.max(special, this.special[index]);

        return true;
    }

    private get(index: number): number {
        if (index < 0 || index >= this.matrix.length) {
            return 0;
        }

        return this.matrix[index];
    }

    public imageSize(): number {
        return (this.size + this.quiet * 2) * this.scale;
    }

    public placeFinderPattern(center: Coordinate): void {
        let value: number = 0;
        for (let d = POSITION_MARKER_CENTER + 1; d > 0; d--) {
            for (let i = center.x - d; i <= center.x + d; i++) {
                this.set(value, this.index(i, center.y - d), Special.FINDER);
                this.set(value, this.index(i, center.y + d), Special.FINDER);
            }

            for (let j = center.y - d; j <= center.y + d; j++) {
                this.set(value, this.index(center.x - d, j), Special.FINDER);
                this.set(value, this.index(center.x + d, j), Special.FINDER);
            }

            value ^= 1;
        }

        this.set(1, this.index(center.x, center.y), Special.FINDER);
    }

    public placeAlignmentPattern(center: Coordinate): void {
        let value: number = 1;
        for (let d = ALIGNMENT_PATTERN_CENTER; d >= 0; d--) {
            for (let i = center.x - d; i <= center.x + d; i++) {
                this.set(value, this.index(i, center.y - d), Special.ALIGNMENT);
                this.set(value, this.index(i, center.y + d), Special.ALIGNMENT);
            }

            for (let j = center.y - d; j <= center.y + d; j++) {
                this.set(value, this.index(center.x - d, j), Special.ALIGNMENT);
                this.set(value, this.index(center.x + d, j), Special.ALIGNMENT);
            }

            value ^= 1;
        }
    }

    public addTimingPattern(): void {
        let value: number = 1;
        for (let k = POSITION_MARKER_SIZE + 1; k < this.size - POSITION_MARKER_SIZE - 1; k++) {
            this.set(value, this.index(POSITION_MARKER_SIZE - 1, k), Special.TIMING);
            this.set(value, this.index(k, POSITION_MARKER_SIZE - 1), Special.TIMING);

            value ^= 1;
        }
    }

    public addFormatInformation(data: Uint8Array): void {
        let decimal: number = FORMAT_MASK;
        for (let i: number = data.length - 1; i >= 0; i--) {
            data[i] ^= decimal & 1;
            decimal >>= 1;
        }

        let i: number = 0;
        for (let k = 0; k <= POSITION_MARKER_SIZE + 1; k++) {
            if (this.set(data[i],
                this.index(POSITION_MARKER_SIZE + 1, k),
                    Special.FORMAT)) {
                i++;
            }
        }

        for (let k = POSITION_MARKER_SIZE; k >= 0; k--) {
            if (this.set(data[i],
                this.index(k, POSITION_MARKER_SIZE + 1),
                    Special.FORMAT)) {
                i++;
            }
        }

        let j: number = 0;
        for (let k = this.size - 1; k > this.size - POSITION_MARKER_SIZE - 1; k--) {
            if (this.set(data[j],
                this.index(k, POSITION_MARKER_SIZE + 1),
                    Special.FORMAT)) {
                j++;
            }
        }

        for (let k = POSITION_MARKER_SIZE + 1; k > 0; k--) {
            if (this.set(data[j],
                this.index(POSITION_MARKER_SIZE + 1, this.size - k),
                    Special.FORMAT)) {
                j++;
            }
        }

        // The dark module
        this.set(1,
            this.index(this.size - POSITION_MARKER_SIZE - 1, POSITION_MARKER_SIZE + 1),
                Special.DARK);
    }

    public addVersionInformation(version: number, data: Uint8Array): boolean {
        if (version < FORMAT_COMMENCE) {
            return false;
        }

        let index: number;
        
        index = VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH - 1;
        for (let i: number = 0; i < 6; i++) {
            for (let j: number = 0; j < 3; j++) {
                this.set(data[index],
                    this.index(i, this.size - 1 - POSITION_MARKER_SIZE - 3 + j),
                        Special.VERSION);

                index--;
            }
        }

        index = VERSION_DATA_LENGTH + VERSION_ERROR_LENGTH - 1;
        for (let j: number = 0; j < 6; j++) {
            for (let i: number = 0; i < 3; i++) {
                this.set(data[index],
                    this.index(this.size - 1 - POSITION_MARKER_SIZE - 3 + i, j),
                        Special.VERSION);
                
                index--;
            }
        }

        return index === -1;
    }

    public addData(data: Uint8Array): void {
        let up: boolean = true;
        let index: number = 0;
        let j: number = this.size - 1;
        while (j > 0) {
            // Check for timing pattern
            let skip: boolean = true;
            for (let i = 0; i < this.size; i++) {
                skip &&= this.special[this.index(i, j)] > 0;
            }

            if (skip) {
                j--;
                continue;
            }

            for (let i: number = (up ? this.size - 1 : 0); (up ? i >= 0 : i < this.size); (up ? i--: i++)) {
                for (let k: number = 0; k < 2; k++) {
                    if (index >= data.length) {
                        break;
                    }

                    if (this.set(data[index], this.index(i, j - k))) {
                        index++;
                    }
                }
            }

            up = !up;
            j -= 2;
        }
    }

    private maskedModule(pattern: number, row: number, column: number): number {
        let i: number = this.index(row, column);
        return this.matrix[i] ^ (this.special[i] === 0 && 
            this.condition(pattern, row, column) ?
                1 : 0);
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
            for (let j = 0; j < this.size; j++) {
                let match: boolean;
                
                match = true;
                for (let k = 0; k < SIMILARITY_PATTERN.length; k++) {
                    if (j + k >= this.size) {
                        match = false;
                        break;
                    }

                    let module: number = this.maskedModule(pattern, i, j + k);
                    match &&= module === SIMILARITY_PATTERN[k];
                }

                if (match) {
                    penalty += PENALTY.FINDER_PATTERN_SIMILARITY;
                }

                match = true;
                for (let k = SIMILARITY_PATTERN.length - 1; k >= 0; k--) {
                    if (k + j >= this.size) {
                        match = false;
                        break;
                    }

                    let module: number = this.maskedModule(pattern, i,
                        j + SIMILARITY_PATTERN.length - 1 - k);
                    match &&= module === SIMILARITY_PATTERN[k];
                }

                if (match) {
                    penalty += PENALTY.FINDER_PATTERN_SIMILARITY;
                }
            }
        }

        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size; i++) {
                let match: boolean;
                
                match = true;
                for (let k = 0; k < SIMILARITY_PATTERN.length; k++) {
                    if (i + k >= this.size) {
                        match = false;
                        break;
                    }

                    let module: number = this.maskedModule(pattern, i + k, j);
                    match &&= module === SIMILARITY_PATTERN[k];
                }

                if (match) {
                    penalty += PENALTY.FINDER_PATTERN_SIMILARITY;
                }


                match = true;
                for (let k = SIMILARITY_PATTERN.length - 1; k >= 0; k--) {
                    if (i + k >= this.size) {
                        match = false;
                        break;
                    }

                    let module: number = this.maskedModule(pattern,
                        i + SIMILARITY_PATTERN.length - 1 - k, j);
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

        let value: number = darks * 100 / (this.size * this.size * 5);
        let penalty: number = Math.min(Math.ceil(value), Math.abs(10 - Math.ceil(value)),
            Math.floor(value), Math.abs(10 - Math.floor(value))) * 
                PENALTY.UNEVEN_RATIO;

        return penalty;
    }

    public applyOptimalMask(formatBlocks: Uint8Array[], errorBlocks: Uint8Array[]): number {
        // Find optimal mask pattern

        // TODO: check mask penalty
        let minimumMaskPenalty: number = -1;
        let optimalMaskPattern: number = -1;
        for (let pattern: number = 0; pattern < BITS_IN_BYTE; pattern++) {
            let penalty: number = 0;

            this.addFormatInformation(this.merge([formatBlocks[pattern],
                errorBlocks[pattern]]));
            
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

    public getScaledRGBAMap(light: Color, dark: Color): Uint8Array {
        const size: number = this.imageSize();
        let map: Uint8Array = new Uint8Array(size * size * 4);
        for (let i: number = 0; i < size; i++) {
            for (let j: number = 0; j < size; j++) {
                let values: Uint8Array = colorToArray((this.get(this.index(
                    Math.floor(i / this.scale) - this.quiet,
                    Math.floor(j / this.scale) - this.quiet
                )) === 1 ? dark : light));
                
                let k: number = (i * size + j) * 4;
                for (const value of values) {
                    map[k++] = value;
                }
            }
        }

        return map;
    }
}

export function colorToArray(color: Color): Uint8Array {
    return new Uint8Array([
        Math.min(BYTE_END, Math.max(0, color.red)),
        Math.min(BYTE_END, Math.max(0, color.green)),
        Math.min(BYTE_END, Math.max(0, color.blue)),
        Math.min(BYTE_END, Math.max(0, color.alpha))
    ]);
}

export function hexToColor(hex: string): Color {
    let color: Color = {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0
    };

    hex = hex.trim().replace('#', '');
    if (!VALID_HEX_LENGTH.includes(hex.length)) {
        return color;
    }

    if (hex.length < 6) {
        hex = hex.split('').flatMap(
            code => Array.from({length: 2}, () => code)
        ).join('');
    }

    if (hex.length == 6) {
        hex += "FF";
    }

    let value: number = parseInt(hex, BITS_IN_BYTE * 2);
    color.alpha = value & BYTE_END;
    value >>= BITS_IN_BYTE;
    color.blue = value & BYTE_END;
    value >>= BITS_IN_BYTE;
    color.green = value & BYTE_END;
    value >>= BITS_IN_BYTE;
    color.red = value & BYTE_END;

    return color;
}
