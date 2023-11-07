export function dateDiff(date1: Date, date2: Date): number {
  return date1.valueOf() - date2.valueOf();
}

export function getNow(): Date {
  return new Date();
}
