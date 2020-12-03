import { readToString } from "../stdin";


async function solvePart2() {
    const input = await readToString().then(res => res
        .trim()
        .split("\n"));
    const result = calculateNumberOfTrees(input, 1, 1) *
        calculateNumberOfTrees(input, 3, 1) *
        calculateNumberOfTrees(input, 5, 1) *
        calculateNumberOfTrees(input, 7, 1) *
        calculateNumberOfTrees(input, 1, 2)
    return result;
}

function calculateNumberOfTrees(map: string[], xSteps: number, ySteps: number) {
    const width = map[0].length;
    let result = 0;
    let x = 0;
    let y = 0;
    while (y < map.length) {
        if (map[y][x] == '#')
            result++;
        y += ySteps;
        x = (x + xSteps) % width;
    }
    return result;
}

solvePart2().then(console.log);