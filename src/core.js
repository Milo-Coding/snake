export function program(statements) {
  return {
    kind: "program",
    statements,
  };
}

export function assignmentStatement(source, target) {
  return {
    kind: "assignmentStatement",
    source,
    target,
  };
}

export function callStatement(call) {
  return {
    kind: "callStatement",
    call,
  };
}

export function breakStatement() {
  return {
    kind: "break",
  };
}

export function returnStatement(expression) {
  return {
    kind: "returnStatement",
    expression,
  };
}

export function printStatement(args) {
  return {
    kind: "printStatement",
    args,
  };
}

//               |  if Exp Block (else if Exp Block)* (else Block)?  -- if

export function whileStatement(test, body) {
  return {
    kind: "whileStatement",
    test,
    body,
  };
}

export function assignment(target, source) {
  return {
    kind: "assignment",
    target,
    source,
  };
}

export function variableDeclaration(variable, initializer) {
  return {
    kind: "variableDeclaration",
    variable,
    initializer,
  };
}

export function functionDeclaration(func, body) {
  return {
    kind: "functionDeclaration",
    func,
    body,
  };
}

export function block(statements) {
  return {
    kind: "block",
    statements,
  };
}

export function binaryExpression(left, right, operator, type) {
  return {
    kind: "binaryExpression",
    left,
    right,
    operator,
    type,
  };
}

export function unaryExpression(operator, operand, type) {
  return {
    kind: "unaryExpression",
    operator,
    operand,
    type,
  };
}

export function subscript(variable, subscript) {
  return {
    kind: "subscript",
    variable,
    subscript,
  };
}

export function property(variable, id) {
  return {
    kind: "property",
    variable,
    id,
  };
}

export function newList(args) {
  return {
    kind: "newList",
    args,
  };
}

export function emptyList() {
  return {
    kind: "emptyList",
  };
}

export function call(callee, args) {
  return {
    kind: "call",
    callee,
    args,
  };
}

export function funct(id, params, type, block) {
  return {
    kind: "function",
    id,
    params,
    type,
    block,
  };
}

export function newline() {
  return {
    kind: "newline",
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
