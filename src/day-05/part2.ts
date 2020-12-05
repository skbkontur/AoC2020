import { readToString } from "../stdin";

const lowerSeatId = 7;
const higherSeatIt = 127 * 8;

export async function main() {
  const input = await readToString();
  const tickets = input.split("\n");

  const seats: number[] = [];
  for (const ticket of tickets) {
    const bitNumberFromTicket = ticket
      .replace(/F/g, '0').replace(/B/g, '1')
      .replace(/L/g, '0').replace(/R/g, '1');
    const seatId = parseInt(bitNumberFromTicket, 2);
    if (seatId > lowerSeatId && seatId < higherSeatIt) {
      seats.push(seatId);
    }
  }
  seats.sort((a, b) => a - b);
  const missed = seats.find((seat, i) => seats[i + 1] - seat === 2);
  if (missed) {
    console.log(missed + 1);
  }
}

main();
