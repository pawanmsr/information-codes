import { BITS_IN_BYTE, POSITION_MARKER_CENTER, POSITION_MARKER_SIZE, VERSION_MULTIPLIER } from "./constants";
import { Coordinate } from "./types";

export class Markers {
    constructor(private version: number) {
        this.topRight = {
            x: POSITION_MARKER_CENTER,
            y: this.size() - POSITION_MARKER_SIZE + POSITION_MARKER_CENTER
        }

        this.bottomLeft = {
            x: this.size() - POSITION_MARKER_SIZE + POSITION_MARKER_CENTER,
            y: POSITION_MARKER_CENTER
        }

        if (version > 1) {
            this.generate();
        }
    }

    public size(): number {
        return this.version * VERSION_MULTIPLIER + 17;
    }

    public scale(maximumSize: number = (1 << BITS_IN_BYTE)): number {
        return Math.max(1, Math.floor(maximumSize / this.size()));
    }

    private distance(): number {
        return this.size() - 6 - 7;
    }

    private generate(): void {
        let distance = this.distance();
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
