export type PersonID = `person-${number}`;

export interface Person {
  id: PersonID;
  name: string;
  birthDate: Date;
}
