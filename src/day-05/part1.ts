import { readToString } from "../stdin";

export async function main() {
  const input = await readToString();
  const tickets = input.split("\n");

  let max = 0;
  for (const ticket of tickets) {
    const rowString = ticket.slice(0, 7);
    const columnStr = ticket.slice(-3);
    const row = parseInt(rowString.replace(/F/g, '0').replace(/B/g, '1'), 2);
    const col = parseInt(columnStr.replace(/L/g, '0').replace(/R/g, '1'), 2);

    const seatId = row * 8 + col;
    max = seatId > max ? seatId : max;
  }

  console.log(max);
}

main();
