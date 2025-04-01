import { describe, it } from "node:test";
import { deepEqual, throws, ok } from "node:assert/strict";
import analyze from "../src/analyzer.js";
import parse from "../src/parser.js";

describe("Analyzer Error Handling", () => {
  it("detects type mismatch in assignment", () => {
    const ast = parse("number x is true\n");
    throws(() => analyze(ast), /Expected/);
  });
  
  it("covers some error paths in analyzer", () => {
    // Already declared variable
    throws(() => analyze(parse("number x is 0\nnumber x is 1\n")), /Variable/);

    // Mismatched type in assignment
    throws(() => analyze(parse("number x is 0\nx is true\n")), /Expected same/);

    // Return outside function
    throws(() => analyze(parse("return 5\n")), /Return statement must be used/);
  });
});

describe("Analyzer Coverage", () => {
  it("covers or / and / relop expressions", () => {
    const astOr = parse("if true or false {\nprint 1\n}\n");
    ok(astOr.succeeded());
    analyze(astOr);

    const astAnd = parse("if true and false {\nprint 2\n}\n");
    ok(astAnd.succeeded());
    analyze(astAnd);

    const astRelop = parse("if 1 >? 0 {\nprint 3\n}\n");
    ok(astRelop.succeeded());
    analyze(astRelop);
  });

  it("covers nested binary, unary, and power expressions", () => {
    const ast = parse("print -(2 ^ 3) + 4\n");
    ok(ast.succeeded());
    analyze(ast);
  });

  it("covers parentheses, subscript, and property", () => {
    const ast = parse(`
        list my_list is new list [1,2,3]
        print ( (my_list[1]) )
      `);
    ok(ast.succeeded());
    analyze(ast);
  });

  // returns not yet implemented
  //   it("analyzes valid function code", () => {
  //     const ast = parse(
  //       "reusable_code myFunc() outputs number {\noutput 42\n}\nmyFunc()\n"
  //     );
  //     const analyzed = analyze(ast);
  //     deepEqual(typeof analyzed, "object");
  //   });
});
