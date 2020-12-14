import { readToString } from "../stdin";

/**
 *
 * @param input: строчка вида `mem[\d*] = \d*`
 */
function parseCommand(input: string): { address: bigint, value: number } {
  const [, address, , value] = input.split(/[=\[\]]/).map(x => parseInt(x, 10));

  return { address: BigInt(address), value };
}

function binaryToBigInt(value: string): bigint {
  return BigInt(parseInt(value, 2));
}

/**
 * mask:  X1001X
 *
 *
 * address: 101010
 *    mask:  X1001X
 *    mask0: 010010
 *    maskX: 100001
 *   ~maskX: 011110
 *
 *  subMask: 100001
 *
 *  address: 101010
 *  ~maskX:  011110 (AND) - Пропускаем исходные биты во всех местах, кроме иксов
 *  result:  001010
 *  mask0:   010010 (OR) - Перезаписываем единички из маски
 *  result:  011010
 *  subMask: 100001 (OR) - Перебираем плавающие биты маски
 *  result:  111011
 *
 *
 *  mask:   X1001X
 *  subMask: 100001
 *  maskX:  оставляем маску из иксов, самую большую возможную маску
 *  maskX:  100001
 *  maskX - 1 = 100000 - убираем самую правую единичку из маски
 *            & 100001 (subMask)
 *            = 100000
 *
 *  100000 - 1 = 011111
 *             & 100001 (subMask)
 *             = 000001: выкинули лишние единички, которых в маске быть не может
 *
 */
async function solve() {
  const input = (await readToString()).split("\r\n").filter(x => x);

  const memory = new Map<bigint, number>();
  let mask0 = 0n;
  let maskX = 0n;

  for (let command of input) {
    if (command.startsWith("mask")) {
      const mask = command.split(" = ")[1];
      mask0 = binaryToBigInt(mask.replace(/X/g, "0"));
      maskX = binaryToBigInt(mask.replace(/1/g, "0").replace(/X/g, "1"));
      continue;
    }
    setValues(command, maskX, mask0, memory);
  }

  return Array.from(memory.values()).reduce((sum, value) => sum + value);
}

function setValues(command: string, maskX: bigint, mask0: bigint, memory: Map<bigint, number>) {
  const { address, value } = parseCommand(command);

  for (let subMaskX = maskX; ; subMaskX = (subMaskX - 1n) & maskX) {
    const possibleAddress = (address & ~maskX) | mask0 | subMaskX;
    memory.set(possibleAddress, value);
    if (subMaskX === 0n) {
      break;
    }
  }
}

solve().then(console.log);
