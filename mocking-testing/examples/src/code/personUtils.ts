import { PersonRepo } from '.';
import { dateDiff, getNow } from './dateUtils';
import { PersonID } from './personModel';

/**
 * Get the length of a person's name using a `getName` function.
 */
export function getNameLength(
  personId: PersonID,
  getName: (personId: PersonID) => string
) {
  return getName(personId).length;
}

export function getAge(personId: PersonID): number | null {
  const person = PersonRepo.getPersonById(personId);

  if (person == null) {
    return null;
  }

  return dateDiff(getNow(), person.birthDate);
}
