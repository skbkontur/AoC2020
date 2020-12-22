using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using static System.Math;

var inp = File.ReadAllLines("22.txt");
int[] cards1 = inp.TakeWhile(s => s != "").Skip(1).Select(int.Parse).ToArray();
int[] cards2 = inp.SkipWhile(s => s != "").Skip(2).Select(int.Parse).ToArray();

Console.WriteLine($"Part One: {PlayPart1Game(cards1, cards2)}");
Console.WriteLine();

var sw = Stopwatch.StartNew();
Console.WriteLine("Part Two: " + PlayPart2Game(cards1, cards2));
Console.WriteLine(sw.Elapsed);
Console.WriteLine();

sw.Restart();
Console.WriteLine("Part Two (with hashing): " + Play2_WithHashing(cards1, cards2));
Console.WriteLine(sw.Elapsed);


long PlayPart1Game(IEnumerable<int> deck1cards, IEnumerable<int> deck2cards)
{
    var deck1 = new Queue<int>(deck1cards);
    var deck2 = new Queue<int>(deck2cards);
    while (deck1.Any() && deck2.Any())
    {
        // ?
        var card1 = deck1.Dequeue();
        var card2 = deck2.Dequeue();
        var winnerDeck = (card1 > card2) ? deck1 : deck2;
        winnerDeck.Enqueue(Max(card1, card2));
        winnerDeck.Enqueue(Min(card1, card2));
    }
    return GetWinnerScore(deck1, deck2);
}


(int winner, long score) PlayPart2Game(IEnumerable<int> deck1cards, IEnumerable<int> deck2cards)
{
    var deck1 = new Queue<int>(deck1cards);
    var deck2 = new Queue<int>(deck2cards);
    var prevStates = new HashSet<string>();

    int GetRoundWinner(int card1, int card2)
    {
        if (card1 <= deck1.Count && card2 <= deck2.Count)
            return PlayPart2Game(deck1.Take(card1), deck2.Take(card2)).winner;
        return card1 > card2 ? 1 : 2;
    }

    while (deck1.Any() && deck2.Any())
    {
        var state = string.Join(" ", deck1) + "|" + string.Join(" ", deck2);
        if (!prevStates.Add(state))
            return (1, GetWinnerScore(deck1, deck2));
        var card1 = deck1.Dequeue();
        var card2 = deck2.Dequeue();
        var winner = GetRoundWinner(card1, card2);
        var winnerDeck = winner == 1 ? deck1 : deck2;
        winnerDeck.Enqueue(winner == 1 ? card1 : card2);
        winnerDeck.Enqueue(winner == 1 ? card2 : card1);
    }
    return (winner: deck1.Any() ? 1 : 2, GetWinnerScore(deck1, deck2));
}

(int winner, long score) Play2_WithHashing(IEnumerable<int> deck1cards, IEnumerable<int> deck2cards)
{
    var deck1 = new HashQueue(deck1cards);
    var deck2 = new HashQueue(deck2cards);
    var cache = new HashSet<(long, long)>();

    int GetRoundWinner(int card1, int card2)
    {
        if (card1 <= deck1.Count && card2 <= deck2.Count)
            return Play2_WithHashing(deck1.Take(card1), deck2.Take(card2)).winner;
        return card1 > card2 ? 1 : 2;
    }

    while (deck1.Any() && deck2.Any())
    {
        var state = (deck1.Hash, deck2.Hash);
        if (!cache.Add(state))
            return (1, GetWinnerScore(deck1, deck2));
        var card1 = deck1.Dequeue();
        var card2 = deck2.Dequeue();
        var winner = GetRoundWinner(card1, card2);
        var winnerDeck = winner == 1 ? deck1 : deck2;
        winnerDeck.Enqueue(winner == 1 ? card1 : card2);
        winnerDeck.Enqueue(winner == 1 ? card2 : card1);
    }
    return (winner: deck1.Any() ? 1 : 2, GetWinnerScore(deck1, deck2));
}

static long GetWinnerScore(IEnumerable<int> q1, IEnumerable<int> q2)
{
    return q1.Concat(q2).Reverse().Select((n, i) => (long)n * (i + 1)).Sum();
}
