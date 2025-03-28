import { describe, it } from "node:test";
import { ok, throws } from "node:assert/strict";
import parse from "../src/parser.js";

describe("Parser", () => {
  it("it parses", () => {
    ok(parse("print 1\n").succeeded());
    ok(parse("print -(dog ^ 2) =? -2500\n").succeeded());
  });
  it("parses variable declarations", () => {
    ok(parse("number x is 42\n").succeeded());
    ok(parse('text greeting is "Hello World!"\n').succeeded());
    ok(parse("truth_value flag is true\n").succeeded());
  });

  it("parses conditionals", () => {
    ok(parse("if dog =? 5 {\nprint dog\n}\n").succeeded());
    ok(
      parse(
        'if dog <=? 10 {\nprint dog\n} if_not {\nprint "too big"\n}\n'
      ).succeeded()
    );
  });

  it("parses loops", () => {
    ok(parse("loop_while x <? 10 {\nx is x + 1\n}\n").succeeded());
    // for each not yet implemented
    // ok(parse("loop_for_each y in my_list {\nprint y\n}\n").succeeded());
  });

  it("parses functions", () => {
    ok(
      parse(
        'reusable_code greet() outputs nothing{\nprint "Hello"\n}\ngreet()\n'
      ).succeeded()
    );
    // parameters not yet implemented
    // ok(
    //   parse(
    //     "reusable_code add(number a, number b) outputs number{\noutput a + b\n}\n"
    //   ).succeeded()
    // );
  });

  it("throws on malformed declarations", () => {
    throws(() => parse("number \n"), /Expected/);
    throws(() => parse("text x is \n"), /Expected/);
  });

  it("throws on incomplete conditionals", () => {
    throws(() => parse("if dog =? 5 {\n"), /Expected/);
  });

  it("throws on incomplete function", () => {
    throws(() => parse("reusable_code bad() outputs nothing{\n"), /Expected/);
  });

  it("throws on syntax erorrs", () => {
    throws(() => parse("1d;1fsgref\n"), /Expected/);
    throws(() => parse("print -(dog ^ 2) =? \n"), /Expected/);
    throws(() => parse(""), /Expected/);
  });
});
