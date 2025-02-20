## Examples

### Function Definition and Call

| JavaScript                                                          | Python                                         | snake                                                                    |
| ------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| `function greet() {`<br>`  console.log("Hi");`<br>`}`<br>`greet();` | `def greet():`<br>`  print("Hi")`<br>`greet()` | `reusable_code greet() {`<br>`  print("Hi")`<br>`}`<br>`greet()` |

### Nested Loops

| JavaScript                                                                                                                                       | Python                                                                                                        | snake                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `let i = 0;`<br>`while (i < 3) {`<br>`  let j = 0;`<br>`  while (j < 3) {`<br>`    console.log(i, j);`<br>`    j++;`<br>`  }`<br>`  i++;`<br>`}` | `i = 0`<br>`while i < 3:`<br>`  j = 0`<br>`  while j < 3:`<br>`    print(i, j)`<br>`    j += 1`<br>`  i += 1` | `i is 0`<br>`loop_while i <? 3 {`<br>`  j is 0`<br>`  loop_while j <? 3 {`<br>`    print(i, j)`<br>`    j is j + 1`<br>`  }`<br>`  i is i + 1`<br>`}` |

### Recursion

| JavaScript                                                                                        | Python                                                                                     | snake                                                                                                                          |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `function factorial(n) {`<br>`  if (n <= 1) return 1;`<br>`  return n * factorial(n - 1);`<br>`}` | `def factorial(n):`<br>`  if n <= 1:`<br>`    return 1`<br>`  return n * factorial(n - 1)` | `reusable_code factorial(number n) {`<br>`  if n <=? 1 {`<br>`    output 1`<br>`  }`<br>`  output n * factorial(n - 1)`<br>`}` |

### Lists and Dictionaries

| JavaScript                                                                          | Python                                                                 | snake                                                                                    |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `let my_list = [1, 2, 3];`<br>`let dict = {a: 1, b: 2};`<br>`console.log(list, dict);` | `my_list = [1, 2, 3]`<br>`dict = {'a': 1, 'b': 2}`<br>`print(list, dict)` | `list my_list is [1, 2, 3]`<br>`name_value_pair dict is {'a': 1, 'b': 2}`<br>`print(list, dict)` |

### Input

| JavaScript                                                                     | Python                                                           | snake                                                                    |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `const name = prompt("Enter your name:");`<br>`console.log("Hello, " + name);` | `name = input("Enter your name: ")`<br>`print("Hello, " + name)` | `letters name is input("Enter your name:")`<br>`print("Hello, " + name)` |
