module AdventDay16.Main

open System.Numerics
open AdventDay16.FileReader
open AdventDay16.Domain

let valueInRange value range =
    range.Lower <= value && range.Upper >= value

let rangeTypeMatchesValue value (rangeType:RangeType)  =
    rangeType.Ranges
    // .some(range => valueInRange(value, range))
    |> Array.exists (valueInRange value)

let rangeTypeMatchesAll values (rangeType:RangeType)  =
    values
    // .every(v => rangeTypeMatchesValue(v, rangeType))
    |> Array.forall (fun v -> rangeTypeMatchesValue v rangeType)

let findRangeTypeMatchesAll (ranges: RangeType array) (values: int array)  =
    ranges
    // .filter(range => rangeTypeMatchesAll(values, range))
    |> Array.filter (rangeTypeMatchesAll values)

let ticketScanningErrorRate (ranges: RangeType array) (ticket: Ticket)  =
    ticket
    // .filter(v => !ranges.some(range => rangeTypeMatchesValue(v, range)))
    |> Array.filter (fun v -> ranges |> Array.exists (rangeTypeMatchesValue v) |> not)
    // .reduce((x, y) => x + y)
    |> Array.sum
    
let isValid (ranges: RangeType array) (ticket: Ticket)  =
    ticket
    // .every(v => ranges.some(range => rangeTypeMatchesValue(v, range)))
    |> Array.forall (fun v -> ranges |> Array.exists (rangeTypeMatchesValue v))
    
let ticketsColumns (tickets: Ticket array) =
    let tickets2D = array2D tickets
    seq { 0 ..tickets.[0].Length - 1  }
    |> Seq.map (fun c -> tickets2D.[*, c])
    |> Seq.toArray

let rec filterUniques (possibleColumns: RangeType[][]) =
    let uniqueColumns = possibleColumns |> Array.filter(fun v -> v.Length = 1) |> Array.collect id
    let result =
        possibleColumns
        |> Array.map(fun vars ->
                    vars
                    |> Array.filter (fun v -> vars.Length = 1 || not (Array.contains v uniqueColumns)))
    if (result |> Array.exists (fun a -> a.Length > 1)) then filterUniques result else result

let myTicket = readMyTicket()

[<EntryPoint>]
let main argv =
    let ranges = readRanges()
    let nearbyTickets = readNearbyTickets()
    let myTicket = readMyTicket()

    // let resultColumns =
    //   filterUniques(
    //     ticketsColumns(
    //       nearbyTickets.filter(ticket => isValid(ranges, ticket))
    //     ).map(
    //       (values) => findRangeTypeMatchesAll(ranges, values)
    //     )
    //   )
    let resultColumns =
        nearbyTickets
        |> Array.filter (isValid ranges)
        |> ticketsColumns
        |> Array.map (findRangeTypeMatchesAll ranges)
        |> filterUniques
        
    resultColumns
        |> Array.mapi (fun i c -> i, c.[0].Name)
        |> Array.filter (fun (_, c) -> c.StartsWith "departure")
        |> Array.map (fun (i, _) -> bigint myTicket.[i])
        |> Array.reduce (fun p n -> bigint.Multiply(p, n))
        |> fun res -> printfn "И наше заветное число - %s" (res.ToString())
    0
