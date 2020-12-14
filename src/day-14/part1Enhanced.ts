import { readToString } from "../stdin";

/**
 *
 * @param input: строчка вида `mem[\d*] = \d*`
 */
function parseCommand(input: string): { address: number, value: bigint } {
  const [, address, , value] = input.split(/[=\[\]]/).map(x => parseInt(x, 10));

  return { address, value: BigInt(value) };
}

function binaryToBigInt(value: string): bigint {
  return BigInt(parseInt(value, 2));
}

/**
 *    mask:  X1XXXX0X
 *    mask1: 11111101
 *    mask0: 01000001
 *
 */

/**
 *    value: 00001011
 *    mask:  X1XXXX0X
 *
 *
 *    value: 00001011
 *    mask0: 01000001 (OR)
 *   result: 01001011 - заменили ИКС на ноль, пропускаем биты исходного числа
 *
 *
 *    value: 00001011
 *   result: 01001011
 *    mask1: 11111101 (AND)
 *   result: 01001001 - пропускаем биты из маски
 *
 *    mask:  X1XXXX0X
 *
 */
async function solve() {
  const input = (await readToString()).split("\r\n").filter(x => x);

  const memory: { [address: number]: bigint } = {};
  let mask: string;
  let mask0 = 0n;
  let mask1 = 0n;

  for (let command of input) {
    if (command.startsWith("mask")) {
      mask = command.split(" = ")[1];
      mask0 = binaryToBigInt(mask.replace(/X/g, "0"));
      mask1 = binaryToBigInt(mask.replace(/X/g, "1"));
    } else {
      const { address, value } = parseCommand(command);
      memory[address] = (value | mask0) & mask1;
    }
  }

  return Object.values(memory).reduce((sum, value) => sum + value);
}

solve().then(console.log);
