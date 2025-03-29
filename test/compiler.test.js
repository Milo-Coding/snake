import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import compile from "../src/compiler.js";

describe("Compiler", () => {
  it('compiles valid code to "parsed" output', () => {
    const result = compile("print 1\n", "parsed");
    deepEqual(result, "Syntax is ok");
  });
});

describe("Additional Compiler Tests", () => {
  it('compiles a single print statement to "parsed"', () => {
    const result = compile("print 1\n", "parsed");
    deepEqual(result, "Syntax is ok");
  });

  it('compiles arithmetic to "parsed"', () => {
    const prog = "number x is 5\n";
    deepEqual(compile(prog, "parsed"), "Syntax is ok");
  });

  it('compiles variable assignment to "parsed"', () => {
    const prog = "number y is 2\n";
    deepEqual(compile(prog, "parsed"), "Syntax is ok");
  });

  it('compiles multiple statements to "parsed"', () => {
    const prog = 'number a is 3\ntext b is "Hello"\n';
    deepEqual(compile(prog, "parsed"), "Syntax is ok");
  });

  it("throws with invalid output type", () => {
    let error;
    try {
      compile("print 1\n", "invalidType");
    } catch (e) {
      error = e;
    }
    deepEqual(!!error, true);
  });

  it('compiles arithmetic expression to "analyzed"', () => {
    const prog = "number x is 5\nx is x + 3\n";
    const result = compile(prog, "analyzed");
    deepEqual(typeof result, "object");
  });

  it('compiles function creation to "analyzed"', () => {
    const prog = `reusable_code greet() outputs nothing{
  print("Hi")
}\n`;
    const result = compile(prog, "analyzed");
    deepEqual(typeof result, "object");
  });

  it('compiles loop construct to "analyzed"', () => {
    const prog = `number i is 0
loop_while i <? 3 {
  i is i + 1
}\n`;
    const result = compile(prog, "analyzed");
    deepEqual(typeof result, "object");
  });

  it('compiles code with if statement to "analyzed"', () => {
    const prog = `
truth_value t is true
if t {
  print("True")
} if_not {
  print("False")
}\n`;
    const result = compile(prog, "analyzed");
    deepEqual(typeof result, "object");
  });

  it('compiles short code to "optimized"', () => {
    const prog = `number a is 2\na is a + 2\n`;
    const result = compile(prog, "optimized");
    deepEqual(typeof result, "object");
  });

  // parameters not yet implemented
  //   it('compiles function usage to "optimized"', () => {
  //     const prog = `reusable_code sum(x, y) outputs number{
  //   x is x + y
  //   output x
  // }
  // number result is sum(3,4)\n`;
  //     const result = compile(prog, "optimized");
  //     deepEqual(typeof result, "object");
  //   });

  it('compiles while loop to "optimized"', () => {
    const prog = `
number count is 0
loop_while count <? 2 {
  print("Looping")
  count is count + 1
}\n`;
    const result = compile(prog, "optimized");
    deepEqual(typeof result, "object");
  });

  it('compiles single statement to "js"', () => {
    const js = compile("print 1\n", "js");
    deepEqual(js.includes("console.log(1)"), true);
  });

  it('compiles multiple statements to "js"', () => {
    const prog = `
number n is 5
print(n)
`;
    const js = compile(prog, "js");
    deepEqual(js.includes("let n_"), true);
  });

  // parameters not yet implemented
  //   it('compiles function definition to "js"', () => {
  //     const prog = `reusable_code greet() outputs nothing{
  //   print("Hello")
  // }\n`;
  //     const js = compile(prog, "js");
  //     deepEqual(js.includes("function greet_"), true);
  //   });

  it('compiles break statement in a loop to "js"', () => {
    const prog = `
number x is 0
loop_while x <? 10 {
  stop_loop
}\n`;
    const js = compile(prog, "js");
    deepEqual(js.includes("break;"), true);
  });

  it("throws an error for unknown outputType argument", () => {
    let error;
    try {
      compile("anything\n", "unknown");
    } catch (e) {
      error = e;
    }
    deepEqual(!!error, true);
  });

  // parameters not yet implemented
  //   it('compiles a program with function return to "parsed"', () => {
  //     const prog = `
  // reusable_code double(x) outputs number {
  //   output x * 2
  // }\n`;
  //     deepEqual(compile(prog, "parsed"), "Syntax is ok");
  //   });

  it('compiles code with type mismatch to "analyzed" but might throw', () => {
    const prog = `number x is true\n`;
    let error;
    try {
      compile(prog, "analyzed");
    } catch (e) {
      error = e;
    }
    deepEqual(!!error, true);
  });

  it('compiles a nested loop to "parsed"', () => {
    const prog = `
number i is 0
loop_while i <? 2 {
  number j is 0
  loop_while j <? 2 {
    j is j + 1
  }
  i is i + 1
}\n`;
    deepEqual(compile(prog, "parsed"), "Syntax is ok");
  });

  it('compiles list creation to "parsed"', () => {
    const prog = `list myList is new list [1,2,3]\n`;
    deepEqual(compile(prog, "parsed"), "Syntax is ok");
  });

  // dictionary not yet implemented
  //   it('compiles object to "optimized"', () => {
  //     const prog = `
  // name_value_pair dict is new name_value_pair("key", 5)
  // `;
  //     const result = compile(prog, "optimized");
  //     deepEqual(typeof result, "object");
  //   });

  it('compiles an if statement to "js"', () => {
    const prog = `
truth_value test is true
if test {
  print("test")
}\n`;
    const js = compile(prog, "js");
    deepEqual(js.includes("if (test_"), true);
  });

  it('compiles an else statement to "js"', () => {
    const prog = `
truth_value test is false
if test {
  print("test True")
} if_not {
  print("test False")
}\n`;
    const js = compile(prog, "js");
    deepEqual(js.includes("else {"), true);
  });

  it('compiles a for-like loop to "optimized"', () => {
    const prog = `
number i is 0
loop_while i <? 3 {
  i is i + 1
}\n`;
    const result = compile(prog, "optimized");
    deepEqual(typeof result, "object");
  });

  it('verifies compile behavior with empty source to "parsed"', () => {
    deepEqual(compile("\n", "parsed"), "Syntax is ok");
  });

  it('compiles code with nested if statements to "js"', () => {
    const prog = `
truth_value ok is true
if ok {
  truth_value another is true
  if another {
    print("nested")
  }
}\n`;
    const js = compile(prog, "js");
    deepEqual(js.includes("if ("), true);
  });

  // null property access not yet implemented
  //   it('compiles code with a property access to "optimized"', () => {
  //     const prog = `
  // text greeting is "hello"
  // print(greeting.upper)
  // `;
  //     const result = compile(prog, "optimized");
  //     deepEqual(typeof result, "object");
  //   });

  it('compiles code using modulus operation to "js"', () => {
    const prog = `
number x is 10
x is x modulus 3
`;
    const js = compile(prog, "js");
    deepEqual(js.includes("%"), true);
  });

  // TODO: add target names for functions
  it('compiles a call statement to "js"', () => {
    const prog = `
reusable_code testFunc() outputs nothing {
  print("Inside testFunc")
}
testFunc()
`;
    const js = compile(prog, "js");
    deepEqual(js.includes("testFunc"), true);
  });

  it("handles a slightly longer program without error", () => {
    const prog = `
number counter is 0
loop_while counter <? 5 {
  print(counter)
  counter is counter + 1
}
`;
    let error;
    try {
      compile(prog, "parsed");
    } catch (e) {
      error = e;
    }
    deepEqual(!!error, false);
  });
});
