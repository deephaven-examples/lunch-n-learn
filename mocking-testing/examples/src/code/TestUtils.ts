import createMockProxy from './MockProxy';

/** Subset copied from @deephaven/utils */
export class TestUtils {
  /**
   * Type assertion to "cast" a function to it's corresponding jest.Mock
   * function type. Note that this is a types only helper for type assertions.
   * It will not actually convert a non-mock function.
   *
   * e.g.
   *
   * // This is actually a jest.Mock fn, but the type annotation hides this.
   * const someFunc: (name: string) => number = jest.fn(
   *   (name: string): number => name.length
   * );
   *
   * // `asMock` will infer the type as jest.Mock<number, [string]> which gives
   * // us the ability to call `mockImplementation` in a type safe way.
   * TestUtils.asMock(someFunc).mockImplementation(name => name.split(',').length)
   */
  static asMock = <TResult, TArgs extends unknown[]>(
    fn: (...args: TArgs) => TResult
  ): jest.Mock<TResult, TArgs> => fn as unknown as jest.Mock<TResult, TArgs>;

  /**
   * Creates a mock object for a type `T` using a Proxy object. Each prop can
   * optionally be set via the constructor. Any prop that is not set will be set
   * to a jest.fn() instance on first access with the exeption of "then" which
   * will not be automatically proxied.
   * @param overrides Optional props to explicitly set on the Proxy.
   */
  static createMockProxy = createMockProxy;
}
