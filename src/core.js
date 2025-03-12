export function program(statements) {
  return {
    kind: "program",
    statements,
  };
}

//   Stmt        =  newline			     	-- emptyLine
//               |  Dec newline                -- declaration

export function assignmentStatement(source, target) {
  return {
    kind: "assignmentStatement",
    source,
    target,
  };
}

//               |  Call newline               -- call

export function breakStatement() {
  return {
    kind: "break",
  };
}

//               |  return Exp? newline        -- return

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

//   Assignment  =  Var "is" Exp
//   Dec         =  VarDec | FunDec

//   Type        =  boolean | string | number

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

//   Params      =  ListOf<Param, ",">
//   Param       =  Type id

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

//   Primary     =  Literal
//               |  Var
//               |  NewList
//               |  EmptyList
//               |  "(" Exp ")"                -- parens
//   Literal     =  null
//               |  true
//               |  false
//               |  numberlit
//               |  stringlit

export function subscript(variable, subscript) {
  return {
    kind: "subscript",
    variable,
    subscript,
  };
}
//  Var          =  Var "." id                 -- property
//               |  Call
//               |  id

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

//   Call        =  id "(" Args ")"
//   Args        =  ListOf<Exp, ",">

//   boolean     =  "truth_value" ~idchar
//   break       =  "stop_loop" ~idchar
//   else        =  "else" ~idchar
//   false       =  "false" ~idchar
//   for         =  "for" ~idchar
//   if          =  "if" ~idchar
//   number      =  "number" ~idchar
//   new         =  "new" ~idchar
//   null        =  "no_value" ~idchar
//   print       =  "print" ~idchar
//   return      =  "return" ~idchar
//   string      =  "text" ~idchar
//   true        =  "true" ~idchar
//   void        =  "void" ~idchar
//   while       =  "loop_while" ~idchar
//   function    =  "reusable_code" ~idchar

export function funct(id, params, type, block) {
  return {
    kind: "function",
    id,
    params,
    type,
    block,
  };
}

//   list        =  "list" ~idchar
//   or          =  "or" ~idchar
//   and         =  "and" ~idchar

//   keyword     =  boolean | if | break | else | number | for | new
//               |  return | null | while | true | string | function
//               |  void | false | print | or | and | list

//   id          =  ~keyword letter idchar*
//   idchar      =  "_" | alnum
//   numberlit   =  digit+ "."? digit* (("E"|"e") ("+"|"-")? digit+)?
//   stringlit   =  "\"" (~"\"" any)* "\""

//   addop       =  "+" | "-"
//   relop       =  "<=?" | "<?" | "=?" | "!=?" | ">=?" | ">?"
//   mulop       =  "*" | "/" | "modulus"

export function newline() {
  return {
    kind: "newline",
  };
}

//   space      :=  " " | "\t" | comment
//   comment     =  "//" (~"\n" any)*

export function variable(name, type, mutable) {
  return {
    kind: "variable",
    name,
    type,
    mutable,
  };
}
