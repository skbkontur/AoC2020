import { readToString } from "../stdin";

export interface Passport {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
}

export const importantFieldNames = new Set([
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid",
]);

function parsePassport(input: string): Passport {
  const fields = input.split(/\s/);
  const allFields = fields.map((field) => field.split(":"));
  const importantFields = allFields.filter(([name, value]) =>
    importantFieldNames.has(name)
  );
  return Object.fromEntries(importantFields);
}

export async function getPassports() {
  const input = await readToString();
  const documents = input.split("\n\n");
  return documents.map(parsePassport);
}
