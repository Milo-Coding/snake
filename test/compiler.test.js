import { describe, it } from "node:test";
import { deepEqual, ok, throws } from "node:assert/strict";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";
import generate from "../src/generator.js";
import compile from "../src/compiler.js";

describe("Compiler Coverage", () => {
  it('compiles valid code to "parsed" output', () => {
    const result = compile("print 1\n", "parsed");
    deepEqual(result, "Syntax is ok");
  });

  it("covers empty and populated lists, multiple arguments, call usage", () => {
    const ast = parse(`
        list nums is new list []
        list vals is new list [10, 20]
        reusable_code example(number a, number b) outputs nothing {
          print a + b
        }
        example(1,2)
      `);
    ok(ast.succeeded());
    const analyzed = analyze(ast);
    generate(analyzed);
  });

  it("covers function declaration, while loop, and break usage", () => {
    const code = `
        reusable_code counterLoop(number limit) outputs nothing {
          number i is 0
          loop_while i <? limit {
            i is i + 1
            if i =? 2 {
              stop_loop
            }
          }
        }
        counterLoop(3)
      `;
    const ast = parse(code);
    ok(ast.succeeded());
    const analyzed = analyze(ast);
    generate(analyzed);
  });
});

describe("Compiler Tests", () => {
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

  it('compiles function definition to "js"', () => {
    const prog = `reusable_code greet() outputs nothing{
    print("Hello")
  }\n`;
    const js = compile(prog, "js");
    deepEqual(js.includes("function greet"), true);
  });

  it('compiles break statement in a loop to "js"', () => {
    const prog = `
number x is 0
loop_while x <? 10 {
  stop_loop
}\n`;
    const js = compile(prog, "js");
    deepEqual(js.includes("break;"), true);
  });

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

  it('compiles code using modulus operation to "js"', () => {
    const prog = `
number x is 10
x is x modulus 3
`;
    const js = compile(prog, "js");
    deepEqual(js.includes("%"), true);
  });

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

  it("handles output", () => {
    const prog = `
        reusable_code testFunc() outputs number {
  output 5
}
testFunc()
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

describe("Compiler Error Handling", () => {
  it("throws an error for unknown outputType argument", () => {
    throws(() => compile("anything\n", "unknown"), /Unknown output type/);
  });

  it("throws on syntax error with missing semicolon in assignment", () => {
    const prog = "number x is 5\nnumber y is \n";
    throws(() => compile(prog, "parsed"), /Expected/i);
  });

  it("throws on undefined variable reference", () => {
    const prog = "print(undefinedVariable)";
    throws(() => compile(prog, "analyzed"), /undefinedVariable/);
  });

  it("throws on type mismatch in binary expression", () => {
    const prog = `
          text greeting is "Hello"
          number x is 5
          print(greeting + x)
        `;
    throws(() => compile(prog, "analyzed"), /Expected/);
  });

  it("throws on reassignment to different type", () => {
    const prog = `
          number counter is 0
          counter is "string now"
        `;
    throws(() => compile(prog, "analyzed"), /Expected/);
  });

  it("throws on break statement outside of loop", () => {
    const prog = "stop_loop";
    throws(() => compile(prog, "analyzed"), /stop_loop/);
  });

  it("throws on invalid comparison operators", () => {
    const prog = 'if 5 == 5 { print("equal") }';
    throws(() => compile(prog, "parsed"), /Expected/);
  });

  it("throws on redeclaration of variable", () => {
    const prog = `
          number x is 5
          number x is 10
        `;
    throws(() => compile(prog, "analyzed"), /Variable/);
  });
});
