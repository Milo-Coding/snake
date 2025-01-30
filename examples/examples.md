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
