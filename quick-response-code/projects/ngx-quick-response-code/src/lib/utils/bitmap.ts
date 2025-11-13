import { QUIET_ZONE_SIZE } from "./constants";
import { Color } from "./types";

export class Bitmap {
    constructor(private quiet: number, private size: number,
        private data: (i: number, j: number) => number) {
        this.quiet = Math.max(this.quiet, QUIET_ZONE_SIZE);
    }

    private colorValues(color: Color): Uint8Array {
        return new Uint8Array(
            [color.red, color.green, color.blue, color.alpha]
        );
    }

    public generateRGBAMap(light: Color, dark: Color): Uint8Array {
        let map: Uint8Array = new Uint8Array(this.size * this.size * 4);
        for (let i: number = 0; i < this.size; i++) {
            for (let j: number = 0; j < this.size; j++) {
                let k: number = (i * this.size + j) * 4;
                for (const value of this.colorValues(this.data(i, j) === 1 ? dark : light)) {
                    map[k++] = value;
                }
            }
        }

        return map;
    }
}
