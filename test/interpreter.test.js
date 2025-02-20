import { describe, it } from "node:test";
import { ok, throws } from "node:assert/strict";
import parse from "../src/parser.js";

describe("Interpreter", () => {
  it("it parses", () => {
    ok(parse("print 1\n").succeeded());
    ok(parse("print -(dog ^ 2) =? -2500\n").succeeded());
  });
  it("throws on syntax erorrs", () => {
    throws(() => parse("1d;1fsgref\n"), /Expected/);
    throws(() => parse("print -(dog ^ 2) =? \n"), /Expected/);
    throws(() => parse(""), /Expected/);
  });
});
