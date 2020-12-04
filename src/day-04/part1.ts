import { getPassports, importantFieldNames, Passport } from "./parser";

function isValidPassport(passport: Passport) {
  return Object.keys(passport).length === importantFieldNames.size;
}

async function main() {
  const passports = await getPassports();
  const validCount = passports.filter(isValidPassport).length;
  console.log(validCount);
}

main();
