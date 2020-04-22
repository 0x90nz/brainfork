# brainfork

Do you need a language that is easier than [_that_](https://en.wikipedia.org/wiki/Brainfuck) other language, but still makes you want to cry every time you use it? 

Are standard libraries too **bloated** and **heavy** for you?

Do you need all of the convenience and readability of [_that_](https://en.wikipedia.org/wiki/Brainfuck) language, but none of the simplicity?

Then **brainfork** is for you!

## Instructions
Brainfork is compatible with [_that_](https://en.wikipedia.org/wiki/Brainfuck) language but also provides some other features.

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
| `loop`   | `[` | 0 | Begin a loop                                |
| `until`  | `]` | 1 | Go back to the corresponding loop while the memory at `arg0` is not 0|
| `inc`    | `+` | 1 | Increment the memory at `arg0`              |
| `dec`    | `-` | 1 | Decrement the memory at `arg0`              |
| `pinc`   | `>` | 0 | Increment the pointer                       |
| `pdec`   | `<` | 0 | Decrement the pointer                       |


## Machine State
The brainfork machine state is quite minimal. It has 512 "words" of memory, with each "word" being a JavaScript `Number`. It also has an instruction pointer, which simply points to which line is to be processed, and a general purpose pointer.

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