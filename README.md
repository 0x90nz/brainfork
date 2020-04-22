# brainfork

Do you need a language that is easier than [_that_](https://en.wikipedia.org/wiki/Brainfuck) other language, but still makes you want to cry every time you use it? 

Are standard libraries too **bloated** and **heavy** for you?

Do you need all of the convenience and readability of [_that_](https://en.wikipedia.org/wiki/Brainfuck) language, but none of the simplicity?

Then **brainfork** is for you!

## Instructions
There are two subsets of instructions, the simple set and the complicated set. The simple set is composed of only a single character as the instruction 'mnemonic'. These instructions are:

|Mnemonic|Action                                    |
|---|-----------------------------------------------|
| = | Set memory at `arg0` to `arg1`                |
| + | Increment the value at `arg0`                 |
| - | Decrement the value at `arg0`                 |
|\[ | Begin a loop                                  |
|\] | Break out of a loop if memory at `arg0` is 0  |
| . | Output the value at `arg0` as ascii           |