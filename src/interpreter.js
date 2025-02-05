// snake interpreter

export default function interpret(match) {
  const grammar = match.matcher.grammar;

  const memory = new Map();

  const interpreter = grammar.createSemantics().addOperation("eval", {
    Program(statements) {
      for (const statement of statements.children) {
        statement.eval();
      }
    },
    Statement_assign(id, _eq, exp, _semi) {
      memory.set(id.sourceString, exp.eval());
    },
    Statement_print(_print, exp, _semi) {
      console.log(exp.eval());
    },
    number(_digits, _period, _decimals, _e, _unary, _exponent) {
      return Number(this.sourceString);
    },
    id(_first, _rest) {
      const name = this.sourceString;
      if (!memory.has(name)) {
        throw new Error(`Undefined variable: ${name}`);
      }
      return memory.get(name);
    },
    Exp_binary(left, op, right) {
      switch (op.sourceString) {
        case "==":
          return left.eval() === right.eval();
        case "!=":
          return left.eval() !== right.eval();
        case "<":
          return left.eval() < right.eval();
        case "<=":
          return left.eval() <= right.eval();
        case ">":
          return left.eval() > right.eval();
        case ">=":
          return left.eval() >= right.eval();
      }
    },
    Condition_binary(left, op, right) {
      switch (op.sourceString) {
        case "+":
          return left.eval() + right.eval();
        case "-":
          return left.eval() - right.eval();
      }
    },
    Term_binary(left, op, right) {
      switch (op.sourceString) {
        case "*":
          return left.eval() * right.eval();
        case "/":
          return left.eval() / right.eval();
        case "%":
          return left.eval() % right.eval();
      }
    },
    Factor_negation(_op, operand) {
      return 0 - operand.eval();
    },
    Factor_binary(left, op, right) {
      return Math.pow(left.eval(), right.eval());
    },
    Primary_parens(_open, exp, _close) {
      return exp.eval();
    },
  });

  throw interpreter(match).eval();
}
