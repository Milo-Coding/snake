# snake

![snake logo](docs/snake-logo.png)

Snake is a python-like language with easily readable code so even non-computer scientists can identify what code does. When thinking about the scope of language I wanted to build, I decided that I wanted my language to be capeable of all the topics covered in a 1010 programming course.

## Features

#### Easy to code

Snake has a simple structure, clear syntax and very readable keywords. It is meant to be readable even by someone with no expererience in computer science.

#### Lists

In adition to the basic data types, lists of data can be created and managed in snake.

#### Dictionaries

Like lists, snake can handle dictionaries, refered to as name_value_pairs

#### Conditional Statements

Conditional (if/else) statements are a key part of any complex program and are included in an easily understandable format.

#### Loops

Clearly defined repeatable code segments are another of snake's features.

#### Functions

Functions are another way to create reusable code in snake.

#### Input

Reading input from a user gives snake a dynamic element and allows for more intereactive progarms.

## Types

| JavaScript | Python | snake           |
| ---------- | ------ | --------------- |
| string     | str    | letters         |
| integer    | int    | number          |
| float      | float  | number          |
| boolean    | bool   | truth_value     |
| array      | list   | list            |
| dict       | dict   | name_value_pair |

## Variable Declaration and Assignment

| JavaScript              | Python             | snake                       |
| ----------------------- | ------------------ | --------------------------- |
| let a = 55;             | a = 55             | number a is 55              |
| let b = “Hello World!”; | b = "Hello World!" | letters b is "Hello World!" |
| let c = 1.7;            | c = 1.7            | number c is 1.7             |
| let d = true;           | d = True           | turth_value d is true       |
| let e = false;          | e = False          | truth_value e is false      |
| const f = “Constant”;   | f = "Constant"     | letters f is "Constant"     |

## Variable Incrementation

| JavaScript | Python     | snake            |
| ---------- | ---------- | ---------------- |
| x++        | x += 1     | x is x + 1       |
| x--        | x -= 1     | x is x - 1       |
| x = x \* 1 | x = x \* 1 | x is x \* 1      |
| x = x / 2  | x = x / 2  | x is x / 1       |
| x = x^3    | x = x^3    | x is x^3         |
| x = x % 2  | x = x % 2  | x is x modulus 2 |

## Keywords

| Traditional | snake         |
| ----------- | ------------- |
| true        | true          |
| false       | false         |
| print       | print         |
| function    | reusable_code |
| return      | output        |
| if          | if            |
| else        | if_not        |
| for         | loop_over     |
| while       | loop_while    |
| break       | stop_loop     |
| input       | input         |

## Symbols

| Python | Snake |
| ------ | ----- |
| =      | is    |
| ==     | =?    |
| <      | <?    |
| >      | >?    |
| <=     | <=?   |
| >=     | >=?   |

## Examples

### Function Definition and Call

| JavaScript                                                          | Python                                         | snake |
| ------------------------------------------------------------------- | ---------------------------------------------- | ----- |
| `function greet() {`<br>`  console.log("Hi");`<br>`}`<br>`greet();` | `def greet():`<br>`  print("Hi")`<br>`greet()` |       |

### Nested Loops

| JavaScript                                                                                                       | Python                                                              | snake |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----- |
| `for (let i = 0; i < 3; i++) {`<br>`  for (let j = 0; j < 3; j++) {`<br>`    console.log(i, j);`<br>`  }`<br>`}` | `for i in range(3):`<br>`  for j in range(3):`<br>`    print(i, j)` |       |

### Recursion

| JavaScript                                                                                        | Python                                                                                     | snake |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----- |
| `function factorial(n) {`<br>`  if (n <= 1) return 1;`<br>`  return n * factorial(n - 1);`<br>`}` | `def factorial(n):`<br>`  if n <= 1:`<br>`    return 1`<br>`  return n * factorial(n - 1)` |       |

### Lists and Dictionaries

| JavaScript                                                                          | Python                                                                 | snake |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----- |
| `let list = [1, 2, 3];`<br>`let dict = {a: 1, b: 2};`<br>`console.log(list, dict);` | `list = [1, 2, 3]`<br>`dict = {'a': 1, 'b': 2}`<br>`print(list, dict)` |       |

### Input

| JavaScript                                                                     | Python                                                           | snake |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ----- |
| `const name = prompt("Enter your name:");`<br>`console.log("Hello, " + name);` | `name = input("Enter your name: ")`<br>`print("Hello, " + name)` |       |
