import java.lang.Exception
import java.nio.file.Files
import java.nio.file.Paths

fun getRatings(name: String) = Files
        .readAllLines(Paths.get("inputs/$name.txt"))
        .map { it.toInt() }
        .sorted()

fun List<Int>.countDiffs(): Triple<Int, Int, Int> {
    var diff1 = 0
    var diff2 = 0
    var diff3 = 1

    this.fold(0) { prev, cur ->
        when (cur - prev) {
            1 -> diff1++
            2 -> diff2++
            3 -> diff3++
            else -> throw Exception("Invalid diff")
        }

        cur
    }

    return Triple(diff1, diff2, diff3)
}

val (diff1, _, diff3) = getRatings("10").countDiffs()
println(diff1 * diff3)