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
    Stmt_print(_print, args, _newline) {
      emit(`console.log(${args.translate()});`);
    },
    Stmt_declaration(_dec, _newline) {},
    VarDec(type, id, _eq, exp) {
      const initializer = exp?.translate();
      locals.set(id.sourceString, type.sourceString);
      emit(`let ${id.sourceString} = ${initializer};`);
    },
    Args(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.translate())
        .join(", ");
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
    Exp3(left, op, right) {
      const targetOp =
        {
          "=?": "===",
          "!=?": "!==",
          "<?": "<",
          "<=?": "<=",
          ">?": ">",
          ">=?": ">=",
        }?.[op.sourceString] || op.sourceString;
      return `${left.translate()}${targetOp}${right.translate()}`;
    },
    Exp4(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.translate())
        .join(" + ");
    },
    Exp5(args) {
      return args
        .asIteration()
        .children.map((arg) => arg.translate())
        .join(" * ");
    },
    Exp6_parens(_open, exp, _close) {
      return `(${exp.translate()})`;
    },
    Exp6(args) {
      return args.translate();
    },
    numberlit(_digits, _period, _decimals, _e, _unary, _exponent) {
      return Number(this.sourceString);
    },
    stringlit(_letter, _chars) {
      return `${this.sourceString}`;
    },
    _iter(...children) {
      return children.map((child) => child.translate());
    },
  });

  translator(match).translate();
  return target;
}
