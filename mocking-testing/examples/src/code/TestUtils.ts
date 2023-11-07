export class TestUtils {
  static asMock = <TResult, TArgs extends unknown[]>(
    fn: (...args: TArgs) => TResult
  ): jest.Mock<TResult, TArgs> => fn as unknown as jest.Mock<TResult, TArgs>;
}
