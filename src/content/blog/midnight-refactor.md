---
title: 'Midnight Refactor'
description: 'What a rewrite looks like when nobody is watching.'
pubDate: 'Aug 25 2026'
---

The first version works. The second version is supposed to be explainable.

```python
def normalize(values):
    lo, hi = min(values), max(values)
    span = hi - lo or 1
    return [(v - lo) / span for v in values]
```

Halfway through, you notice the old code was not wrong — only unloved. You keep the behavior and change the names, and somehow that is enough.
