import { readToLinesIterator } from "../stdin";
import { parsePart2 as parse } from "./parser";

const myBagColor = "shiny gold";

type Graph = Map<string, Array<{ color: string; count: number }>>;

async function solve() {
  const graph: Graph = new Map();
  for await (const line of readToLinesIterator()) {
    const { parent, children } = parse(line);
    graph.set(parent, children);
  }
  return getNestedBagsCount(graph, myBagColor);
}

const getNestedBagsCount = (tree: Graph, bag: string) => {
  let nestedBagsCount = 0;
  const children = tree.get(bag);
  if (children) {
    for (const { count, color } of children) {
      nestedBagsCount += count + (count * getNestedBagsCount(tree, color));
    }
  }
  return nestedBagsCount;
};

solve().then(console.log);
