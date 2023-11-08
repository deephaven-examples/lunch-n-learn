import { PersonRepo } from './code';

describe('spy example', () => {
  const person1 = PersonRepo.getPersonById('person-1')!;
  const person2 = PersonRepo.getPersonById('person-2')!;

  it('should spy on PersonRepo.getPersonById', () => {
    const getPersonByIdSpy = jest.spyOn(PersonRepo, 'getPersonById');

    // Only spying
    expect(PersonRepo.getPersonById('person-1')).toBeDefined();
    expect(PersonRepo.getPersonById).toHaveBeenCalledWith('person-1');

    // Mock return value
    getPersonByIdSpy.mockReturnValue(undefined);
    expect(PersonRepo.getPersonById('person-1')).toBeUndefined();

    // Mock implementation
    getPersonByIdSpy.mockImplementation(id =>
      id === 'person-1' ? person1 : person2
    );
    expect(PersonRepo.getPersonById('person-1')).toBe(person1);
    expect(PersonRepo.getPersonById('person-2')).toBe(person2);

    // Restore to original implementation
    jest.restoreAllMocks();
    expect(PersonRepo.getPersonById('person-1')).toBeDefined();
  });

  it('should spy on getter / setters', () => {
    const getSpy = jest.spyOn(PersonRepo, 'id', 'get');
    const setSpy = jest.spyOn(PersonRepo, 'id', 'set');

    const givenId = 999;

    PersonRepo.id = givenId;
    expect(PersonRepo.id).toEqual(givenId);

    expect(getSpy).toHaveBeenCalled();
    expect(setSpy).toHaveBeenCalledWith(givenId);
  });
});
