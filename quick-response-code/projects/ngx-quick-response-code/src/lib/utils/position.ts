import { Coordinate } from "./types";

export class Markers {
    constructor(private version: number) {
        this.topRight = {
            x: 0,
            y: this.size(version) - POSITION_MARKER_SIZE
        }

        this.bottomLeft = {
            x: this.size(version) - POSITION_MARKER_SIZE,
            y: 0
        }
    }

    private size(version: number): number {
        return version * 4 + 17;
    }

    private gaps(version: number): number {
        return this.size(version) - 6 - 7;
    }

    public topRight: Coordinate;
    public bottomLeft: Coordinate;
    public topLeft: Coordinate = {
        x: 0,
        y: 0
    };

    public asArray(): Coordinate[] {
        return [this.topLeft, this.topRight, this.bottomLeft];
    }
}
