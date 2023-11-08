# Lunch 'n' Learn - Mocking and testing tips 'n' tricks

## Mocking

![Ha ha](haha.jpeg)

> Mocking is a process used in unit testing when the unit being tested has external dependencies. The purpose of mocking is to isolate and focus on the code being tested and not on the behavior or state of external dependencies. - [telerik.com](https://www.telerik.com/products/mocking/unit-testing.aspx#:~:text=Mocking%20is%20a%20process%20used,or%20state%20of%20external%20dependencies.)

## Running Examples

- Open workspace (`lunch-n-learn.code-workspace`) in vscode
- Hit f5 to run "Mocking Examples - Debug" launch config
- Type in test name or just hit enter. Terminal should show jest running in watch mode with options

## Function Mocks

### Purpose

- Configure the behavior of a function
- Track function calls and class instances

### Details

- [jest.fn<TResult, TArgs extends any[]>()](https://jestjs.io/docs/mock-functions)
  - Can be called with no implementation or with an implementation
  - Recommend to name instances via `mockName()`
  - Tracks calls on `.mock` property

### Examples

- [01-mockFunctions.test.ts](examples/src/01-mockFunctions.test.ts)

## Module Mocks

Jest allows full and partial mocking of imported modules.

- [requireActual](https://jestjs.io/docs/jest-object#jestrequireactualmodulename)
- [Manual mocks](https://jestjs.io/docs/manual-mocks)
- [Auto mocks](https://jestjs.io/docs/es6-class-mocks#automatic-mock)
- [Full Module](https://jestjs.io/docs/mock-functions#mocking-modules)
- [Partial Module](https://jestjs.io/docs/mock-functions#mocking-partials)
  - \_\_esModule: true - shouldn't be needed if spreading `requireActual('...')`

### Caveats

- [jest.mock is hoisted](https://jestjs.io/docs/manual-mocks#using-with-es-module-imports) (enabling ECMAScript modules breaks this) - This means it runs before other imports and before variables declared
- Can't mock dependencies in same module that is being mocked

### Examples

- [02-moduleMocksManual.test.ts](examples/src/02-moduleMocksManual.test.ts)
- [03-moduleMocksPartials.test.ts](examples/src/03-moduleMocksPartials.test.ts)
- [IrisGridTheme.test.ts](https://github.com/deephaven/web-client-ui/blob/61d1a537ac9df31e3fe3dad95107b065a12ebd3b/packages/iris-grid/src/IrisGridTheme.test.ts#L7-L10) (DHC repo)

## Spies

[jest.spyOn(object, methodName, accessType?)](https://jestjs.io/docs/jest-object#jestspyonobject-methodname)

- Used to spy on methods (also props)
- Can just spy, or mock the implementation

### Examples

- [04-spies.test.ts](examples/src/04-spies.test.ts)

## Setup / Teardown

General Guidance

- Start each test with clean slate (beforeEach)
- Assert that each test actually tests something (expect.hasAssertions())
- Cleanup when you are done (afterAll)

### Lifecycle Functions

- [beforeAll](https://jestjs.io/docs/api#beforeallfn-timeout)
- [beforeEach](https://jestjs.io/docs/api#beforeeachfn-timeout)
- [afterEach](https://jestjs.io/docs/api#aftereachfn-timeout)
- [afterAll](https://jestjs.io/docs/api#afterallfn-timeout)

### Cleanup Utils

- [mockClear](https://jestjs.io/docs/mock-function-api#mockfnmockclear) - clear data from mocks being called
- [mockReset](https://jestjs.io/docs/mock-function-api#mockfnmockreset) - mockClear + clear mock implementation
- [mockRestore](https://jestjs.io/docs/mock-function-api#mockfnmockrestore) - mockClear + restore real implementation

### Examples

- [01-mockFunctions.test.ts](examples/src/01-mockFunctions.test.ts)

## Proxies

- [createMockProxy (MockProxy)](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/utils/src/MockProxy.ts#L45) - mocks a type defaulting property access to return mock functions with name of property.
- manual Proxy creation - es6 Proxy

### Examples

- [05-mockProxies.test.ts](examples/src/05-mockProxies.test.ts)

## CSS Mocks

`babel-jest` doesn't handle CSS imports by default.

- [identity-object-proxy](https://www.npmjs.com/package/identity-obj-proxy) ([configuration](<(https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/jest.config.base.cjs#L18)>)) - imports a Proxy that will return name of property accessed
- [mockCssImportPlugin.js](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/babel-preset/mockCssImportPlugin.js) ([configuration](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/jest.config.base.cjs#L9)) - Babel transform for CSS module imports and imports with Vite `?inline` / `?raw` query strings

### Examples

- [Raw css imports code](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/components/src/theme/theme-dark/index.ts#L1-L6)
- [Raw css imports test](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/components/src/theme/ThemeUtils.test.ts#L216-L221)

## Timer Mocks

Jest allows [mocking of timer apis](https://jestjs.io/docs/timer-mocks) (setTimeout, setInterval, clearTimeout, clearInterval). [API Docs](https://jestjs.io/docs/jest-object#fake-timers)

- [useFakeTimers](https://jestjs.io/docs/timer-mocks#enable-fake-timers)
- [useRealTimers](https://jestjs.io/docs/timer-mocks#enable-fake-timers)
- [runAllTimers](https://jestjs.io/docs/timer-mocks#run-all-timers)
- [runOnlyPendingTimers](https://jestjs.io/docs/timer-mocks#run-pending-timers)
- [advanceTimersByTime](https://jestjs.io/docs/timer-mocks#advance-timers-by-time)
- [doNotFake](https://jestjs.io/docs/timer-mocks#selective-faking)

> NOTE: Jest doesn't come with a built-in way to flush ES6 promises when mock timers are being used. We have a helper util [flushPromises](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/utils/src/TestUtils.ts#L182-L184) to help with this.

### Examples

- [PromiseUtils.test.ts](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/utils/src/PromiseUtils.test.ts#L42-L83)
- [useAsyncInterval.test.ts](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/react-hooks/src/useAsyncInterval.test.ts#L128)

## Deephaven Test Utils

- @deephaven/utils
  - [asMock](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/utils/src/TestUtils.ts#L69-L71)
  - [createMockProxy (MockProxy)](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/utils/src/MockProxy.ts#L45)
  - [flushPromises](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/utils/src/TestUtils.ts#L182-L184) - Jest doesn't include a built-in way to flush ES6 promises when using fake timers
- @deephaven/babel-preset
  - [mockCssImportPlugin.js](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/packages/babel-preset/mockCssImportPlugin.js) ([configuration](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/jest.config.base.cjs#L9))

### Examples

- [02-moduleMocksManual.test.ts](examples/src/02-moduleMocksManual.test.ts)

## Test Configuration

- [transform](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/jest.config.base.cjs#L4) - Configure transformer functions that can transform content. We use `babel-jest` transformer for most of our .ts / .js files.

  > Note: If you use a custom transform instead of babel-jest on an es6 file, the module won't get transformed, and import statements will choke upstream. If you use babel-jest, css?raw imports are ignored. I ended up using a custom Babel plugin instead

- [moduleNameMapper](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/jest.config.base.cjs#L17) - maps module paths via config. Supports regex replace in path
- resolver - maps module paths via code
- [Babel plugins](https://github.com/deephaven/web-client-ui/blob/d5b3b485dfc95248bdd1d664152c6c1ab288720a/jest.config.base.cjs#L9) - `babel-jest` support Babel plugins. We use a custom plugin for transforming css imports

## Debugging Config

- Add a launch config to `.vscode/launch.json` for attaching to `node` processes.

  ```jsonc
  {
    "type": "node",
    "request": "attach",
    "name": "Attach",
    "port": 9229
  }
  ```

See [Debugging in Vscode](https://jestjs.io/docs/troubleshooting#debugging-in-vs-code)
