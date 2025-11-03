import { Coordinate } from "./types";

class Alignment {
    public positions: number[] = [];

    constructor(private version: number) {
        if (version > 1) {
            this.generate();
        }
    }

    private generate(): void {
        let distance = 4 * this.version + 4;
        let intervals = Math.floor(this.version / 7 + 1);
        let step = Math.round(distance / intervals);

        step += step % 2;

        this.positions.push(6);
        for (let i = 0; i < intervals; i++) {
            this.positions.push(6 + distance - step * (intervals - i - 1));
        }
    }

    public asArray(): Coordinate[] {
        let n: number = this.positions.length;

        let coordinates: Coordinate[] = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i == 0 && j == 0) continue;
                if (i == 0 && j == n - 1) continue;
                if (i == n - 1 && j == 0) continue;

                coordinates.push({
                    x: this.positions[i],
                    y: this.positions[j]
                });
            }
        }

        return coordinates;
    }
}
