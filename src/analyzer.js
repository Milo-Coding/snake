import * as core from "./core.js";

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
      locals.get(name) ? locals.get(name).type === type : name.type === type,
      `Expected type ${type} but got ${name.type}`,
      node
    );
  }

  const translator = grammar.createSemantics().addOperation("analyze", {
    Program(statements) {
      return core.program(statements.children.map((s) => s.analyze()));
    },
    // Stmt        =  newline			     	         -- emptyLine
    Stmt_declaration(dec, _newline) {
      return dec.analyze();
    },
    //             |  Assignment newline         -- assignment
    //             |  Call newline               -- call
    //             |  break newline              -- break
    //             |  return Exp? newline        -- return
    Stmt_print(_print, args, _newline) {
      return core.printStatement(args.analyze());
    },
    //             |  if Exp Block (else if Exp Block)* (else Block)?  -- if
    Stmt_while(_while, exp, block, _newline) {
      const test = exp.analyze();
      checkType(test, "boolean", exp);
      return core.whileStatement(test, block.analyze());
    },
    Assignment(varNode, _is, exp) {
      const variable = varNode.analyze();
      checkDeclared(variable.name, varNode);
      const source = exp.analyze();
      return core.assignmentStatement(source, variable);
    },
    // Dec         =  VarDec | FunDec

    // Type        =  boolean | string | number

    VarDec(type, id, _is, exp) {
      checkNotDeclared(id.sourceString, id);
      const initializer = exp ? exp.analyze() : null;
      const variable = core.variable(id.sourceString, type.sourceString, true);
      locals.set(id.sourceString, variable);
      return core.variableDeclaration(variable, initializer);
    },
    // FunDec      =  function id "(" Params ")" "outputs" (void | Type) Block
    // Params      =  ListOf<Param, ",">
    // Param       =  Type id
    Block(_open, statements, _close) {
      return core.block(statements.children.map((s) => s.analyze()));
    },
    Exp_or(left, _or, right) {
      const leftValue = left.analyze();
      const rightValue = right.analyze();
      checkType(leftValue, "boolean", left);
      checkType(rightValue, "boolean", right);
      return core.binaryExpression(leftValue, rightValue, "||", "boolean");
    },
    Exp_and(left, _and, right) {
      const leftValue = left.analyze();
      const rightValue = right.analyze();
      checkType(leftValue, "boolean", left);
      checkType(rightValue, "boolean", right);
      return core.binaryExpression(leftValue, rightValue, "&&", "boolean");
    },
    Exp_relop(left, relop, right) {
      const leftValue = left.analyze();
      const rightValue = right.analyze();
      // TODO: Needs type checking for non numbers
      checkType(leftValue, "number", left);
      checkType(rightValue, "number", right);
      return core.binaryExpression(
        leftValue,
        rightValue,
        relop.sourceString,
        "boolean"
      );
    },
    Condition_binary(exp, addop, term) {
      const left = exp.analyze();
      const right = term.analyze();
      checkType(left, "number", exp);
      checkType(right, "number", term);
      return core.binaryExpression(left, right, addop.sourceString, "number");
    },
    Term_binary(term, mulop, factor) {
      const left = term.analyze();
      const right = factor.analyze();
      checkType(left, "number", term);
      checkType(right, "number", factor);
      return core.binaryExpression(left, right, mulop.sourceString, "number");
    },
    Factor_power(left, _power, right) {
      const base = left.analyze();
      const exponent = right.analyze();
      checkType(base, "number", left);
      checkType(exponent, "number", right);
      return core.binaryExpression(base, exponent, "**", "number");
    },
    Factor_unary(_op, exp) {
      const operand = exp.analyze();
      checkType(operand, "number", exp);
      return core.unaryExpression("-", operand, "number");
    },
    // Primary     =  Literal
    //             |  Var
    //             |  NewList
    //             |  EmptyList
    Primary_parens(_open, exp, _close) {
      return exp.analyze();
    },
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
    Args(expressions) {
      return expressions.asIteration().children.map((e) => e.analyze());
    },
    // boolean     =  "truth_value" ~idchar
    // break       =  "stop_loop" ~idchar
    // else        =  "else" ~idchar
    false(_) {
      return false;
    },
    // for         =  "for" ~idchar
    // if          =  "if" ~idchar
    // number      =  "number" ~idchar
    // new         =  "new" ~idchar
    // null        =  "no_value" ~idchar
    // print       =  "print" ~idchar
    // return      =  "return" ~idchar
    // string      =  "text" ~idchar
    true(_) {
      return true;
    },
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
      return entity;
    },
    // idchar      =  "_" | alnum
    numberlit(_digits, _period, _decimals, _e, _unary, _exponent) {
      return Number(this.sourceString);
    },
    stringlit(_open, chars, _close) {
      return `${chars.sourceString}`;
    },

    // addop       =  "+" | "-"
    // relop       =  "<=?" | "<?" | "=?" | "!=?" | ">=?" | ">?"
    // mulop       =  "*" | "/" | "modulus"

    newline(_) {
      return core.newline();
    },

    // space      :=  " " | "\t" | comment
    // comment     =  "//" (~"\n" any)*
    _iter(...children) {
      return children.map((child) => child.analyze());
    },
  });

  translator(match).analyze();
  return target;
}

Number.prototype.type = "number";
String.prototype.type = "text";
Boolean.prototype.type = "truth_value";
