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
      throw new Error(`${parseTreeNode.source.getLineAndColumnMessage()} ${message}`);
    }
  }

  const translator = grammar.createSemantics().addOperation("translate", {
    Program(statements) {
      for (const statement of statements.children) {
        statement.translate();
      }
    },
    Statement_while(_while, _open, condition, _close, statement) {
      emit("while (", condition.translate(), ") {");
      statement.translate();
      emit("}");
    },
    // BStatment_break(_break, _semi) {
    //   emit("break;");
    // },
    // VarDecl(_type, id, _eq, exp, _semi) {
    //   check(!locals.has(id.sourceString), `Variable ${id.sourceString} already declared`, id);
    //   const initializer = exp.translate();
    //   locals.set(id.sourceString, "number");
    //   emit(`let ${id.sourceString} = ${initializer};`);
    // },
    Statement_assign(id, _eq, exp, _semi) {
      const initializer = exp.translate();
      emit(id.sourceString, "=", initializer);
    },
    Statement_print(_print, exp, _semi) {
      emit(`console.log(${exp.translate()});`);
    },
    number(_digits, _period, _decimals, _e, _unary, _exponent) {
      return Number(this.sourceString);
    },
    id(_first, _rest) {
      const name = this.sourceString;
      check(locals.has(name), `Undefined variable ${name}`, this);
      return name;
    },
    Exp_binary(left, op, right) {
      const targetOp =
        {
          "==": "===",
          "!=": "!==",
          "<": "<",
          "<=": "<=",
          ">": ">",
          ">=": ">=",
        }?.[op.sourceString] || op.sourceString;
      return `${left.translate()} ${targetOp} ${right.translate()}`;
    },
    Condition_binary(left, op, right) {
      switch (op.sourceString) {
        case "+":
          return `${left.translate()} + ${right.translate()}`;
        case "-":
          return `${left.translate()} - ${right.translate()}`;
      }
    },
    Term_binary(left, op, right) {
      switch (op.sourceString) {
        case "*":
          return `${left.translate()} * ${right.translate()}`;
        case "/":
          return `${left.translate()} / ${right.translate()}`;
        case "%":
          return `${left.translate()} % ${right.translate()}`;
      }
    },
    Factor_negation(_op, operand) {
      return `-${operand.translate()}`;
    },
    Factor_binary(left, op, right) {
      return `${left.translate()} ** ${right.translate()}`;
    },
    Primary_parens(_open, exp, _close) {
      return `(${exp.translate()})`;
    },
  });

  translator(match).translate();
  return target;
}
