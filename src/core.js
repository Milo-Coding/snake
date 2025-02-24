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
//               |  while Exp Block            -- while

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

//   FunDec      =  function id "(" Params ")" "outputs" (void | Type) Block
//   Params      =  ListOf<Param, ",">
//   Param       =  Type id

export function block(statements) {
  return {
    kind: "block",
    statements,
  };
}

//   Exp         =  Condition or Condition     -- or
//               |  Condition and Condition    -- and
//               |  Condition relop Condition  -- relop
//               |  Condition
//   Condition   =  Exp addop Term             -- add
//               |  Term
//   Term        =  Term mulop Factor          -- binary
//               |  Factor
//   Factor      =  Primary "^" Factor         -- power
//               |  "-" Factor                 -- unary
//               |  Primary
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
//   Var         =  Var "[" Exp "]"            -- subscript
//               |  Var "." id                 -- property
//               |  Call
//               |  id

//   NewList     =  new list "[" Args "]"
//   EmptyList   =  new list "[" "]"
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

//   newline     =  "\n" | "\r\n"

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
