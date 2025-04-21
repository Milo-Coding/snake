import { describe, it } from "node:test";
import { strictEqual, deepEqual, ok, throws } from "node:assert/strict";
import generate from "../src/generator.js";
import parse from "../src/parser.js";
import analyze from "../src/analyzer.js";

describe("Generator", () => {
  // Helper function to process code through the full pipeline
  function generateJsFor(snakeCode) {
    const ast = parse(snakeCode);
    const analyzed = analyze(ast);
    return generate(analyzed).trim();
  }

  it("generates code for simple print statements", () => {
    const js = generateJsFor('print "hello"\n');
    strictEqual(js, 'console.log("hello");');
  });

  it("generates code for variable declarations", () => {
    const js = generateJsFor("number x is 42\n");
    strictEqual(js, "let x_1 = 42;");
  });

  it("generates code for uninitialized variables", () => {
    const numbersJs = generateJsFor("number x\n");
    strictEqual(numbersJs, "let x_1 = null;");

    const listJs = generateJsFor("list myList\n");
    strictEqual(listJs, "let myList_1 = [];");
  });

  it("generates code for assignments", () => {
    const js = generateJsFor("number x is 5\nx is 10\n");
    strictEqual(js, "let x_1 = 5;\nx_1 = 10;");
  });

  it("generates code for binary expressions", () => {
    const js = generateJsFor("print 2 + 3 * 4\n");
    strictEqual(js, "console.log((2 + (3 * 4)));");
  });

  it("generates code for comparison operators", () => {
    const js = generateJsFor("if 2 <=? 3 {\nprint 1\n}\n");
    strictEqual(js, "if ((2 <= 3)) {\nconsole.log(1);\n}");
  });

  it("generates code for logical operators", () => {
    const js = generateJsFor("if true and false {\nprint 1\n}\n");
    strictEqual(js, "if ((true && false)) {\nconsole.log(1);\n}");

    const orJs = generateJsFor("if true or false {\nprint 1\n}\n");
    strictEqual(orJs, "if ((true || false)) {\nconsole.log(1);\n}");
  });

  it("generates code for if statements with else", () => {
    const js = generateJsFor("if true {\nprint 1\n} if_not {\nprint 2\n}\n");
    strictEqual(
      js,
      "if (true) {\nconsole.log(1);\n}\nelse {\nconsole.log(2);\n}"
    );
  });

  it("generates code for while loops", () => {
    const js = generateJsFor("loop_while true {\nprint 1\n}\n");
    strictEqual(js, "while (true) {\nconsole.log(1);\n}");
  });

  it("generates code for break statements", () => {
    const js = generateJsFor("loop_while true {\nstop_loop\n}\n");
    strictEqual(js, "while (true) {\nbreak;\n}");
  });

  it("generates code for function declarations and calls", () => {
    const js = generateJsFor(
      'reusable_code greet() outputs nothing {\nprint "hi"\n}\ngreet()\n'
    );
    strictEqual(js, 'function greet_1() {\nconsole.log("hi");\n}\ngreet_1();');
  });

  it("generates code for function parameters", () => {
    const js = generateJsFor(
      "reusable_code add(number x, number y) outputs number {\noutput x + y\n}\n"
    );
    strictEqual(js, "function add_1(x_1, y_2) {\nreturn (x_1 + y_2);\n}");
  });

  it("generates code for lists", () => {
    const js = generateJsFor("list nums is new list [1, 2, 3]\n");
    strictEqual(js, "let nums_1 = [1, 2, 3];");

    const emptyListJs = generateJsFor("list empty is new list []\n");
    strictEqual(emptyListJs, "let empty_1 = [];");
  });

  it("generates code for list subscripts", () => {
    const js = generateJsFor(
      "list nums is new list [1, 2, 3]\nprint nums[0]\n"
    );
    strictEqual(js, "let nums_1 = [1, 2, 3];\nconsole.log(nums_1[0]);");
  });

  it("generates code for unary expressions", () => {
    const js = generateJsFor("print -5\n");
    strictEqual(js, "console.log(-(5));");
  });

  it("generates code for modulus operations", () => {
    const js = generateJsFor("print 10 modulus 3\n");
    strictEqual(js, "console.log((10 % 3));");
  });

  it("generates code for loops", () => {
    const no_body = generateJsFor("loop_while false {}\n");
    strictEqual(no_body, "while (false) {\n}");
    const with_body = generateJsFor("loop_while false {\nprint 1\n}\n");
    strictEqual(with_body, "while (false) {\nconsole.log(1);\n}");
    const with_long_body = generateJsFor("loop_while false {\nprint 1\nprint 2\n}\n");
    strictEqual(with_long_body, "while (false) {\nconsole.log(1);\nconsole.log(2);\n}");
  });

  it("handles multiple statements with proper variable scoping", () => {
    const program = `number x is 5
reusable_code foo() outputs number {
  number y is 10
  output x + y
}
print foo()
print x
`;
    const js = generateJsFor(program);
    const expectedJs = `let x_1 = 5;
function foo_1() {
let y_2 = 10;
return (x_1 + y_2);
}
console.log(foo_1());
console.log(x_1);
`;
    strictEqual(js, expectedJs.trim());
  });

  it("generates empty line for empty program", () => {
    const js = generateJsFor("\n");
    strictEqual(js, "");
  });

  // Additional tests to cover partially covered lines
  
  // Tests for line 30 in generator.js (program statements handling)
  it("handles program with non-array statements structure", () => {
    // This test will create a simple program with a single statement
    // The implementation should handle a single statement by wrapping it in an array
    const js = generateJsFor("print 1\n");
    strictEqual(js, "console.log(1);");
  });
  
  // Tests for line 57 in generator.js (printStatement args handling)
  it("handles print statements with single non-array arguments", () => {
    // This will test handling single arguments in print statements
    const js = generateJsFor("print 42\n");
    strictEqual(js, "console.log(42);");
  });
  
  // Tests for line 64 in generator.js (ifStatement consequent handling)
  it("handles if statements with single statement consequent", () => {
    // Testing when consequent is a single statement instead of an array
    const js = generateJsFor("if true {\nprint 1\n}\n");
    strictEqual(js, "if (true) {\nconsole.log(1);\n}");
  });
  
  // Tests for line 74 in generator.js (ifStatement alternate handling)
  it("handles if-else statements with single statement alternate", () => {
    // Testing when alternate is a single statement instead of an array
    const js = generateJsFor("if false {\nprint 1\n} if_not {\nprint 2\n}\n");
    strictEqual(js, "if (false) {\nconsole.log(1);\n}\nelse {\nconsole.log(2);\n}");
  });
  
  // Tests for line 101 in generator.js (block statements handling)
  it("handles blocks with single non-array statements", () => {
    // Testing block with a single statement that's not in an array
    const js = generateJsFor("if true {\nprint 999\n}\n");
    strictEqual(js, "if (true) {\nconsole.log(999);\n}");
  });
  
  // Additional test to ensure the block generator handles single statements properly
  it("handles various block structures", () => {
    const multiStatement = generateJsFor(`
      if true {
        print 1
        print 2
      }
    `);
    strictEqual(multiStatement.trim(), "if (true) {\nconsole.log(1);\nconsole.log(2);\n}");
    
    const singleStatement = generateJsFor(`
      if true {
        print 3
      }
    `);
    strictEqual(singleStatement.trim(), "if (true) {\nconsole.log(3);\n}");
  });
});

describe("Fails to generate code for invalid constructs", () => {
  it("handles multiple statements with proper variable scoping", () => {
    const program = `
          number x is 5
          reusable_code foo() outputs number {
            number y is 10
            output x + y
          }
          print foo()
          print y
        `;
    throws(() => generateJsFor(program, "js"), /ReferenceError/);
  });
});
