import { describe, it } from "node:test";
import { deepEqual, throws } from "node:assert/strict";
import analyze from "../src/analyzer.js";
import parse from "../src/parser.js";

describe("Analyzer", () => {
  it("detects type mismatch in assignment", () => {
    const ast = parse("number x is true\n");
    throws(() => analyze(ast), /Expected/);
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
