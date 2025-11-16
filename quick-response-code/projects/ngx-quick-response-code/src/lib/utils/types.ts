export interface Coordinate {
    x: number;
    y: number;
}

export interface Specification {
    encoding: number;
    version: number;
    level: number;
    pattern: number;
}

export interface Color {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export enum Special {
    DATA = 0,
    FINDER,
    ALIGNMENT,
    TIMING,
    DARK,
    FORMAT,
    VERSION,
};
