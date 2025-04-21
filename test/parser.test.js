import { describe, it } from "node:test";
import { ok, throws } from "node:assert/strict";
import parse from "../src/parser.js";

describe("Parser Passing Tests", () => {
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
  });

  it("parses functions", () => {
    ok(
      parse(
        'reusable_code greet() outputs nothing{\nprint "Hello"\n}\ngreet()\n'
      ).succeeded()
    );
    ok(
      parse(
        "reusable_code add(number a, number b) outputs number{\noutput a + b\n}\n"
      ).succeeded()
    );
  });

  it("parses nested expressions with unary and binary operators", () => {
    ok(parse("print (-(5) + 3) * 2\n").succeeded());
  });

  it("parses empty list declarations", () => {
    ok(parse("list my_list is new list []\n").succeeded());
  });

  it("parses single-element list declarations", () => {
    ok(parse("list my_list is new list [42]\n").succeeded());
  });

  it("parses multi-element list declarations", () => {
    ok(parse("list my_list is new list [1, 2, 3]\n").succeeded());
  });

  it("parses nested conditional blocks", () => {
    ok(
      parse(
        "if x =? 0 {\n" +
          "  if y >? 10 {\n" +
          '    print "nested"\n' +
          "  }\n" +
          "}\n"
      ).succeeded()
    );
  });

  it("parses unary operator with parentheses", () => {
    ok(parse("print -( (5 + 6) )\n").succeeded());
  });

  it("parses chained binary operators", () => {
    ok(parse("print 1 + 2 * 3 - 4\n").succeeded());
  });
});

describe("Parser Failing Tests", () => {
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

  it("throws on invalid token in expression", () => {
    throws(() => parse("number x is 2 $$\n"), /Expected/);
  });

  it("throws on malformed list syntax", () => {
    throws(() => parse("list x is new list [1,2\n"), /Expected/);
  });

  it("parses multiple statements in one line", () => {
    throws(
      () => parse("number x is 0; x is x + 1; if x =? 1 { print x }\n"),
      /Expected/
    );
  });

  it("throws on incomplete dictionary", () => {
    throws(() => parse('name_value_pair data is {"a": 1,\n'), /Expected/);
  });

  it("throws on no code", () => {
    throws(() => parse(""), /Expected/);
  });
});
