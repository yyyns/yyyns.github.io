---
title: 'The Silent Compiler'
description: 'Notes on the warnings we ignore until they become failures.'
pubDate: 'Oct 20 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

A warning is a message from the past about a mistake in the future. Most of us read it once and move on.

```verilog
always @(posedge clk) begin
    if (enable)
        data <= next_data;
end
```

The missing reset is not a bug today. It becomes one when the first board comes back from the factory.
