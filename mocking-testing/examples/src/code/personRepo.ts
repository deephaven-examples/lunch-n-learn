import { Person, PersonID } from './personModel';

const cache = new Map<PersonID, Person>([
  [
    'person-1',
    {
      id: 'person-1',
      name: 'John',
      birthDate: new Date('1990-01-01'),
    },
  ],
  [
    'person-2',
    {
      id: 'person-2',
      name: 'Jane',
      birthDate: new Date('1995-01-01'),
    },
  ],
]);

export class PersonRepo {
  static _is: number;

  static get id(): number {
    return PersonRepo._is;
  }
  static set id(value: number) {
    PersonRepo._is = value;
  }

  static getPersonById(personId: PersonID): Person | undefined {
    return cache.get(personId);
  }
}

export default PersonRepo;
