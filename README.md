# brainfork

Do you need a language that is easier than [_that_](https://en.wikipedia.org/wiki/Brainfuck) other language, but still makes you want to cry every time you use it? 

Are standard libraries too **bloated** and **heavy** for you?

Do you need all of the convenience and readability of [_that_](https://en.wikipedia.org/wiki/Brainfuck) language, but none of the simplicity?

Then **brainfork** is for you!

## Instructions
Brainfork is somewhat compatible with [_that_](https://en.wikipedia.org/wiki/Brainfuck) language (see [Word Size](#word-size)) but also provides some other features.

As you would expect with a language claiming compatibility, the following instructions are supported:

|Mnemonic|Action                                           |
|---|------------------------------------------------------|
| `+` | Increment the value at the pointer                 |
| `-` | Decrement the value at the pointer                 |
| `[` | Begin a loop                                       |
| `]` | Break out of a loop if memory at the pointer is 0  |
| `.` | Output the value at the pointer as ascii           |
| `>` | Increment the pointer                              |
| `<` | Decrement the pointer                              |

For your "convenience", these instructions are supported in addition to the base set:

|Mnemonic|Action                                         |
|-----|----------------------------------------------------|
| `=` | Set the value at the pointer, e.g. `= 10`          |
| `*` | Output the decimal value at the pointer            |

Together, these instructions make up the compact set of instructions. For the instructions which are able to be represented as a single character, they may be combined on one line without any delimiter. If an instruction requires arguments (`=` for example) then it must either be on its own line or separated from other characters on the line with a `;` character. Below are some examples:

This program will set the value at memory address 0 to 10. It will then loop through decrementing the value until that it is zero.

```
= 10
[-]
```

If this program were to be put on a single line, it would look like this:

```
= 10;[-]
```

And of course, because there is compatibility with [_that_](https://en.wikipedia.org/wiki/Brainfuck) language, we could also use:

```
++++++++++[-]
```

### The Other Bits
Each of the instructions that are talked about so far are actually just aliases for other more verbose instructions. These are:

|Name|Alias|Arguments|Action|
|----|-----|---------|------|
| `set`    | `=` | 2 | Set the memory at `arg0` to value `arg1`    |
| `out`    | `.` | 1 | Output the ASCII character at memory `arg0` |
| `outn`   | `*` | 1 | Output the decimal value at memory `arg0`   |
| `loop`   | `[` | 0 | Begin a loop                                |
| `until`  | `]` | 1 | Go back to the corresponding loop while the memory at `arg0` is not 0|
| `inc`    | `+` | 1 | Increment the memory at `arg0`              |
| `dec`    | `-` | 1 | Decrement the memory at `arg0`              |
| `pinc`   | `>` | 0 | Increment the pointer                       |
| `pdec`   | `<` | 0 | Decrement the pointer                       |

### Memory References
When an instruction takes a memory address as its argument, it is resolved down a pointer chain. Pointers are denoted by square brackets, for example: `[0]` used in the context of an instruction such as `out` (e.g. `out [0]`) would actually provide the memory pointed to by address 0 to the instruction.
Example:

```
set 0, 40
set [0], 0x41

out [0]
out 40
```

In this case, we set the memory at location 0 to the value 40. We then set the memory pointed to by location 0 (so memory location 40) to 0x41. From there, we output the value at the location pointed to by 0 (so location 40), and then the value at location 40 itself. You should notice that these two values are the same.

Pointers may also be dereferenced multiple times:

```
set 0, 1
set 1, 2

set 2, 0x41

out 2
out [1]
out [[0]]
```

## Machine State
The brainfork machine state is quite minimal. It has 512 "words" of memory, with each "word" being a JavaScript `Number`. It also has an instruction pointer, which simply points to which line is to be processed, and a general purpose pointer.

### Word Size
It is worth noting that because of the use of `Number`, the values at any location in memory _can_ exceed 255. This will break compatibility with some code generators for [_that_](https://en.wikipedia.org/wiki/Brainfuck) language, because they expect memory locations to behave as 8bit integers. One code generator I've had luck with is [this one](https://andrew.hedges.name/experiments/brainf_cker/) from Andrew Hedges.

### The Pointer
The pointer is used when an instruction has less arguments than it needs. For instance the `=` instruction takes two arguments, a memory location and a value. When you write `= 10`, the interpreter creates a list of arguments provided to it, in this case `[0]`. Because this is one less than the arguments needed, it adds the pointer into the arguments, resulting in `[0, 10]`. This makes it as if you had written `= 0, 10`.

The pointer can be controlled with the `<` and `>` instructions.

## Example Programs
Here is an example of a hello world program:

```
= 0x48
>
= 0x65
>
= 0x6c
>
= 0x6c
>
= 0x6f
>
= 0x20
>
= 0x57
>
= 0x6f
>
= 0x72
>
= 0x6c
>
= 0x64 
>
= 0x21 
>
= 0
<<<<<<<<<<<<
[.>]
```
 This is that same program after minification:
```
= 0x48;>;= 0x65;>;= 0x6c;>;= 0x6c;>;= 0x6f;>;= 0x20;>;= 0x57;>;= 0x6f;>;= 0x72;>;= 0x6c;>;= 0x64 ;>;= 0x21 ;>;= 0;<<<<<<<<<<<<;[.>]
```

This program counts from 10 to 1 outputting numeric values:

```
= 0x20
>
= 10
[
  *-
  <.>
]
```

Minified: 
```
= 0x20;>;= 10;[*-<.>]
```

And here is a program which performs simple addition:

```
= 25        # Number 1
>
= 5         # Number 2

[
  <+       # Increment number 1
  >-       # Decrement number 2
]          # Continue if number 2 is not 0

<          # Go back to number 1
*          # Output the value
```

Minified:
```
= 25;>;= 5;[<+>-]<*
```

## Input
Not yet.