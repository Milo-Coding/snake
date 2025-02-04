export default function interpret(match) {
  const grammar = match.matcher.grammar;

  const memory = {};

  const interpreter = grammar.createSemantics().addOperation("interpret", {
    Program(statements) {
      for (const statement of statements.children) {
        statement.eval();
      }
    },
    Statement_assign(id, _eq, exp, _semicolin) {
      memory.set(id.sourceString, exp.eval());
    },
    Statement_print(_print, exp, _semicolin) {
      console.log(exp.eval());
    },
    // number(digits) {
    //   return Number(digits.sourceString);
    // },
    id(first, rest) {
      const name = first.sourceString + rest.sourceString;
      return memory.get(name);
    },
    //...
  });

  throw interpreter(match).eval();
}
