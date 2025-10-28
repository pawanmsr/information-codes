# Quick Response Code

Standalone library for Angular applications.

## Structure

Identification, alignment, encoding, data and error.

## Size

Module is the smallest unit in a quick response code. They are non-zero fixed sized squares of uniform colour. An empty module is white coloured. Data is encoded from the bottom right corner in a two module wide column read sequentially and vertically. QR code is a square with side length of $$17 + 4 \times version$$ modules. Storage capacity increases with version.

## Frame

4 module thick additional empty space that bounds the two-dimensional matrix. Also called **Quiet Zone**.

### Position

$$7 \times 7$$ squares at the top left, top right, and bottom left corners surrounded by empty modules on the inward-side called **Separator**. They are called **Finder Patterns** or **Position Markers**. They are used to locate and determine rotational orientation.

### Alignment

The two dimensional matrix can be divided into $$n \times n$$ square grids with n ranging from 2 to 6 and side length of each grid greater than or equal to 15 modules. A $$5 \times 5$$ **Alignment Patterns** is placed at the center of each grids bar the grids on the top left, top right and bottom left corner grids. They are used to correct for distortion and tilt orientation.

### Format

Lines just beyond the empty modules of **Position Markers**. Top left position marker contains both vertical and horizontal format lines. Top right position marker has horizontal **Format Information** line on it's bottom. Bottom left position marker has vertical **Format Information** line on it's right. They are used to specify masking pattern and error correction level.

### Version

**Version Information** is encoded on the top of the bottom left position marker and left of the top right position marker. This is redundant optional.

### Extra

**Timing Patters** are odd length lines of alternating modules connecting inside corners of **Position Markers**. They are used to determine the size of each module. There is a dark module at row $$4 * version + 10$$ from bottom and column 9 from the left. Rest of the remaining modules are used for error correction and data.

## Data

Versions 1 to 40.

### Encoding

| Encoding      | Code  |
|---------------|-------|
| Numeric       | 0001  |
| Alphanumeric  | 0010  |
| Byte          | 0100  |
| Kanji Kana    | 1000  |

### Error Correction

Reed Solomon Algorithm

| Level     | Redundancy    |
|-----------|---------------|
| Low       | 7%            |
| Medium    | 15%           |
| Quartile  | 25%           |
| High      | 30%           |

### Masking

Mask pattern is chosen to balance the ratio of dark to light modules, minimize consecutive modules of same colour, and distinguish data modules from fixed patterns such as alignment pattern and position markers.

| Value     | Formulae                                  |
|-----------|-------------------------------------------|
| 000       | $$ (i + j) \% 2 = 0 $$                    |
| 001       | $$ i \% 2 = 0 $$                          |
| 010       | $$ j \% 3 = 0 $$                          |
| 011       | $$ (i + j) \% 3 = 0 $$                    |
| 100       | $$ (i / 2 + j / 3) \% 2 = 0 $$            |
| 101       | $$ (i * j) \% 2 + (i * j) \% 3 = 0 $$     |
| 110       | $$ ((i * j) \% 3 + i * j) \% 2 = 0 $$     |
| 111       | $$ ((i * j) \% 3 + i + j) \% 2 = 0 $$     |

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.1.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
