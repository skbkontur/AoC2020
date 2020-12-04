import { getPassports, importantFieldNames, Passport } from "./parser";

const yearRegex = /^\d{4}$/;
function isYear(year: string) {
  return yearRegex.test(year);
}

function isInRange(number: number, min: number, max: number) {
  return number >= min && number <= max;
}

const heightRegex = /^\d+(cm|in)$/;
function isValidHeight(height: string) {
  if (!heightRegex.test(height)) {
    return false;
  }
  if (height.endsWith("cm")) {
    const value = parseInt(height, 10);
    return isInRange(value, 150, 193);
  }
  if (height.endsWith("in")) {
    const value = parseInt(height, 10);
    return isInRange(value, 59, 76);
  }
  return false;
}

const hairColorRegex = /^#[0-9a-f]{6}$/;
function isValidHairColor(color: string) {
  return hairColorRegex.test(color);
}

const eyeColors = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);
function isValidEyeColor(color: string) {
  return eyeColors.has(color);
}

const pidRegex = /^\d{9}$/;
function isValidPid(pid: string) {
  return pidRegex.test(pid);
}

function isValidField(name: string, value: string) {
  switch (name) {
    case "byr":
      // byr (Birth Year) - four digits; at least 1920 and at most 2002.
      return isYear(value) && isInRange(parseInt(value, 10), 1920, 2002);
    case "iyr":
      // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
      return isYear(value) && isInRange(parseInt(value, 10), 2010, 2020);
    case "eyr":
      // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
      return isYear(value) && isInRange(parseInt(value, 10), 2020, 2030);
    case "hgt":
      // hgt (Height) - a number followed by either cm or in:
      //   If cm, the number must be at least 150 and at most 193.
      //   If in, the number must be at least 59 and at most 76.
      return isValidHeight(value);
    case "hcl":
      // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
      return isValidHairColor(value);
    case "ecl":
      // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
      return isValidEyeColor(value);
    case "pid":
      // pid (Passport ID) - a nine-digit number, including leading zeroes.
      return isValidPid(value);
    default:
      return false;
  }
}

function allFieldsAreValid(passport: Passport) {
  for (const [name, value] of Object.entries(passport)) {
    if (!isValidField(name, value)) {
      return false;
    }
  }
  return true;
}

function hasAllFields(passport: Passport) {
  return Object.keys(passport).length === importantFieldNames.size;
}

function isValidPassport(passport: Passport) {
  return hasAllFields(passport) && allFieldsAreValid(passport);
}

async function main() {
  const passports = await getPassports();
  const validCount = passports.filter(isValidPassport).length;
  console.log(validCount);
}

main();
