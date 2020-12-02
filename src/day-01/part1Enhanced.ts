import { readToString } from "../stdin";

const YEAR = 2020;

async function calc() {
  const input = await readToString().then(res => res
    .trim()
    .split("\n")
    .map(i => parseInt(i, 10)));

  const values = new Set();  
  for (let i = 0; i < input.length; i++) {
    const diff = YEAR - input[i];
    if (values.has(diff)) {
      return input[i] * diff;
    }
    values.add(input[i]);
  }
}

calc().then(console.log);
