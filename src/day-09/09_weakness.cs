#pragma warning disable CS8321

using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;

var numbers = File.ReadLines("09.txt")
                  .Select(long.Parse) // map(s => parseInt(s, 10))
                  .ToList();

var invalidNumber = GetInvalidNumber(numbers, preludeSize:25);
Console.WriteLine($"Part One: {invalidNumber}");

var slice = GetSliceWithSum(numbers, invalidNumber);
var answer = slice.Min() + slice.Max(); // Math.min(...slice) + Math.max(...slice)
Console.WriteLine($"Part Two: {answer}");

long GetInvalidNumber(List<long> numbers, int preludeSize)
{
    //                  window
    // numbers: 1 2 3 [4 5 6 7 8] 9 10 ...
    
    var window = new Queue<long>();
    foreach (var n in numbers)
    {
        if (window.Count == preludeSize)
        {
            if (!IsSum(n, window)) 
                return n;
            window.Dequeue();
        }
        window.Enqueue(n);
    }
    throw new Exception("no weakness");
}

bool IsSum_Naïve(long targetSum, IReadOnlyCollection<long> window)
{
    // O(window_size²)
    // 25*25 = 625
    foreach (var a in window) // for of
        foreach (var b in window)
            if (b == targetSum - a)
                return true;
    return false;
}

bool IsSum_Better(long targetSum, IReadOnlyCollection<long> window)
{
    // O(window_size)
    var set = window.ToHashSet(); // const set = new Set(window)
    foreach (var a in window)
        if (set.Contains(targetSum - a)) //set.has(...)
            return true;
    return false;
}

bool IsSum_Linq(long targetSum, IReadOnlyCollection<long> window)
{
    // O(window_size)
    var set = window.ToHashSet();
    return window.Any(a => set.Contains(targetSum - a)); // window.some(...)
}

bool IsSum(long targetSum, IReadOnlyCollection<long> window)
{
    // O(window_size)
    var set = window.ToHashSet();
    return window.Any(a => a != targetSum - a && set.Contains(targetSum - a)); // window.some(...)
}

IReadOnlyCollection<long> GetSliceWithSum_Idea(List<long> numbers, long targetSum)
{
    // targetSum = 8
    // [] 1 2 3 4 3 1 10

    var slice = new Queue<long>(); // slice: number[] = []
    foreach (var num in numbers)
    {
        slice.Enqueue(num); // slice.push(num)
        var sum = slice.Sum(); // slice.reduce((acc, x) => acc+x))
        while (sum > targetSum) 
            slice.Dequeue(); // slice.shift()
        if (sum == targetSum && slice.Count > 1)
            return slice;
    }
    throw new Exception("no weakness");
}

IReadOnlyCollection<long> GetSliceWithSum(List<long> numbers, in long targetSum)
{
    var slice = new Queue<long>();
    long sliceSum = 0;
    foreach (var num in numbers)
    {
        sliceSum += num;
        slice.Enqueue(num);
        while (sliceSum > targetSum)
            sliceSum -= slice.Dequeue();
        if (sliceSum == targetSum && slice.Count > 1)
            return slice;
    }
    throw new Exception("no weakness");
}