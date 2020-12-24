use std::collections::{HashMap, HashSet};
use std::io::Read;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut buffer = String::new();
    std::io::stdin().read_to_string(&mut buffer)?;
    println!("{:?}", part_1(&buffer));
    println!("{:?}", part_2(&buffer));
    Ok(())
}

fn part_1(grid: &str) -> Option<usize> {
    let tiles = parse(grid)?;
    let black_tiles = flip_tiles(&tiles);
    Some(black_tiles.len())
}

fn part_2(grid: &str) -> Option<usize> {
    let tiles = parse(grid)?;
    let black_tiles = flip_tiles(&tiles);
    let black_tiles = make_n_steps(black_tiles, 100);
    Some(black_tiles.len())
}

#[derive(Debug, Clone, Copy)]
enum Direction {
    East,
    SouthEast,
    SouthWest,
    West,
    NorthWest,
    NorthEast,
}

type Tile = Vec<Direction>;
type Grid = Vec<Tile>;

fn parse(grid: &str) -> Option<Grid> {
    grid.lines().map(parse_tile).collect()
}

fn parse_tile(tile: &str) -> Option<Tile> {
    let mut chars = tile.chars();
    let mut path = Vec::new();
    while let Some(letter) = chars.next() {
        let direction = match letter {
            'e' => Direction::East,
            'w' => Direction::West,
            's' | 'n' => {
                let next_letter = chars.next()?;
                match (letter, next_letter) {
                    ('s', 'e') => Direction::SouthEast,
                    ('s', 'w') => Direction::SouthWest,
                    ('n', 'w') => Direction::NorthWest,
                    ('n', 'e') => Direction::NorthEast,
                    _ => return None,
                }
            }
            _ => return None,
        };
        path.push(direction);
    }
    Some(path)
}

// doubled coordinates from https://www.redblobgames.com/grids/hexagons/
//
//   NW  ∅  NE     y x =>
// W  ∅  ⬢  ∅  E  ||
//   SW  ∅  SE     ˅
//

type Point = (i32, i32);

impl Direction {
    fn offset(&self) -> Point {
        match self {
            Direction::East => (2, 0),
            Direction::SouthEast => (1, 1),
            Direction::SouthWest => (-1, 1),
            Direction::West => (-2, 0),
            Direction::NorthWest => (-1, -1),
            Direction::NorthEast => (1, -1),
        }
    }

    const ALL: [Direction; 6] = [
        Direction::East,
        Direction::SouthEast,
        Direction::SouthWest,
        Direction::West,
        Direction::NorthWest,
        Direction::NorthEast,
    ];
}

fn flip_tiles(tiles: &Grid) -> HashSet<Point> {
    let mut black = HashSet::new();
    for tile in tiles {
        let point = tile
            .iter()
            .map(|direction| direction.offset())
            .fold((0, 0), |(x, y), (dx, dy)| (x + dx, y + dy));
        if black.contains(&point) {
            black.remove(&point);
        } else {
            black.insert(point);
        }
    }
    black
}

fn make_n_steps(initial: HashSet<Point>, n: usize) -> HashSet<Point> {
    (0..n).fold(initial, |black, _| {
        black
            .iter()
            .flat_map(open_neighbourhood)
            .fold(HashMap::new(), |mut group, p| {
                *group.entry(p).or_insert(0) += 1;
                group
            })
            .into_iter()
            .filter_map(|(point, adjacent)| will_be_black(point, adjacent, &black))
            .collect()
    })
}

fn open_neighbourhood(tile: &Point) -> impl Iterator<Item = Point> {
    let (x, y) = tile.clone();
    Direction::ALL
        .iter()
        .map(|direction| direction.offset())
        .map(move |(dx, dy)| (x + dx, y + dy))
}

fn will_be_black(tile: Point, adjacent: usize, black: &HashSet<Point>) -> Option<Point> {
    let is_black = black.contains(&tile);
    match (is_black, adjacent) {
        (true, 1..=2) => Some(tile),
        (false, 2) => Some(tile),
        _ => None,
    }
}
