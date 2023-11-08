import { getNameLength } from './code/personUtils';

beforeEach(() => {
  jest.clearAllMocks();
  expect.hasAssertions();
});

describe('getNameLength', () => {
  const mockName = 'John';

  const getNameAnonymous = jest.fn();
  getNameAnonymous.mockReturnValue(mockName);

  const getNameNamed = jest.fn().mockName('getName');
  getNameNamed.mockReturnValue(mockName);

  const getNameNamed2 = jest.fn().mockName('getName2');
  getNameNamed2.mockImplementation(() => mockName);

  const getNameImplemented = jest.fn(() => mockName);

  it.each([
    ['anonymous', getNameAnonymous],
    ['named', getNameNamed],
    ['named2', getNameNamed2],
    ['implemented', getNameImplemented],
  ])('should call getName: %s', (_label, getName) => {
    const actual = getNameLength('person-1', getName);

    expect(getName).toHaveBeenCalled();
    expect(actual).toEqual(mockName.length);
  });

  it.each([
    ['anonymous', getNameAnonymous],
    ['named', getNameNamed],
    ['named2', getNameNamed2],
    ['implemented', getNameImplemented],
  ])('should call getName: %s', (_label, getName) => {
    expect(getName).not.toHaveBeenCalled();
  });
});

describe('mock constructor', () => {
  const Person = jest.fn().mockName('Person');

  it('should track instances', () => {
    const person1 = new Person('person1');
    const person2 = new Person('person2');

    expect(Person).toHaveBeenCalledTimes(2);
    expect(Person).toHaveBeenCalledWith('person1');
    expect(Person).toHaveBeenCalledWith('person2');

    expect(Person.mock.instances[0]).toBe(person1);
    expect(Person.mock.instances[1]).toBe(person2);

    expect(Person.mock.calls[0]).toEqual(['person1']);
    expect(Person.mock.calls[1]).toEqual(['person2']);
  });
});
