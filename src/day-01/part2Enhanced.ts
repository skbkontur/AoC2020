import { readToString } from "../stdin";

const YEAR = 2020;

async function calc() {
  const input = await readToString().then(res => res
    .trim()
    .split("\n")
    .map(i => parseInt(i, 10)));

  const values = new Set();
  for (let i = 0; i < input.length; i++) {
    values.add(input[i]);
  }
  
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
        const first = input[i];
        const second = input[j];
        const third = YEAR - (first + second);
        if (values.has(third)) {
          return first * second * third;
        }
    }
  }
}

calc().then(console.log);
