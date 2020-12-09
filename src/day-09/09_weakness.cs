#pragma warning disable CS8321

using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;






var numbers = File.ReadLines("09.txt").Select(long.Parse).ToList();

var invalidNumber = GetInvalidNumber(numbers, 25);
Console.WriteLine($"Part One: {invalidNumber}");

var seq = GetSliceWithSum(numbers, invalidNumber);
Console.WriteLine($"Part Two: {seq.Min() + seq.Max()}");

long GetInvalidNumber(List<long> numbers, int size)
{
    //                  window
    // numbers: 1 2 3 [4 5 6 7 8] 9 10 ...
    
    var window = new Queue<long>();
    foreach (var n in numbers)
    {
        if (window.Count == size)
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
    foreach (var a in window)
        foreach (var b in window)
            if (b == targetSum - a)
                return true;
    return false;
}

bool IsSum_Better(long targetSum, IReadOnlyCollection<long> window)
{
    var set = window.ToHashSet();
    foreach (var a in window)
        if (set.Contains(targetSum - a))
            return true;
    return false;
}

bool IsSum_Linq(long targetSum, IReadOnlyCollection<long> window)
{
    var set = window.ToHashSet();
    return window.Any(a => set.Contains(targetSum - a)); // window.some(...)
}

bool IsSum(long targetSum, IReadOnlyCollection<long> window)
{
    // O(window_size)
    var set = window.ToHashSet();
    return window.Any(a => a != targetSum - a && set.Contains(targetSum - a)); // window.some(...)
}

IReadOnlyCollection<long> GetSliceWithSum_Naïve(List<long> numbers, in long targetSum)
{
    // targetSum = 8
    // [] 1 2 3 4  3 1 10

    var slice = new Queue<long>();
    foreach (var num in numbers)
    {
        slice.Enqueue(num);
        while (slice.Sum() > targetSum)
            slice.Dequeue();
        if (slice.Sum() == targetSum && slice.Count > 1)
            return slice;
    }
    throw new Exception("no weakness");
}

IReadOnlyCollection<long> GetSliceWithSum(List<long> numbers, in long targetSum)
{
    // targetSum = 8
    // [] 1 2 3 4 3 1 10
    
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