import { createInterface } from "readline";

export async function readToString() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

export async function* readToLinesIterator() {
  process.stdin.setEncoding("utf-8");
  const rl = createInterface({ input: process.stdin });
  for await (const line of rl) {
    yield line;
  }
}
