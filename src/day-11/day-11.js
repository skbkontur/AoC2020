// @ts-check

/**
 * @param {string} input
 *
 * @returns {string[][]}
 */
function parseInput(input) {
  return input.split("\n").map((line) => line.split(""));
}

// prettier-ignore
const deltas = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

/**
 * @param {string[][]} seatMap
 * @param {number} x
 * @param {number} y
 *
 * @returns {number}
 */
function countAdjacentOccupiedSeats(seatMap, x, y) {
  return deltas.filter(([dx, dy]) => seatMap[dy + y]?.[dx + x] === "#").length;
}

/**
 * @param {string[][]} seatMap
 * @param {(ch: string, x: number, y: number) => string} cb
 *
 * @returns {string[][]}
 */
function walkThroughSeatMap(seatMap, cb) {
  return seatMap.map((row, y) => row.map((ch, x) => cb(ch, x, y)));
}

/**
 *
 * @param {string[][]} mapA
 * @param {string[][]} mapB
 */
function isEqual(mapA, mapB) {
  if (!mapA || !mapB) {
    return false;
  }
  return mapA.every((row, y) => row.every((ch, x) => mapB[y]?.[x] === ch));
}

/**
 * @param {string} input
 */
function part1(input) {
  let curMap = parseInput(input);
  let prevMap;

  while (!isEqual(curMap, prevMap)) {
    prevMap = curMap;
    curMap = walkThroughSeatMap(curMap, (ch, x, y) => {
      if (ch === "L" && countAdjacentOccupiedSeats(curMap, x, y) === 0) {
        return "#";
      }
      if (ch === "#" && countAdjacentOccupiedSeats(curMap, x, y) > 3) {
        return "L";
      }
      return ch;
    });
  }

  return curMap
    .map((row) => row.filter((x) => x === "#").length)
    .reduce((a, b) => a + b, 0);
}

/**
 *
 * @param {string[][]} map
 * @param {number} x
 * @param {number} y
 */
function countVisibleOccupiedSeats(map, x, y) {
  return deltas.filter(([dx, dy]) => {
    let x2 = x + dx;
    let y2 = y + dy;
    let ch = map[y2] && map[y2][x2];
    while (ch === ".") {
      x2 += dx;
      y2 += dy;
      ch = map[y2] && map[y2][x2];
    }
    return ch === "#";
  }).length;
}

/**
 * @param {string} input
 */
function part2(input) {
  let curMap = parseInput(input);
  let prevMap;

  while (!isEqual(curMap, prevMap)) {
    prevMap = curMap;
    curMap = walkThroughSeatMap(curMap, (ch, x, y) => {
      if (ch === "L" && countVisibleOccupiedSeats(curMap, x, y) === 0) {
        return "#";
      }
      if (ch === "#" && countVisibleOccupiedSeats(curMap, x, y) > 4) {
        return "L";
      }
      return ch;
    });
  }

  return curMap
    .map((row) => row.filter((x) => x === "#").length)
    .reduce((a, b) => a + b, 0);
}

require("../stdin")
  .readToString()
  .then((input) => {
    input = input.trim();
    console.log("Part 1:", part1(input));
    console.log("Part 2:", part2(input));
  });
