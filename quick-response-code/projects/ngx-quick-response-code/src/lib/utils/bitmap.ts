import { QUIET_ZONE_SIZE } from "./constants";

export class Bitmap {
    constructor(private quiet: number) {
        this.quiet = Math.max(this.quiet, QUIET_ZONE_SIZE);
    }
}
