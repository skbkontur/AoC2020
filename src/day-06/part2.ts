import { readToString } from "../stdin";

async function solvePart2() {
    const input = (await readToString()).split('\n\n');

    let sum = 0;
    for (const group of input) {
        const answers = group.split('\n');
        const firstLetters = answers[0].split('');
        
        sum += firstLetters.filter(l => answers.every(a => a.includes(l))).length;
    }
    return sum;
}

solvePart2().then(console.log);
