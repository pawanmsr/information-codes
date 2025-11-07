import { Coordinate } from "./types";

export class Markers {
    constructor(private version: number) {
        this.topRight = {
            x: 3,
            y: this.size(version) - POSITION_MARKER_SIZE + 3
        }

        this.bottomLeft = {
            x: this.size(version) - POSITION_MARKER_SIZE + 3,
            y: 3
        }

        if (version > 1) {
            this.generate();
        }
    }

    private size(version: number): number {
        return version * VERSION_MULTIPLIER + 17;
    }

    private distance(version: number): number {
        return this.size(version) - 6 - 7;
    }

    private generate(): void {
        let distance = this.distance(this.version);
        let intervals = Math.floor(this.version / 7 + 1);
        let step = Math.round(distance / intervals);

        step += step % 2;

        this.positions.push(6);
        for (let i = 0; i < intervals; i++) {
            this.positions.push(6 + distance - step * (intervals - i - 1));
        }
    }

    private positions: number[] = [];

    // TODO: make private?
    public topRight: Coordinate;
    public bottomLeft: Coordinate;
    public topLeft: Coordinate = {
        x: 3,
        y: 3
    };

    public finderPatterns(): Coordinate[] {
        return [this.topLeft, this.topRight, this.bottomLeft];
    }

    public alignmentPatterns(): Coordinate[] {
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
