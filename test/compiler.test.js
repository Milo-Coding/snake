import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
// import compile from "../src/compiler.js";

describe("Compiler", () => {
  it("it runs", () => {
    deepEqual(1, 1);
  });

  // it compiles but is commented out because coverage is not yet implemented
  //   it('compiles valid code to "parsed" output', () => {
  //     const result = compile("print 1\n", "parsed");
  //     deepEqual(result, "Syntax is ok");
  //   });
});
