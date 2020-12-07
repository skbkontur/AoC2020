export function parsePart1(line: string) {
  const [parent, ...children] = line
    .replace(/ bags?|\.|\d+ /g, "")
    .split(/ contain |, /g);

  return {
    parent,
    children,
  };
}

export function otherParsePart1(line: string) {
  const words = line.split(" ");
  const parent = `${words[0]} ${words[1]}`;
  const content = words.slice(4).join(" ").split(", ");
  const children = content.map((i) => {
    const contentWords = i.split(" ");
    return `${contentWords[1]} ${contentWords[2]}`;
  });

  return {
    parent,
    children,
  };
}

export function parsePart2(line: string) {
  const [parent, ...rest] = line
    .replace(/ bags?|\./g, "")
    .split(/ contain |, /g);
  const children = rest
    .filter((child) => child !== "no other")
    .map((child) => {
      const [, count, color] = child.match(/(\d+) (.*)/)!;
      return {
        color,
        count: parseInt(count, 10),
      };
    });

  return {
    parent,
    children,
  };
}
