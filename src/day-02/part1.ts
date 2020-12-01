import { readToLinesIterator } from "../stdin";
import { parse } from "./parser";

async function solvePart1() {
  let validPasswordsCount = 0;
  for await (const line of readToLinesIterator()) {
    const { left: from, right: to, letter, password } = parse(line);
    const letterCount = (password.match(new RegExp(letter, "g")) || []).length;
    if (from <= letterCount && letterCount <= to) {
      validPasswordsCount++;
    }
  }
  return validPasswordsCount;
}

solvePart1().then(console.log);
