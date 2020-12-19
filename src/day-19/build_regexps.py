#!/usr/bin/env python3.9

import sys
import re
import functools


@functools.cache  # Python 3.9
def build_by_rule(rule: str) -> str:
    if m := re.fullmatch(r'"(.)"', rule):  # Python 3.8
        return m.group(1)

    # ... | ... (i.e. "1 | 3" or "1 2 | 3 4" or even "1 2 | 3 4 | 5 | 6 7")
    if m := re.fullmatch(r'(.+) \| (.+)', rule):
        return build_by_rule(m.group(1)) + "|" + build_by_rule(m.group(2))

    # "1" or "1 3" or "1 3 4"
    result = ""
    for m in re.findall(r'(\d+)', rule):
        result += "(" + build_by_index(int(m)) + ")"

    return result


@functools.cache
def build_by_index(idx: int) -> str:
    return build_by_rule(rules[idx])


rules = {}
for line in sys.stdin.readlines():
    m = re.fullmatch(r"(\d+): (.+)", line.strip())
    rules[int(m.group(1))] = m.group(2)


### For first task
print(build_by_index(0))

### For second task
# print(build_by_index(42))
# print(build_by_index(31))
