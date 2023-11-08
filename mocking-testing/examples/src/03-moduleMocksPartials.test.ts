import { TestUtils } from './code/TestUtils';
import { PersonRepo, getAge } from './code';
import { dateDiff, getDayOfWeek, getNow } from './code/dateUtils';

const { asMock } = TestUtils;

jest.mock('./code/dateUtils', () => {
  const actual = jest.requireActual('./code/dateUtils');

  return {
    ...actual,
    getNow: jest.fn(),
    getDayOfWeek: jest.fn(actual.getDayOfWeek),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  expect.hasAssertions();
});

describe('getAge', () => {
  const mockNow = new Date('2020-01-01');
  const person1 = PersonRepo.getPersonById('person-1')!;

  beforeEach(() => {
    asMock(getNow).mockName('getNow').mockReturnValue(mockNow);
  });

  it('should return the age of the person with given id', () => {
    const expectedAge = dateDiff(mockNow, person1.birthDate);

    const actual = getAge(person1.id);

    expect(getNow).toHaveBeenCalled();
    expect(actual).toBeDefined();
    expect(actual).toEqual(expectedAge);
  });
});

describe('getDayOfWeek', () => {
  it('should return the day of the week', () => {
    const mockDate = new Date('2020-01-01');
    const expectedDay = 2;

    const actual = getDayOfWeek(mockDate);

    expect(getDayOfWeek).toHaveBeenCalledWith(mockDate);
    expect(actual).toEqual(expectedDay);
  });
});
