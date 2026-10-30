---
title: 'just an example'
description: 'A single example post covering Markdown syntax, math formulas, and syntax highlighting across languages.'
pubDate: 'Oct 29 2026'
heroImage: '../../assets/index/head.jpg'
---

A single example post that combines the old “First post” body, the math samples, and the Markdown style guide — plus code blocks in many languages so the highlighting can be checked in one place.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Adipiscing enim eu turpis egestas pretium. Euismod elementum nisi quis eleifend quam adipiscing. In hac habitasse platea dictumst vestibulum.

Morbi tristique senectus et netus. Id semper risus in hendrerit gravida rutrum quisque non tellus. Habitasse platea dictumst quisque sagittis purus sit amet. Tellus molestie nunc non blandit massa. Cursus vitae congue mauris rhoncus. Accumsan tortor posuere ac ut.

## Headings

The following HTML `<h1>`–`<h6>` elements represent six levels of section headings.

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Images

![Haoyu Lu](../../assets/index/head.jpg)

## Blockquotes

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

## Tables

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## Lists

### Ordered

1. First item
2. Second item
3. Third item

### Unordered

- List item
- Another item
- And another item

### Nested

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

## Other elements

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal.

## Math

Inline math: $E = mc^2$ and $e = a \times b$.

A display block:

$$
\begin{cases}
x + y = 1 \\
3x + 4y = 10
\end{cases}
$$

A matrix:

$$
A = \begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix}
$$

## Code highlighting

### Verilog

```verilog
module counter #(
    parameter WIDTH = 8
) (
    input  wire             clk,
    input  wire             rst_n,
    output reg  [WIDTH-1:0] count
);

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n)
            count <= {WIDTH{1'b0}};
        else
            count <= count + 1'b1;
    end

endmodule
```

### SystemVerilog

```system-verilog
class packet extends uvm_sequence_item;
    rand bit [7:0]  addr;
    rand bit [31:0] data;

    `uvm_object_utils_begin(packet)
        `uvm_field_int(addr, UVM_ALL_ON)
        `uvm_field_int(data, UVM_ALL_ON)
    `uvm_object_utils_end

    constraint c_addr { addr inside {[8'h00 : 8'h7F]}; }

    function new(string name = "packet");
        super.new(name);
    endfunction
endclass
```

### VHDL

```vhdl
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity counter is
    generic (WIDTH : integer := 8);
    port (
        clk   : in  std_logic;
        rst_n : in  std_logic;
        count : out unsigned(WIDTH - 1 downto 0)
    );
end entity counter;
```

### Python

```python
def crc32(data: bytes, poly: int = 0x04C11DB7) -> int:
    crc = 0xFFFFFFFF
    for byte in data:
        crc ^= byte << 24
        for _ in range(8):
            crc = ((crc << 1) ^ poly) if crc & 0x80000000 else (crc << 1)
            crc &= 0xFFFFFFFF
    return crc ^ 0xFFFFFFFF


if __name__ == "__main__":
    print(f"{crc32(b'hello'):08x}")
```

### C

```c
#include <stdint.h>

static inline uint32_t popcount(uint32_t x)
{
    x = x - ((x >> 1) & 0x55555555u);
    x = (x & 0x33333333u) + ((x >> 2) & 0x33333333u);
    return (((x + (x >> 4)) & 0x0F0F0F0Fu) * 0x01010101u) >> 24;
}

int main(void)
{
    return (int)popcount(0xDEADBEEFu);
}
```

### C++

```cpp
#include <array>
#include <cstdint>
#include <numeric>

template <std::size_t N>
constexpr std::uint32_t sum(const std::array<std::uint32_t, N>& values)
{
    std::uint32_t total = 0;
    for (const auto v : values) {
        total += v;
    }
    return total;
}

int main()
{
    constexpr std::array<std::uint32_t, 4> values{1, 2, 3, 4};
    return static_cast<int>(sum(values));
}
```

### Tcl

```tcl
proc find_cells {pattern} {
    set cells [get_cells -hier -filter "name =~ $pattern"]
    foreach_in_collection cell $cells {
        set ref [get_attribute $cell ref_name]
        puts "[get_object_name $cell] -> $ref"
    }
    return [sizeof_collection $cells]
}
```

### Bash

```bash
#!/usr/bin/env bash
set -euo pipefail

for log in logs/*.log; do
    [[ -f "$log" ]] || continue
    printf '%s: %d errors\n' "$log" "$(grep -c ERROR "$log" || true)"
done
```

### Makefile

```makefile
SIM = iverilog
TOP = tb_counter

sim: $(TOP).vvp
	vvp $<

$(TOP).vvp: $(wildcard *.v)
	$(SIM) -g2012 -o $@ -s $(TOP) $^

clean:
	rm -f *.vvp *.vcd
```

### CMake

```cmake
cmake_minimum_required(VERSION 3.20)
project(ic_tools LANGUAGES CXX)

add_executable(crc_tool src/main.cpp)
target_compile_features(crc_tool PRIVATE cxx_std_20)
```

### YAML

```yaml
design:
  name: counter
  top: counter
  clock: clk
  reset: rst_n
  parameters:
    WIDTH: 8
```

### JSON

```json
{
  "tool": "verilator",
  "version": "5.0",
  "flags": ["-Wall", "--cc", "--exe"]
}
```

### TOML

```toml
[simulator]
name = "iverilog"
timescale = "1ns/1ps"

[coverage]
enabled = true
```

### MATLAB

```matlab
function y = moving_average(x, n)
    kernel = ones(1, n) / n;
    y = conv(x, kernel, 'same');
end
```

### Assembly

```asm
    .section .text
    .globl _start
_start:
    li   a0, 1          # stdout
    la   a1, message
    li   a2, 13         # length
    li   a7, 64         # write
    ecall
```

### Perl

```perl
use strict;
use warnings;

my %count;
while (<>) {
    $count{$1}++ if /^(\w+)/;
}
print "$_ => $count{$_}\n" for sort keys %count;
```

### Awk

```awk
/^ERROR/ { errors++ }
/^WARN/  { warns++ }
END      { printf "errors=%d warns=%d\n", errors, warns }
```

### Lua

```lua
local function gcd(a, b)
    while b ~= 0 do
        a, b = b, a % b
    end
    return a
end

print(gcd(48, 18))
```

### Rust

```rust
fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        (a, b) = (b, a % b);
    }
    a
}

fn main() {
    println!("{}", gcd(48, 18));
}
```

### Go

```go
package main

func sum(values []int) int {
	total := 0
	for _, v := range values {
		total += v
	}
	return total
}
```

### Java

```java
public record Point(int x, int y) {
    public Point translate(int dx, int dy) {
        return new Point(x + dx, y + dy);
    }
}
```

### JavaScript

```javascript
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

console.log(clamp(42, 0, 10));
```

### TypeScript

```typescript
interface BusTransaction {
    addr: number;
    data: number;
    write: boolean;
}

const isWrite = (t: BusTransaction): boolean => t.write;
```

### HTML

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Example</title>
    </head>
    <body>
        <p>Hello.</p>
    </body>
</html>
```

### CSS

```css
:root {
    --accent: #2337ff;
}

.button:hover {
    background-color: var(--accent);
}
```

### SQL

```sql
SELECT module, COUNT(*) AS instances
FROM cells
WHERE ref_name LIKE 'DFF%'
GROUP BY module
ORDER BY instances DESC;
```

### Diff

```diff
- assign y = a & b;
+ assign y = a | b;
```

# Design notes

A dedicated section for checking how H1 and H2 headings appear in the table of contents.

## Clocking

All sequential logic is clocked from a single source.

## Reset strategy

Reset is asynchronous in assertion and synchronous in deassertion.

## Timing

Every path is constrained, including the ones nobody remembers.

# Verification plan

The verification plan follows the same hierarchy as the design.

## Assertions

Each block owns a small set of properties.

## Coverage

Functional coverage is reviewed every week.
