import { readToString } from "../stdin";

/* *
* @param input: строчка вида `mask = [X10]{36}`
*/
function parseMask(input: string): string[] {
  return input.split(" = ")[1].split("");
}

/**
 *
 * @param input: строчка вида `mem[\d*] = \d*`
 */
function parseCommand(input: string): { address: number, value: string } {
  const [, address, , value] = input.split(/[=\[\]]/).map(x => parseInt(x, 10));

  return { address, value: value.toString(2).padStart(36, "0") };
}

function applyMask(value: string, mask: string[]): string {
  return mask.map((maskBit, i) => {
    const valueBit = value[i];
    return maskBit === "X" ? valueBit : maskBit;
  }).join("");
}

async function solve() {
  const input = (await readToString()).split("\r\n").filter(x => x);

  const memory: { [address: number]: number } = {};
  let mask: string[] = [];

  for (let command of input) {
    if (command.startsWith("mask")) {
      mask = parseMask(command);
      continue;
    }
    const { address, value } = parseCommand(command);
    const maskedValue = applyMask(value, mask);
    memory[address] = parseInt(maskedValue, 2);
  }

  return Object.values(memory).reduce((sum, value) => sum + value);
}

solve().then(console.log);
