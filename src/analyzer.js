import * as core from "./core.js";

export default function analyze(match) {
  const grammar = match.matcher.grammar;

  class Context {
    constructor(parent = null) {
      this.locals = new Map();
      this.parent = parent;
    }
    add(name, entity) {
      this.locals.set(name, entity);
    }
    has(name) {
      return this.locals.has(name);
    }
    lookup(name) {
      return this.locals.get(name) ?? (this.parent && this.parent.lookup(name));
    }
  }

  let context = new Context();

  function check(condition, message, node) {
    if (!condition) {
      throw new Error(`${node.source.getLineAndColumnMessage()} ${message}`);
    }
  }

  function checkDeclared(entity, node) {
    check(entity, `${entity} not declared`, node);
  }

  function checkNotDeclared(name, node) {
    check(!context.has(name), `Variable already declared: ${name}`, node);
  }

  function checkType(name, type, node) {
    check(
      name.type === type,
      `Expected type ${type} but got ${name.type}`,
      node
    );
  }

  function checkManyTypes(name, types, node) {
    check(
      types.includes(name.type),
      `Expected type to be in [${types}] but got ${name.type}`,
      node
    );
  }

  function checkSameType(left, right, node) {
    check(
      left.type === right.type,
      `Expected same types but got ${left.type} and ${right.type}`,
      node
    );
  }

  const analyzer = grammar.createSemantics().addOperation("analyze", {
    Program(statements) {
      return core.program(statements.children.map((s) => s.analyze()));
    },
    Stmt_declaration(dec, _newline) {
      return dec.analyze();
    },
    Stmt_assignment(assignment, _newline) {
      return core.assignmentStatement(assignment.analyze());
    },
    Stmt_call(call, _newline) {
      return core.callStatement(call.analyze());
    },
    Stmt_break(_break, _newline) {
      return core.breakStatement();
    },
    Stmt_return(_return, exp, _newline) {
      return core.returnStatement(exp.analyze());
    },
    Stmt_print(_print, args, _newline) {
      return core.printStatement(args.analyze());
    },
    //             |  if Exp Block (else if Exp Block)* (else Block)?  -- if
    Stmt_while(_while, exp, block, _newline) {
      const test = exp.analyze();
      checkType(test, "truth_value", exp);
      return core.whileStatement(test, block.analyze());
    },
    Assignment(varNode, _is, exp) {
      const variable = varNode.analyze();
      checkDeclared(variable.name, varNode);
      const source = exp.analyze();
      checkSameType(variable, source, exp);
      return core.assignment(source, variable);
    },
    VarDec(type, id, _is, exp) {
      checkNotDeclared(id.sourceString, id);
      const initializer = exp ? exp.analyze() : null;
      const variable = core.variable(id.sourceString, type.sourceString, true);
      context.add(id.sourceString, variable);
      return core.variableDeclaration(variable, initializer[0]);
    },
    FunDec(_function, id, _open, params, _close, _outputs, type, block) {
      checkNotDeclared(id.sourceString, id);
      context = new Context(context);
      const parameters = params.analyze();
      const body = block.analyze();
      context = context.parent;
      const fun = core.funct(
        id.sourceString,
        parameters,
        type.sourceString,
        body
      );
      context.add(id.sourceString, fun);
      return core.functionDeclaration(fun, body);
    },
    Params(params) {
      return params.asIteration().children.map((p) => p.analyze());
    },
    Param(type, id) {
      const param = core.variable(id.sourceString, type.sourceString, true);
      context.add(id.sourceString, param);
      return param;
    },
    Block(_open, statements, _close) {
      return core.block(statements.children.map((s) => s.analyze()));
    },
    Exp_or(left, _or, right) {
      const leftValue = left.analyze();
      const rightValue = right.analyze();
      checkType(leftValue, "truth_value", left);
      checkType(rightValue, "truth_value", right);
      return core.binaryExpression(leftValue, rightValue, "||", "truth_value");
    },
    Exp_and(left, _and, right) {
      const leftValue = left.analyze();
      const rightValue = right.analyze();
      checkType(leftValue, "truth_value", left);
      checkType(rightValue, "truth_value", right);
      return core.binaryExpression(leftValue, rightValue, "&&", "truth_value");
    },
    Exp_relop(left, relop, right) {
      const leftValue = left.analyze();
      const rightValue = right.analyze();
      if (relop.sourceString === "=?" || relop.sourceString === "!=?") {
        checkSameType(leftValue, rightValue, left);
      } else {
        checkType(leftValue, "number", left);
        checkType(rightValue, "number", right);
      }
      return core.binaryExpression(
        leftValue,
        rightValue,
        relop.sourceString,
        "truth_value"
      );
    },
    Condition_binary(exp, addop, term) {
      const left = exp.analyze();
      const right = term.analyze();
      if (addop.sourceString === "+") {
        checkManyTypes(left, ["number", "text"], exp);
      } else {
        checkType(left, "number", exp);
      }
      checkSameType(left, right, exp);
      return core.binaryExpression(left, right, addop.sourceString, left.type);
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
    Primary_parens(_open, exp, _close) {
      return exp.analyze();
    },
    Var_subscript(id, _open, exp, _close) {
      const variable = id.analyze();
      const index = exp.analyze();
      checkType(variable, "list", id);
      checkType(index, "number", exp);
      return core.subscript(variable, index);
    },
    Var_property(variable, _dot, id) {
      const prop = id.analyze();
      checkType(variable, "list", variable);
      return core.property(variable, prop);
    },
    NewList(_new, _list, _open, args, _close) {
      return core.newList(args.analyze());
    },
    EmptyList(_new, _list, _open, _close) {
      return core.emptyList();
    },
    Call(id, _open, expressions, _close) {
      const callee = id.analyze();
      const args = expressions.analyze();
      return core.call(callee, args);
    },
    Args(expressions) {
      return expressions.asIteration().children.map((e) => e.analyze());
    },
    false(_) {
      return false;
    },
    true(_) {
      return true;
    },
    id(_first, _rest) {
      const entity = context.lookup(this.sourceString);
      checkDeclared(entity, this);
      return entity;
    },
    numberlit(_digits, _period, _decimals, _e, _unary, _exponent) {
      return Number(this.sourceString);
    },
    stringlit(_open, chars, _close) {
      return `${chars.sourceString}`;
    },
    newline(_) {
      return core.newline();
    },
    _iter(...children) {
      return children.map((child) => child.analyze());
    },
  });

  return analyzer(match).analyze();
}

Number.prototype.type = "number";
String.prototype.type = "text";
Boolean.prototype.type = "truth_value";
