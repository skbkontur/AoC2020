import java.nio.file.Files
import java.nio.file.Paths

fun getRatings(name: String) = Files
        .readAllLines(Paths.get("inputs/$name.txt"))
        .map { it.toInt() }
        .sorted()

fun List<Int>.countPaths(): Long {
    val paths = mutableMapOf(
            0 to 1L
    )

    this.forEach { number ->
        paths[number] = (1..3)
                .filter { paths.containsKey(number - it) }
                .map { paths[number - it]!! }
                .sum()
    }

    return paths[this.last()]!!
}

val count = getRatings("10").countPaths()
println(count)