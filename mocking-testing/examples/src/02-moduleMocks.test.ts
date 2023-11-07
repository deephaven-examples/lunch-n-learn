import { TestUtils } from './code/TestUtils';
import { PersonRepo, getAge } from './code';
import { dateDiff, getNow } from './code/dateUtils';

const { asMock } = TestUtils;

jest.mock('./code/dateUtils', () => ({
  ...jest.requireActual('./code/dateUtils'),
  getNow: jest.fn(),
}));

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
    expect(actual).toEqual(expectedAge);
  });
});
