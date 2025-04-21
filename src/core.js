export function program(statements) {
  return {
    kind: "program",
    statements,
  };
}

export function assignmentStatement(assign) {
  return {
    kind: "assignmentStatement",
    assign,
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
    kind: "breakStatement",
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

export function ifStatement(test, consequent, alternate) {
  return {
    kind: "ifStatement",
    test,
    consequent,
    alternate,
  };
}

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

export function binaryExpression(left, right, op, type) {
  return {
    kind: "binaryExpression",
    left,
    right,
    op,
    type,
  };
}

export function unaryExpression(op, operand, type) {
  return {
    kind: "unaryExpression",
    op,
    operand,
    type,
  };
}

export function subscript(variable, subscript, elementType) {
  return {
    kind: "subscript",
    variable,
    subscript,
    type: elementType, // Return the element type
    name: `${variable.name}[${subscript}]`,
  };
}

export function newList(args, elementType) {
  return {
    kind: "newList",
    args,
    type: "list",
    elementType: elementType,
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
    kind: "funct",
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
    // Add elementType property for lists, will be set later if this is a list
    elementType: type === "list" ? null : undefined,
  };
}
