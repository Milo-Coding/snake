import { variable /* TODO: rest */ } from "./core.js";

export default function analyze(match) {
  const grammar = match.matcher.grammar;

  const locals = new Map();
  const target = [];

  function check(condition, message, parseTreeNode) {
    if (!condition) {
      throw new Error(
        `${parseTreeNode.source.getLineAndColumnMessage()} ${message}`
      );
    }
  }

  function checkNotDeclared(name, node) {
    check(!locals.has(name), `Variable already declared: ${name}`, node);
  }

  function checkDeclared(name, node) {
    check(locals.has(name), `Variable not declared: ${name}`, node);
  }

  function checkType(name, type, node) {
    check(
      locals.get(name).type === type,
      `Expected type ${type} but got ${name.type}`,
      node
    );
  }

  const translator = grammar.createSemantics().addOperation("analyze", {
    Program(statements) {
      return program(statements.children.map((s) => s.analyze()));
    },
    // Stmt        =  newline			     	         -- emptyLine
    //             |  Dec newline                -- declaration
    //             |  Assignment newline         -- assignment
    //             |  Call newline               -- call
    //             |  break newline              -- break
    //             |  return Exp? newline        -- return
    Stmt_print(_print, args, _newline) {
      return printStatement(args.analyze());
    },
    //             |  if Exp Block (else if Exp Block)* (else Block)?  -- if
    Stmt_While(_while, exp, block) {
      const test = exp.analyze();
      checkType(test, "boolean", exp);
      return whileStatement(test, block.analyze());
    },
    Assignment(varNode, _is, exp) {
      const variable = varNode.analyze();
      checkDeclared(variable.name, varNode);
      const source = exp.analyze();
      return assignmentStatement(source, variable);
    },
    // Dec         =  VarDec | FunDec

    // Type        =  boolean | string | number

    VarDec(type, id, _is, exp) {
      checkNotDeclared(id.sourceString, id);
      const initializer = exp ? exp.analyze() : null;
      const variable = variable(id.sourceString, type.sourceString, true);
      locals.set(id.sourceString, variable);
      return declaration(variable, initializer);
    },
    // FunDec      =  function id "(" Params ")" "outputs" (void | Type) Block
    // Params      =  ListOf<Param, ",">
    // Param       =  Type id
    // Block       =  "{" Stmt* "}"

    // Exp         =  Condition or Condition     -- or
    //             |  Condition and Condition    -- and
    //             |  Condition relop Condition  -- relop
    //             |  Condition
    // Condition   =  Exp addop Term             -- add
    //             |  Term
    // Term        =  Term mulop Factor          -- binary
    //             |  Factor
    // Factor      =  Primary "^" Factor         -- power
    //             |  "-" Factor                 -- unary
    //             |  Primary
    // Primary     =  Literal
    //             |  Var
    //             |  NewList
    //             |  EmptyList
    //             |  "(" Exp ")"                -- parens
    // Literal     =  null
    //             |  true
    //             |  false
    //             |  numberlit
    //             |  stringlit
    // Var         =  Var "[" Exp "]"            -- subscript
    //             |  Var "." id                 -- property
    //             |  Call
    //             |  id

    // NewList     =  new list "[" Args "]"
    // EmptyList   =  new list "[" "]"
    // Call        =  id "(" Args ")"
    // Args        =  ListOf<Exp, ",">

    // boolean     =  "truth_value" ~idchar
    // break       =  "stop_loop" ~idchar
    // else        =  "else" ~idchar
    // false       =  "false" ~idchar
    // for         =  "for" ~idchar
    // if          =  "if" ~idchar
    // number      =  "number" ~idchar
    // new         =  "new" ~idchar
    // null        =  "no_value" ~idchar
    // print       =  "print" ~idchar
    // return      =  "return" ~idchar
    // string      =  "text" ~idchar
    // true        =  "true" ~idchar
    // void        =  "void" ~idchar
    // while       =  "loop_while" ~idchar
    // function    =  "reusable_code" ~idchar
    // list        =  "list" ~idchar
    // or          =  "or" ~idchar
    // and         =  "and" ~idchar

    // keyword     =  boolean | if | break | else | number | for | new
    //             |  return | null | while | true | string | function
    //             |  void | false | print | or | and | list

    id(_first, _rest) {
      checkDeclared(this.sourceString, this);
      const entity = locals.get(this.sourceString);
      return variable(entity.name, entity.type, entity.mutable);
    },
    // idchar      =  "_" | alnum
    // numberlit   =  digit+ "."? digit* (("E"|"e") ("+"|"-")? digit+)?
    // stringlit   =  "\"" (~"\"" any)* "\""

    // addop       =  "+" | "-"
    // relop       =  "<=?" | "<?" | "=?" | "!=?" | ">=?" | ">?"
    // mulop       =  "*" | "/" | "modulus"

    // newline     =  "\n" | "\r\n"

    // space      :=  " " | "\t" | comment
    // comment     =  "//" (~"\n" any)*
  });

  translator(match).analyze();
  return target;
}
