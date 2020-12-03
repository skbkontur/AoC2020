import { readToString } from "../stdin";

async function solvePart1() {
    const input = await readToString().then(res => res
        .trim()
        .split("\n"));
    const result = calculateNumberOfTrees(input, 3, 1);
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

solvePart1().then(console.log);