import pytest

from day15 import rambunctious_recitation as rambunctious_recitation_list
from day15_gc import rambunctious_recitation


def test_data():
    assert rambunctious_recitation_list([0, 3, 6], 2020) == [0, 3, 6, 0, 3, 3, 1, 0, 4, 0]


@pytest.mark.parametrize(['data', 'stop', 'result'], [
    ([0, 3, 6], 10, 0),
    ([1, 2, 3], 2020, 27),
    ([2, 3, 1], 2020, 78),
    ([3, 1, 2], 30000000, 362),
])
def test_final(data, stop, result):
    assert rambunctious_recitation(data, stop) == result


def test_bench():
    assert rambunctious_recitation_list([1, 12, 0, 20, 8, 16], 30_000_000)
