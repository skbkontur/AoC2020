using System;
using System.Collections.Generic;
using System.IO;
using static System.Linq.Enumerable;

var map = File.ReadLines("11.txt")
    .Select(line => line.ToCharArray())
    .ToArray();
PlacePeople(map);
var occupiedSeatsCount = map.SelectMany(c => c).Count(c => c == '#');
Console.WriteLine($"Part One: {occupiedSeatsCount}");

void PlacePeople(char[][] map)
{
    var front =(
        from x in Range(0, map[0].Length)
        from y in Range(0, map.Length)
        let p = new Vec(x, y)
        where WillBecomeOccupiedAfter2Ticks(p, map)
        select p).ToHashSet();
    foreach (var (x, y) in front)
        map[y][x] = '#';
    while (front.Count > 0)
    {
        var emptyFront = front
            .SelectMany(p => GetFreeNeighbors(p, map))
            .ToList();
        foreach (var (x, y) in emptyFront)
            map[y][x] = '0';
        front = emptyFront
            .SelectMany(p => GetFreeNeighbors(p, map))
            .Where(p => WillBecomeOccupiedAfter2Ticks(p, map))
            .ToHashSet();
        foreach (var (x, y) in front)
            map[y][x] = '#';
    }
}

IEnumerable<Vec> GetFreeNeighbors(Vec p, char[][] map)
{
    return p.GetNeighbors8().Where(pos => map.EqAt(pos, 'L'));
}

bool WillBecomeOccupiedAfter2Ticks(Vec p, char[][] map)
{
    if (!map.EqAt(p, 'L')) return false;
    return GetFreeNeighbors(p, map).Count() < 4;
}

public static class Extensions
{
    public static bool InRange(this int v, int min, int max)
    {
        return v >= min && v < max;
    }

    public static bool EqAt<T>(this T[][] matrix, Vec pos, T expectedValue) where T : IEquatable<T>
    {
        return pos.Y.InRange(0, matrix.Length) && 
               pos.X.InRange(0, matrix[0].Length) && 
               matrix[pos.Y][pos.X].Equals(expectedValue);
    }
}

public record Vec(int X, int Y)
{
    public IEnumerable<Vec> GetNeighbors8()
    {
        return 
            from dx in new[] { -1, 0, 1 }
            from dy in new[] { -1, 0, 1 }
            where dx != 0 || dy != 0
            select new Vec(dx+X, dy+Y);
    }
}
