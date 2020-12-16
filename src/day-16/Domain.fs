module AdventDay16.Domain

// type Range = { lower: number; upper: number }
type Range = { Lower: int; Upper: int; }

// type RangeType = { name: string; ranges: Range[] }
type RangeType = { Name: string; Ranges: Range array  }

/// type Ticket = number[]
type Ticket = int array