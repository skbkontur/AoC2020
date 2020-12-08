import { readToString } from "../stdin";

interface State {
    accumulator: number;
    current: number;
}

type Instruction = "nop" | "jmp" | "acc";
type Command = (state: State, arg: number) => State;

const commands: Record<Instruction, Command> = {
    "nop": (state) => ({ accumulator: state.accumulator, current: state.current + 1 }),
    "jmp": (state, arg) => ({ accumulator: state.accumulator, current: state.current + arg }),
    "acc": (state, arg) => ({ accumulator: state.accumulator + arg, current: state.current + 1 }),
}

const tryFixCommands: Record<Instruction, Command> = {
    "acc": commands["acc"],
    "nop": commands["jmp"],
    "jmp": commands["nop"],
}

function parse(line: string): [Instruction, number] {
    const [instruction, arg] = line.split(/\s/);

    if (instruction in commands) {
        return [instruction as Instruction, parseInt(arg)];
    }

    throw new Error(`Unknow command: ${instruction} at line ${line}`);
}

async function run() {
    const lines = await readToString().then(res => res.trim().split(/\r?\n/))

    let state: State = { accumulator: 0, current: 0 };
    let executed = new Set<number>();

    while (lines.length !== state.current) {
        executed.add(state.current);

        const [instruction, arg] = parse(lines[state.current]);
        let nextState = tryFixCommands[instruction](state, arg);

        if (instruction === "jmp" || instruction === "nop") {
            const [finished, finshedState] = tryFinish(lines, nextState, executed);

            if (finished) {
                return finshedState.accumulator;
            }

            nextState = commands[instruction](state, arg)
        }

        state = nextState;
    }

    return state.accumulator;
}

function tryFinish(lines: string[], state: State, executed: Set<number>): [boolean, State] {
    executed = new Set(executed);

    while (lines.length !== state.current) {
        if (executed.has(state.current)) {
            return [false, state];
        }
        executed.add(state.current);

        const [instruction, arg] = parse(lines[state.current]);
        state = commands[instruction](state, arg);
    }

    return [true, state];
}

run().then(console.log);