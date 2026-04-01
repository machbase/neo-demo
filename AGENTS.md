
# Project Guidelines

## Runtime

- Write code in JavaScript.
- Target the Machbase Neo JSH runtime, not plain Node.js. JSH is only partially Node.js-compatible.
- Prefer JSH built-in modules and documented APIs before adding third-party packages.
- JSH introduction: https://docs.machbase.com/neo/jsh/index.md
- To run a `.js` file manually, use `machbase-neo jsh <file.js>`.
- The location of the `machbase-neo` executable varies by environment, so always ask the user for its path before requesting or attempting local execution.

## Code Conventions

- Follow the existing CommonJS style with `require(...)`.
- Prefer JSH-compatible APIs and output patterns already used in the workspace, such as `console.println()`.
- Avoid Node.js-only features unless the JSH documentation confirms compatibility.

## Build And Validation

- There is no standard automated test command defined in `package.json`.
- When validation is needed, prefer the smallest relevant JSH execution command after confirming the `machbase-neo` executable path with the user.

## Packages And package.json

- Package documentation: https://docs.machbase.com/neo/jsh/packages.md
- Keep package usage compatible with JSH package behavior.

## Global APIs

- JSH globals such as `console`, `setTimeout`, `setInterval`, and `setImmediate` are documented here: https://docs.machbase.com/neo/jsh/global.md

## Module System

- JSH module system: https://docs.machbase.com/neo/jsh/modules/index.md

## Built-in Modules

- `archive/tar`: Create and extract TAR archives using in-memory helpers, callback wrappers, stream-style APIs, or the file-oriented `Tar` class. Open this when working with `.tar` bytes, saving archives to disk, or extracting selected entries. https://docs.machbase.com/neo/jsh/modules/archive/tar.md
- `archive/zip`: Create and extract ZIP archives using in-memory helpers, callback wrappers, stream-style APIs, or the file-oriented `Zip` class. Open this when working with `.zip` bytes, saving archives to disk, or extracting selected entries. https://docs.machbase.com/neo/jsh/modules/archive/zip.md
- `fs`: Synchronous Node.js-compatible filesystem APIs for reading, writing, copying, renaming, deleting, listing, streaming, and inspecting files or directories. Open this for path, file descriptor, or directory operations. https://docs.machbase.com/neo/jsh/modules/fs.md
- `http`: Node.js-compatible HTTP client and server APIs. Open this for requests, response parsing, route handlers, REST endpoints, static files, redirects, or HTML template responses. https://docs.machbase.com/neo/jsh/modules/http.md
- `machcli`: Machbase database client APIs. Open this for connecting, running `query()` or `queryRow()`, executing DDL or DML with `exec()`, explaining SQL, bulk append, or inspecting Machbase table and column metadata helpers. https://docs.machbase.com/neo/jsh/modules/machcli.md
- `mathx`: General numeric and statistical helpers such as array generation, sorting, descriptive statistics, correlation, regression, quantiles, entropy, and FFT. Open this when basic `Math` is not enough and you need dataset-oriented numeric functions. https://docs.machbase.com/neo/jsh/modules/mathx/index.md
- `mathx/filter`: Stateful filters for sampled numeric data, including running average, moving average, low-pass filtering, Kalman filtering, and Kalman smoothing. Open this when transforming noisy sequential values. https://docs.machbase.com/neo/jsh/modules/mathx/filter.md
- `mathx/interp`: Interpolation models including piecewise constant, piecewise linear, Akima spline, Fritsch-Butland, linear regression, and several cubic spline variants. Open this when fitting sample points and predicting intermediate values. https://docs.machbase.com/neo/jsh/modules/mathx/interp.md
- `mathx/mat`: Matrix and vector APIs centered on `Dense`, `VecDense`, QR factorization, solving linear systems, matrix arithmetic, and formatted matrix output. Open this for linear algebra work rather than scalar statistics. https://docs.machbase.com/neo/jsh/modules/mathx/mat.md
- `mathx/simplex`: Seeded Simplex noise generator with 1D to 4D `eval()` methods. Open this when deterministic noise values are needed from numeric coordinates. https://docs.machbase.com/neo/jsh/modules/mathx/simplex.md
- `mathx/spatial`: Spatial math helper currently documented for `haversine()` great-circle distance calculation between latitude and longitude points. Open this specifically for earth-distance calculations. https://docs.machbase.com/neo/jsh/modules/mathx/spatial.md
- `mqtt`: Event-driven MQTT client with broker connection options plus `publish()`, `subscribe()`, `unsubscribe()`, and MQTT v5 properties support. Open this for broker messaging flows and message event handling. https://docs.machbase.com/neo/jsh/modules/mqtt.md
- `net`: Node.js-compatible TCP APIs with `createServer()`, `createConnection()` / `connect()`, socket events, and IP validation helpers. Open this for raw TCP client or server code. https://docs.machbase.com/neo/jsh/modules/net.md
- `opcua`: OPC UA client APIs with node read, write, browse, paginated browse, and children lookup operations plus related request and result types. Open this for OPC UA device or server integration. https://docs.machbase.com/neo/jsh/modules/opcua.md
- `os`: Node.js-compatible operating system information APIs covering platform, memory, uptime, CPUs, interfaces, disks, host info, user info, and signal or priority constants. Open this for host inspection and runtime environment data. https://docs.machbase.com/neo/jsh/modules/os.md
- `pretty`: Terminal output helpers for table rendering, progress indicators, byte or integer or duration formatting, row helpers, alignment constants, and terminal utilities. Open this when output formatting matters more than raw `console.println()` text. https://docs.machbase.com/neo/jsh/modules/pretty.md
- `process`: JSH process APIs for argv and env access, cwd changes, command execution, shutdown hooks, timers and event-loop helpers, signals, stdio, runtime metadata, and process lifecycle control. Open this for CLI behavior, process control, or script execution concerns. https://docs.machbase.com/neo/jsh/modules/process.md