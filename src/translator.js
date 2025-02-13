// snake compiler

export default function translate(match) {
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

  const translator = grammar.createSemantics().addOperation("translate", {
    Program(statements) {
      for (const statement of statements.children) {
        statement.translate();
      }
    },
    Stmt_declaration(dec, _newline) {
      dec.translate();
    },
    VarDec(type, id, _eq, exp) {
      const initializer = exp?.translate();
      locals.set(id.sourceString, type.sourceString);
      emit(`let ${id.sourceString} = ${initializer};`);
    },
    Stmt_assignment(Assignment, _newline) {
      emit(`${Assignment.translate()};`);
    },
    Stmt_print(_print, args, _newline) {
      emit(`console.log(${args.translate()});`);
    },
    Stmt_while(_while, exp, block) {
      emit(`while (${exp.translate()}) {`);
      block.translate();
      emit(`}`);
    },
    Assignment(id, _eq, exp) {
      check(
        locals.has(id.sourceString),
        `Undefined variable ${id.sourceString}`,
        id
      );
      return `${id.sourceString} = ${exp.translate()}`;
    },
    Block(_open, statements, _close) {
      statements.translate();
    },
    Exp(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.translate())
        .join(" || ");
    },
    Exp1(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.translate())
        .join(" && ");
    },
    Exp2(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.translate())
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
      return `${left.translate()} ${targetOp} ${right.translate()}`;
    },
    Exp4_binary(left, op, right) {
      const targetOp =
        { "+": "+", "-": "-" }[op.sourceString] || op.sourceString;
      return `${left.translate()} ${targetOp} ${right.translate()}`;
    },
    Exp5_binary(left, op, right) {
      const targetOp =
        { "*": "*", "/": "/", modulus: "%" }[op.sourceString] ||
        op.sourceString;
      return `${left.translate()} ${targetOp} ${right.translate()}`;
    },
    Exp6_parens(_open, exp, _close) {
      return `(${exp.translate()})`;
    },
    Exp6(args) {
      return args.translate();
    },
    Args(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.translate())
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
      return children.map((child) => child.translate());
    },
    // id(_first, _rest) {
    //   const name = this.sourceString;
    //   check(locals.has(name), `Undefined variable ${name}`, this);
    //   return name;
    // },
    // Factor_negation(_op, operand) {
    //   return `-${operand.translate()}`;
    // },
  });

  translator(match).translate();
  return target;
}
