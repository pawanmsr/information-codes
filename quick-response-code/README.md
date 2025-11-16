# Quick Response Code

Workspace for quick response code generation, scanning and related libraries.

## NGX Quick Response Code

See [README](/quick-response-code/projects/ngx-quick-response-code/README.md) for more information.

## Quick Response Decoder

TODO: CPP/JAVA

1. Scan field of view to detect finder patterns.
2. Align image with help of alignment pattern(s).
3. Translate modules into codewords.
4. Decipher.

## Development

This workspace was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0.

### Building

To build the library, run:

```bash
ng build ngx-quick-response-code

```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

#### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:

```bash
cd dist/ngx-quick-response-code

```

2. Run the `npm publish` command to publish your library to the npm registry:

```bash
npm publish

```

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

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
