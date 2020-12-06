import { readToString } from "../stdin";

async function solvePart2() {
  const rawInput = (await readToString()).trim();
  const groups = rawInput.split("\n\n");
  const result = groups.reduce(
    (prev, current) => prev + countForGroup(current),
    0
  );
  return result;
}

function countForGroup(group: string): number {
  const passengerAnswers = group.split("\n");
  const resultSet = passengerAnswers
    .slice(1)
    .reduce(
      (prev, current) => intersection(prev, new Set(current)),
      new Set(passengerAnswers[0])
    );
    return resultSet.size;
}

const intersection = (set1: Set<string>, set2: Set<string>) =>
  new Set([...set1].filter((x) => set2.has(x)));

solvePart2().then(console.log);
