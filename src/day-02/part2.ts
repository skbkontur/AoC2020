import { readToLinesIterator } from "../stdin";
import { parse } from "./parser";

async function solvePart2() {
  let validPasswordsCount = 0;
  for await (const line of readToLinesIterator()) {
    const { left: pos1, right: pos2, letter, password } = parse(line);
    const containsLetterInPos1 = password[pos1 - 1] === letter;
    const containsLetterInPos2 = password[pos2 - 1] === letter;
    if (containsLetterInPos1 !== containsLetterInPos2) {
      validPasswordsCount++;
    }
  }
  return validPasswordsCount;
}

solvePart2().then(console.log);
