export type Coordinate = {
    x: number;
    y: number;
};

export type Specification = {
    encoding: number;
    version: number;
    level: number;
    pattern: number;
};

export type Color = {
    red: number;
    green: number;
    blue: number;
    alpha: number;
};

export enum Special {
    DATA = 0,
    FINDER,
    ALIGNMENT,
    TIMING,
    DARK,
    FORMAT,
    VERSION,
}
