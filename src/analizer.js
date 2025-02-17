import { declaration, variable, increment } from "./core";

export default function analyze(match) {
  const grammar = match.matcher.grammar;

  const locals = new Map();
  const target = [];

  function emit(line) {
    target.push(line);
  }

  function check(condition, message, parseTreeNode) {
    if (!condition) {
      throw new Error(
        `${parseTreeNode.source.getLineAndColumnMessage()} ${message}`
      );
    }
  }

  const translator = grammar.createSemantics().addOperation("analyze", {
    Program(statements) {
      return program(statements.children.map((s) => s.analyze()));
    },
    Stmt_declaration(dec, _newline) {
      const variable = dec.analyze();
      return variable;
    },
    VarDec(type, id, _eq, exp) {
      checkNotDeclared(id.sourceString, id);
      const initializer = exp.analyze();
      const variable = variable(id.sourceString, initializer.type, true);
      locals.set(id.sourceString, variable);
      return declaration(variable, initializer);
    },
    Stmt_assignment(Assignment, _newline) {
      emit(`${Assignment.analyze()};`);
    },
    Stmt_break(_break, _newline) {},
    Stmt_print(_print, args, _newline) {
      const argument = args.analyze();
      return printStatement(argument);
    },
    Stmt_while(_while, exp, block) {
      emit(`while (${exp.analyze()}) {`);
      block.analyze();
      emit(`}`);
    },
    Assignment(id, _eq, exp) {
      check(
        locals.has(id.sourceString),
        `Undefined variable ${id.sourceString}`,
        id
      );
      return `${id.sourceString} = ${exp.analyze()}`;
    },
    Block(_open, statements, _close) {
      statements.analyze();
    },
    Exp(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.analyze())
        .join(" || ");
    },
    Exp1(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.analyze())
        .join(" && ");
    },
    Exp2(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.analyze())
        .join(" ** ");
    },
    Exp3_binary(left, op, right) {
      const targetOp =
        {
          "=?": "===",
          "!=?": "!==",
          "<?": "<",
          "<=?": "<=",
          ">?": ">",
          ">=?": ">=",
        }[op.sourceString] || op.sourceString;
      return `${left.analyze()} ${targetOp} ${right.analyze()}`;
    },
    Exp4_binary(left, op, right) {
      const targetOp =
        { "+": "+", "-": "-" }[op.sourceString] || op.sourceString;
      return `${left.analyze()} ${targetOp} ${right.analyze()}`;
    },
    Exp5_binary(left, op, right) {
      const targetOp =
        { "*": "*", "/": "/", modulus: "%" }[op.sourceString] ||
        op.sourceString;
      return `${left.analyze()} ${targetOp} ${right.analyze()}`;
    },
    Exp6_parens(_open, exp, _close) {
      return `(${exp.analyze()})`;
    },
    Exp6(args) {
      return args.analyze();
    },
    Args(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.analyze())
        .join(", ");
    },
    numberlit(_digits, _period, _decimals, _e, _unary, _exponent) {
      return Number(this.sourceString);
    },
    stringlit(_letter, _chars) {
      return `${this.sourceString}`;
    },
    newline(_) {
      return "";
    },
    _iter(...children) {
      return children.map((child) => child.analyze());
    },
  });

  translator(match).analyze();
  return target;
}
