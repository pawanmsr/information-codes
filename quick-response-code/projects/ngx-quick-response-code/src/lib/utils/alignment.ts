import { Coordinate } from "./types";

class Alignment {
    public coordinates: Coordinate[] = [];

    constructor(private version: number) {
        this.generate();
    }

    public generate() {
        // generate coordinates
    }
}
