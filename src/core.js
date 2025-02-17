export function program(statements) {
  return {
    kind: "program",
    statements,
  };
}

export function variable(name, type, mutable) {
  return {
    kind: "variable",
    name,
    type,
    mutable,
  };
}

export function declaration(variable, initializer) {
  return {
    kind: "declaration",
    variable,
    initializer,
  };
}

export function breakStatement() {
  return {
    kind: "break",
  };
}

export function printStatement(argument) {
  return {
    kind: "print",
    argument,
  };
}

export function assignment(source, target) {
  return {
    kind: "assignment",
    source,
    target,
  };
}
