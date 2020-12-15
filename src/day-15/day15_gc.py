def rambunctious_recitation(data: list[int], stop_at: int) -> int:
    new_values = {}
    last_indexes = {}
    for i, new_value in enumerate(data, start=1):
        last_indexes[new_value] = i

    while i < stop_at:
        last_index = last_indexes.get(new_value, i)
        new_value = new_values[new_value] = i - last_index
        last_indexes[new_value] = i

        i += 1

    return new_value
