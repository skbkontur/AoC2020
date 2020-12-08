import { readToString } from "../../stdin";

async function run() {
    const lines = await readToString().then(res => res.trim().split(/\r?\n/))

    let accumulator = 0;
    let current = 0;
    let executed = new Set<number>();

    while (lines.length !== current) {
        if (executed.has(current)) {
            break;
        }

        executed.add(current);
        const [nextAcc, next] = execute(lines[current], accumulator, current);
        accumulator = nextAcc;
        current = next;
    }

    return accumulator;
}

function execute(line: string, accumulator: number, current: number): [number, number] {
    const [instruction, digit] = line.split(/\s/);
    switch (instruction) {
        case "nop":
            return [accumulator, current + 1];
        case "acc":
            return [accumulator + parseInt(digit), current + 1];
        case "jmp":
            return [accumulator, current + parseInt(digit)];
        default:
            throw new Error(`Unknow command: ${instruction} at line ${current}: ${line}`);
    }
}

run().then(console.log);