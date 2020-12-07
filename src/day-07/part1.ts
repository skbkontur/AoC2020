import { readToLinesIterator } from "../stdin";
import { parsePart1 as parse } from "./parser";

const myBagColor = "shiny gold";

type Graph = Map<string, Array<string>>;

async function solve() {
  const graph: Graph = new Map();
  for await (const line of readToLinesIterator()) {
    const { parent, children } = parse(line);
    for (const child of children) {
      if (graph.has(child)) {
        graph.get(child)!.push(parent);
      } else {
        graph.set(child, [parent]);
      }
    }
  }
  const includingBags = getIncludingBags(graph, myBagColor);
  return includingBags.size;
}

const getIncludingBags = (
  graph: Graph,
  bagColor: string,
  includingBags = new Set<string>()
) => {
  const parents = graph.get(bagColor);
  if (parents) {
    for (const parent of parents) {
      includingBags.add(parent);
      getIncludingBags(graph, parent, includingBags);
    }
  }
  return includingBags;
};

solve().then(console.log);
