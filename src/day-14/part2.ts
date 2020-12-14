import { readToString } from "../stdin";

/* *
* @param input: строчка вида `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X`
*/
function parseMask(input: string): string[] {
  return input.split(" = ")[1].split("");
}

/**
 *
 * @param input: строчка вида `mem[\d*] = \d*`
 */
function parseCommand(input: string): { address: string, value: number } {
  const [, address, , value] = input.split(/[=\[\]]/).map(x => parseInt(x, 10));

  return { address: address.toString(2).padStart(36, "0"), value };
}

function applyMask(value: string, mask: string[]): string[] {
  return mask.map((maskBit, i) => {
    const valueBit = value[i];
    return maskBit === "0" ? valueBit : maskBit;
  });
}

function replaceElement<T>(array: T[], idx: number, element: T) {
  return [...array.slice(0, idx), element, ...array.slice(idx + 1, array.length)];
}

function replaceFloatingBits(value: string[], result: number[] = [], idx: number = 0): number[] {
  while (idx < value.length && value[idx] !== "X") {
    idx++;
  }

  if (idx === value.length) {
    result.push(parseInt(value.join(""), 2));
    return result;
  }

  replaceFloatingBits(replaceElement(value, idx, "0"), result, idx + 1);
  replaceFloatingBits(replaceElement(value, idx, "1"), result, idx + 1);

  return result;
}

function getAddresses(value: string, mask: string[]): number[] {
  const maskedAddress = applyMask(value, mask);
  return replaceFloatingBits(maskedAddress);
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
    for (const possibleAddress of getAddresses(address, mask)) {
      memory[possibleAddress] = value;
    }
  }

  return Object.values(memory).reduce((sum, value) => sum + value);
}

solve().then(console.log);
