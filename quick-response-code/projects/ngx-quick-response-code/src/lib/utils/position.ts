import { Coordinate } from "./types";

export class PositionMarkers {
    constructor(private size: number) {
        this.topRight = {
            x: 0,
            y: this.size - POSITION_MARKER_SIZE
        }

        this.bottomLeft = {
            x: this.size - POSITION_MARKER_SIZE,
            y: 0
        }
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
