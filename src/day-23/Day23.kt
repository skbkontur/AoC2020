val data = "315679824"

fun first(data: String): Any? {
  val items = data
    .trim()
    .map { it.toString().toInt() }

  val queue = ArrayDeque(items)
  val min = queue.minOf { it }
  val max = queue.maxOf { it }

  repeat(100) {
    val head = queue.removeFirst()
    val triple = listOf(queue.removeFirst(), queue.removeFirst(), queue.removeFirst())

    var insert = head - 1
    var position = queue.indexOf(insert)
    while (position == -1) {
      insert--
      if (insert < min) {
        insert = max
      }
      position = queue.indexOf(insert)
    }

    triple.forEachIndexed { index, value -> queue.add(position + index + 1, value) }
    queue.addLast(head)
  }

  val pos1 = queue.indexOf(1)
  return (queue.drop(pos1 + 1) + queue.take(pos1)).joinToString("")
}

fun second(data: String): Any? {
  val initialItems = data
    .trim()
    .map { it.toString().toInt() }

  val items = initialItems + ((initialItems.maxOf { it } + 1)..1_000_000).toList()

  val min = items.minOf { it }
  val max = items.maxOf { it }

  val all = List(1_000_000 + 1) { Item(it) }

  val queue = items.map { all[it] }
  queue.zipWithNext().forEach { (prev, next) ->
    prev.next = next.value
  }
  queue.last().next = queue.first().value

  var head = queue.first()

  repeat(10_000_000) {
    val took = (0 until 3).scan(head) { acc, _ -> all[acc.next] }
    val excluded = took.map { it.value }
    var place = head.value - 1
    while (place < min || place in excluded) {
      place--
      if (place < min) {
        place = max
      }
    }

    val nextHead = took[3].next
    val insertion = all[place]
    val next = insertion.next
    insertion.next = took[1].value
    took[3].next = next

    head.next = nextHead
    head = all[nextHead]
  }

  val first = all[all[1].next]
  val second = all[first.next]

  return first.value.toLong() * second.value.toLong()
}

data class Item(
  val value: Int,
  var next: Int = 0,
)

fun main() {
  println("First: ${first(data)?.toString() ?: "unsolved"}")
  println("Second: ${second(data)?.toString() ?: "unsolved"}")
}