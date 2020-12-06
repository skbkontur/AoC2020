import { readToString } from "../stdin";

async function solvePart1() {
  const rawInput = (await readToString()).trim();
  const groups = rawInput.split("\n\n").map((s) => s.replace(/\n/g, ""));
  const result = groups.reduce(
    (prev, current) => prev + new Set(current).size,
    0
  );
  return result;
}

solvePart1().then(console.log);
