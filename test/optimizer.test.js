import { describe, it } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert/strict";
import optimize from "../src/optimizer.js";

// filepath: /Users/milofritzen/Documents/GitHub/snake/test/optimizer.test.js

describe("The optimizer", () => {
  // Helper function to make test nodes
  const program = (statements) => ({ kind: "program", statements });
  const variableDeclaration = (variable, initializer) => ({
    kind: "variableDeclaration",
    variable,
    initializer,
  });
  const variable = (name) => ({ kind: "variable", name });
  const binary = (op, left, right) => ({
    kind: "binaryExpression",
    op,
    left,
    right,
  });
  const unary = (op, operand) => ({ kind: "unaryExpression", op, operand });
  const assignment = (target, source) => ({
    kind: "assignment",
    target,
    source,
  });
  const assignmentStatement = (assign) => ({
    kind: "assignmentStatement",
    assign,
  });
  const block = (statements) => ({ kind: "block", statements });
  const functionDeclaration = (func, body) => ({
    kind: "functionDeclaration",
    func,
    body,
  });
  const funct = (params) => ({ kind: "funct", params });
  const ifStatement = (test, consequent, alternate) => ({
    kind: "ifStatement",
    test,
    consequent,
    alternate,
  });
  const whileStatement = (test, body) => ({
    kind: "whileStatement",
    test,
    body,
  });
  const breakStatement = () => ({ kind: "breakStatement" });
  const returnStatement = (expression) => ({
    kind: "returnStatement",
    expression,
  });
  const printStatement = (args) => ({ kind: "printStatement", args });
  const subscript = (variable, subscript) => ({
    kind: "subscript",
    variable,
    subscript,
  });
  const newList = (args) => ({ kind: "newList", args });
  const call = (callee, args) => ({ kind: "call", callee, args });
  const callStatement = (call) => ({ kind: "callStatement", call });

  // Tests for the main optimize function
  it("returns the node unchanged when there is no optimizer for its kind", () => {
    const node = { kind: "unknown" };
    strictEqual(optimize(node), node);
  });

  it("returns the node unchanged when node is null or undefined", () => {
    strictEqual(optimize(null), null);
    strictEqual(optimize(undefined), undefined);
  });

  // Tests for individual optimizers
  describe("program optimizer", () => {
    it("optimizes all statements in a program", () => {
      const original = program([
        assignmentStatement(assignment(variable("x"), variable("x"))),
        printStatement([5]),
      ]);
      const expected = program([printStatement([5])]);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("variableDeclaration optimizer", () => {
    it("optimizes variable declarations with initializers", () => {
      const original = variableDeclaration(variable("x"), binary("+", 2, 3));
      const expected = variableDeclaration(variable("x"), 5);
      deepStrictEqual(optimize(original), expected);
    });

    it("handles variable declarations without initializers", () => {
      const original = variableDeclaration(variable("x"), null);
      const expected = variableDeclaration(variable("x"), null);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("functionDeclaration optimizer", () => {
    it("optimizes function declarations", () => {
      const original = functionDeclaration(
        funct([variable("x")]),
        block([returnStatement(binary("+", 1, 1))])
      );
      const expected = functionDeclaration(
        funct([variable("x")]),
        block([returnStatement(2)])
      );
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("funct optimizer", () => {
    it("optimizes function parameters", () => {
      const original = funct([variable("x"), variable("y")]);
      const expected = funct([variable("x"), variable("y")]);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("assignment optimizer", () => {
    it("eliminates self-assignments with same reference", () => {
      const x = variable("x");
      const original = assignment(x, x);
      deepStrictEqual(optimize(original), []);
    });

    it("eliminates self-assignments with same name", () => {
      const original = assignment(variable("x"), variable("x"));
      deepStrictEqual(optimize(original), []);
    });

    it("optimizes source and target of assignments", () => {
      const original = assignment(variable("x"), binary("+", 1, 2));
      const expected = assignment(variable("x"), 3);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("assignmentStatement optimizer", () => {
    it("removes assignment statement when assignment is eliminated", () => {
      const original = assignmentStatement(
        assignment(variable("x"), variable("x"))
      );
      deepStrictEqual(optimize(original), []);
    });

    it("keeps assignment statement when assignment remains", () => {
      const assign = assignment(variable("x"), 5);
      const original = assignmentStatement(assign);
      const expected = assignmentStatement(assign);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("breakStatement optimizer", () => {
    it("returns break statements unchanged", () => {
      const original = breakStatement();
      strictEqual(optimize(original), original);
    });
  });

  describe("returnStatement optimizer", () => {
    it("optimizes expressions in return statements", () => {
      const original = returnStatement(binary("+", 2, 3));
      const expected = returnStatement(5);
      deepStrictEqual(optimize(original), expected);
    });

    it("handles return statements without expressions", () => {
      const original = returnStatement(null);
      const expected = returnStatement(null);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("printStatement optimizer", () => {
    it("optimizes args in print statements", () => {
      const original = printStatement([binary("+", 2, 3)]);
      const expected = printStatement([5]);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("ifStatement optimizer", () => {
    it("optimizes all parts of an if statement", () => {
      const original = ifStatement(
        binary("=?", 1, 1),
        block([printStatement([1])]),
        block([printStatement([2])])
      );
      const expected = block([printStatement([1])]);
      deepStrictEqual(optimize(original), expected);
    });

    it("reduces to consequent when test is true", () => {
      const consequent = block([printStatement([1])]);
      const alternate = block([printStatement([2])]);
      const original = ifStatement(true, consequent, alternate);
      deepStrictEqual(optimize(original), consequent);
    });

    it("reduces to alternate when test is false", () => {
      const consequent = block([printStatement([1])]);
      const alternate = block([printStatement([2])]);
      const original = ifStatement(false, consequent, alternate);
      deepStrictEqual(optimize(original), alternate);
    });

    it("reduces to empty array when test is false and there is no alternate", () => {
      const consequent = block([printStatement([1])]);
      const original = ifStatement(false, consequent, null);
      deepStrictEqual(optimize(original), []);
    });
  });

  describe("whileStatement optimizer", () => {
    it("removes while statement when test is false", () => {
      const original = whileStatement(false, block([printStatement([1])]));
      deepStrictEqual(optimize(original), []);
    });

    it("optimizes body and test in while statement", () => {
      const original = whileStatement(
        binary("<?", 1, 2),
        block([
          assignmentStatement(assignment(variable("x"), binary("+", 1, 1))),
        ])
      );
      const expected = whileStatement(
        true,
        block([assignmentStatement(assignment(variable("x"), 2))])
      );
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("block optimizer", () => {
    it("optimizes statements in blocks", () => {
      const original = block([
        assignmentStatement(assignment(variable("x"), variable("x"))),
        printStatement([5]),
      ]);
      const expected = block([printStatement([5])]);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("binaryExpression optimizer", () => {
    it("folds addition of numbers", () => {
      const original = binary("+", 2, 3);
      strictEqual(optimize(original), 5);
    });

    it("folds subtraction of numbers", () => {
      const original = binary("-", 5, 3);
      strictEqual(optimize(original), 2);
    });

    it("folds multiplication of numbers", () => {
      const original = binary("*", 2, 3);
      strictEqual(optimize(original), 6);
    });

    it("folds division of numbers", () => {
      const original = binary("/", 6, 3);
      strictEqual(optimize(original), 2);
    });

    it("folds exponentiation with ** operator", () => {
      const original = binary("**", 2, 3);
      strictEqual(optimize(original), 8);
    });

    it("folds exponentiation with ^ operator", () => {
      const original = binary("^", 2, 3);
      strictEqual(optimize(original), 8);
    });

    it("folds modulus of numbers", () => {
      const original = binary("modulus", 7, 4);
      strictEqual(optimize(original), 3);
    });

    it("folds equality comparisons", () => {
      strictEqual(optimize(binary("=?", 5, 5)), true);
      strictEqual(optimize(binary("=?", 5, 6)), false);
    });

    it("folds inequality comparisons", () => {
      strictEqual(optimize(binary("!=?", 5, 6)), true);
      strictEqual(optimize(binary("!=?", 5, 5)), false);
    });

    it("folds less than comparisons", () => {
      strictEqual(optimize(binary("<?", 5, 6)), true);
      strictEqual(optimize(binary("<?", 6, 5)), false);
    });

    it("folds less than or equal comparisons", () => {
      strictEqual(optimize(binary("<=?", 5, 5)), true);
      strictEqual(optimize(binary("<=?", 6, 5)), false);
    });

    it("folds greater than comparisons", () => {
      strictEqual(optimize(binary(">?", 6, 5)), true);
      strictEqual(optimize(binary(">?", 5, 6)), false);
    });

    it("folds greater than or equal comparisons", () => {
      strictEqual(optimize(binary(">=?", 5, 5)), true);
      strictEqual(optimize(binary(">=?", 5, 6)), false);
    });

    it("applies boolean OR optimizations", () => {
      strictEqual(optimize(binary("||", true, false)), true);
      strictEqual(optimize(binary("||", false, true)), true);
      strictEqual(optimize(binary("||", true, "anything")), true);
      deepStrictEqual(optimize(binary("||", false, "anything")), "anything");
    });

    it("applies boolean AND optimizations", () => {
      strictEqual(optimize(binary("&&", false, true)), false);
      strictEqual(optimize(binary("&&", true, false)), false);
      strictEqual(optimize(binary("&&", false, "anything")), false);
      deepStrictEqual(optimize(binary("&&", true, "anything")), "anything");
    });

    it("applies strength reductions with zero left operand in addition", () => {
      const right = variable("x");
      deepStrictEqual(optimize(binary("+", 0, right)), right);
    });

    it("applies strength reductions with zero right operand in addition/subtraction", () => {
      const left = variable("x");
      deepStrictEqual(optimize(binary("+", left, 0)), left);
      deepStrictEqual(optimize(binary("-", left, 0)), left);
    });

    it("applies strength reductions with one left operand in multiplication", () => {
      const right = variable("x");
      deepStrictEqual(optimize(binary("*", 1, right)), right);
    });

    it("applies strength reductions with one right operand in multiplication/division", () => {
      const left = variable("x");
      deepStrictEqual(optimize(binary("*", left, 1)), left);
      deepStrictEqual(optimize(binary("/", left, 1)), left);
    });

    it("applies strength reductions with zero right operand in multiplication", () => {
      const left = variable("x");
      strictEqual(optimize(binary("*", left, 0)), 0);
    });

    it("applies strength reductions with zero left operand in multiplication", () => {
      const right = variable("x");
      strictEqual(optimize(binary("*", 0, right)), 0);
    });

    it("applies strength reductions with zero right operand in exponentiation", () => {
      const left = variable("x");
      strictEqual(optimize(binary("^", left, 0)), 1);
    });

    it("applies strength reductions with one right operand in exponentiation", () => {
      const left = variable("x");
      deepStrictEqual(optimize(binary("^", left, 1)), left);
    });
  });

  describe("unaryExpression optimizer", () => {
    it("folds negation of numbers", () => {
      const original = unary("-", 5);
      strictEqual(optimize(original), -5);
    });

    it("optimizes operand of unary expression", () => {
      const original = unary("-", binary("+", 2, 3));
      strictEqual(optimize(original), -5);
    });

    it("doesn't fold when operand is not a number", () => {
      const v = variable("x");
      const original = unary("-", v);
      deepStrictEqual(optimize(original), original);
    });
  });

  describe("subscript optimizer", () => {
    it("optimizes variable and subscript", () => {
      const original = subscript(variable("a"), binary("+", 1, 1));
      const expected = subscript(variable("a"), 2);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("newList optimizer", () => {
    it("optimizes args in list creation", () => {
      const original = newList([binary("+", 1, 1), binary("*", 2, 2)]);
      const expected = newList([2, 4]);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("call optimizer", () => {
    it("optimizes callee and args in function calls", () => {
      const original = call(variable("f"), [binary("+", 1, 1)]);
      const expected = call(variable("f"), [2]);
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("callStatement optimizer", () => {
    it("optimizes the call in a call statement", () => {
      const original = callStatement(call(variable("f"), [binary("+", 1, 1)]));
      const expected = callStatement(call(variable("f"), [2]));
      deepStrictEqual(optimize(original), expected);
    });
  });

  describe("variable optimizer", () => {
    it("returns variable nodes unchanged", () => {
      const original = variable("x");
      strictEqual(optimize(original), original);
    });
  });
});
