export const parse = (line: string) => {
  const [bounds, letter, password] = line.split(/:? /);
  const [left, right] = bounds.split("-").map((x) => parseInt(x, 10));

  return {
    left,
    right,
    letter,
    password,
  };
};

export const parse1 = (line: string) => {
  const [, left, right, letter, password] = line.match(
    /(\d+)-(\d+) (\w+): (\w+)/
  )!;

  return {
    left: parseInt(left, 10),
    right: parseInt(right, 10),
    letter,
    password,
  };
};
