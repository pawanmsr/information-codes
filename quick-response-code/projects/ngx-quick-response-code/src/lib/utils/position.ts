import { Coordinate } from "./types";

export class PositionMarker {
    constructor(private size: number) {
        this.TopRight = {
            x: 0,
            y: this.size - POSITION_MARKER_SIZE,
        }

        this.BottomLeft = {
            x: this.size - POSITION_MARKER_SIZE,
            y: 0
        }
    }

    TopRight: Coordinate;
    BottomLeft: Coordinate;
    TopLeft: Coordinate = {
        x: 0,
        y: 0
    };
}
