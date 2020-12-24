#!/usr/bin/env python3

import sys
import functools



def parse_tile(s):
    lines = s.split('\n')
    tile_id = int(lines[0].strip(':').split()[1])
    return tile_id, list(map(list, lines[1:]))


def read_tiles():
    blocks = sys.stdin.read().strip().split("\n\n")
    return {tile_id: tile for tile_id, tile in map(parse_tile, blocks)}


def get_borders(tile):
    return [''.join(tile[0]),
                    ''.join(map(lambda x: x[0], tile)),
                    ''.join(tile[-1]),
                    ''.join(map(lambda x: x[-1], tile))]


def normalize_border(border):
    return min(border, border[::-1])


def main():
    tiles = read_tiles()

    borders = dict()
    for tile_id, tile in tiles.items():
        for border in get_borders(tile):
            borders.setdefault(normalize_border(border), []).append(tile_id)
    print(borders)
    print(max(map(len, borders.values())))    # it should be 2

    cnt = dict()
    for tile_id in [tile_ids[0] for tile_ids in borders.values() if len(tile_ids) == 1]:
        cnt[tile_id] = cnt.get(tile_id, 0) + 1
    corners = [tile_id for tile_id, uniq_count in cnt.items() if uniq_count == 2]
    print(corners)    # it should be 4 different numbers
    print(functools.reduce(lambda x, y: x * y, corners))



    def rotate90(tile):
        size = len(tile)
        return [[tile[y][size - 1 - x] for y in range(size)] for x in range(size)]

    def flip_sym(tile):
        size = len(tile)
        return [[tile[y][x] for y in range(size)] for x in range(size)]


    def all_rotations(tile):
        for i in range(2):
            for j in range(4):
                yield tile
                tile = rotate90(tile)
            tile = flip_sym(tile)


    def tiles_with_border(border):
        return borders[normalize_border(border)]

    def another_tile_with_border(border, tile_id):
        tile_ids = tiles_with_border(border)
        if len(tile_ids) != 2 or tile_id not in tile_ids:
            raise ValueError('Can not find unique another tile with border')
        return sum(tile_ids) - tile_id


    def put(tile_id, x, y):
        for dx in range(k):
            for dy in range(k):
                field[x * k + dx][y * k + dy] = tiles[tile_id][dx + 1][dy + 1]

        def is_good_with_neighbour(border_num, expected_border):
            return lambda tile: get_borders(tile)[border_num] == expected_border

        bs = get_borders(tiles[tile_id])
        if y + 1 < n:
            next_tile_id = another_tile_with_border(bs[3], tile_id)
            rotate_and_put(next_tile_id, x, y + 1, is_good_with_neighbour(1, bs[3]))
        if y == 0 and x + 1 < n:
            next_tile_id = another_tile_with_border(bs[2], tile_id)
            rotate_and_put(next_tile_id, x + 1, y, is_good_with_neighbour(0, bs[2]))


    def rotate_and_put(tile_id, x, y, is_good_rotation):
        for tile in all_rotations(tiles[tile_id]):
            if is_good_rotation(tile):
                tiles[tile_id] = tile
                put(tile_id, x, y)
                return
        raise ValueEror('Can not put at (%d, %d)' % (x, y))


    def put_all_from_corner(tile_id):
        def is_good_at_corner(tile):
            return all(map(lambda b: len(tiles_with_border(b)) == 1, get_borders(tile)[:2]))

        rotate_and_put(tile_id, 0, 0, is_good_at_corner)


    n = int(len(tiles) ** 0.5)
    k = len(tiles[corners[0]][0]) - 2
    field = [[' '] * (n * k) for i in range(n * k)]

    put_all_from_corner(corners[0])


    def find_monsters(field):
        mask = ['                  # ',
                '#    ##    ##    ###',
                ' #  #  #  #  #  #   ']

        monsters_count = 0
        for x in range(n * k - len(mask)):
            for y in range(n * k - len(mask[0])):
                if all([mask[dx][dy] != '#' or field[x + dx][y + dy] != '.' for dy in range(len(mask[0])) for dx in range(len(mask))]):
                    monsters_count += 1

                    for dx in range(len(mask)):
                        for dy in range(len(mask[0])):
                            if mask[dx][dy] == '#':
                                field[x + dx][y + dy] = 'O'
        return monsters_count


    counts = list(map(find_monsters, all_rotations(field)))
    print('\n'.join(map(lambda x: ''.join(x), field)))
    print(counts)
    print(sum(map(lambda s: ''.join(s).count('#'), field)))

if __name__ == "__main__":
    main()
