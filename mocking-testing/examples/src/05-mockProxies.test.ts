import { TestUtils } from './code';

const { asMock, createMockProxy } = TestUtils;

interface PersonService {
  getAge(name: string): number;
  getHeight(): string;
}

describe('createMockProxy', () => {
  const personService = createMockProxy<PersonService>({
    getAge: jest.fn((name: string) => name.length),
  });

  it('should mock a type', () => {
    const height = '5ft 10in';
    asMock(personService.getHeight).mockReturnValue(height);

    expect(asMock(personService.getAge).getMockName()).toEqual('jest.fn()');
    expect(asMock(personService.getHeight).getMockName()).toEqual('getHeight');

    expect(personService.getAge('John')).toEqual(4);
    expect(personService.getHeight()).toEqual(height);
  });
});

describe('simple proxy', () => {
  const personService = new Proxy(
    {},
    {
      get(_target, propKey) {
        return `proxied-${String(propKey)}`;
      },
    }
  ) as PersonService;

  it('should proxy property access', () => {
    expect(personService.getAge).toEqual('proxied-getAge');
    expect(personService.getHeight).toEqual('proxied-getHeight');
  });
});
