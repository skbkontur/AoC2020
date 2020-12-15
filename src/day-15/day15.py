def rambunctious_recitation(data: list[int], stop_at: int) -> list[int]:
    counter = {}
    result = data.copy()

    for i, last_value in enumerate(data, start=1):
        counter.setdefault(last_value, []).append(i)

    while i < stop_at:
        i += 1

        indexes = counter[last_value]
        if len(indexes) == 1:
            last_value = 0
        else:
            last_value = indexes[-1] - indexes[-2]
        counter.setdefault(last_value, []).append(i)
        result.append(last_value)

    return result
