class Matrix {
    constructor() {}

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
