# Lunch 'n' Learn - Mocking and testing tips 'n' tricks

## Function Mocks

- `jest.fn<TResult, TArgs extends any[]>()`
  - Can be called with no implementation or with an implementation
  - Recommend to name instances via `mockName()`
  - Tracks calls on `.mock` property

### Examples

- [01-mockFunctions.test.ts](examples/src/01-mockFunctions.test.ts)

## Module mocks

- requireActual
- Auto vs manual
- \_\_esModule

### Examples

- [02-moduleMocks.test.ts](examples/src/02-moduleMocks.test.ts)
- Single export on a module:
  [IrisGridTheme.test.ts](https://github.com/deephaven/web-client-ui/blob/61d1a537ac9df31e3fe3dad95107b065a12ebd3b/packages/iris-grid/src/IrisGridTheme.test.ts#L7-L10)

## Spies

## Setup / Teardown

- Start each test with clean slate (beforeEach)
- Assert that each test actually tests something (expect.hasAssertions())
- Cleanup when you are done (afterAll)

### Jest Utils

- [mockClear](https://jestjs.io/docs/mock-function-api#mockfnmockclear) - clear data from mocks being called
- [mockReset](https://jestjs.io/docs/mock-function-api#mockfnmockreset) - mockClear + clear mock implementation
- [mockRestore](https://jestjs.io/docs/mock-function-api#mockfnmockrestore) - mockClear + restore real implementation

### Examples

- [01-mockFunctions.test.ts](examples/src/01-mockFunctions.test.ts)

## Timer mocks

## Deephaven Test Utils

- @deephaven/utils
  - asMock
  - createMockProxy (MockProxy)
  - flushPromises
- @deephaven/babel-preset
  - mockCssImportPlugin.js

## Test Configuration

- moduleNameMapper
- transform
- Babel plugins

## Debugging

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
