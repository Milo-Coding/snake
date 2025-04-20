import * as core from "./core.js";

export default function analyze(match) {
  const grammar = match.matcher.grammar;

  class Context {
    constructor(parent = null, contextType = "global") {
      this.locals = new Map();
      this.parent = parent;
      this.contextType = contextType; // 'global', 'function', 'loop'
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
    isValidContext(statementType) {
      switch (statementType) {
        case "break":
          return this.findParentContextOfType("loop") !== null;
        case "output":
          return this.findParentContextOfType("function") !== null;
      }
    }
    findParentContextOfType(type) {
      let currentContext = this;
      while (currentContext) {
        if (currentContext.contextType === type) {
          return currentContext;
        }
        currentContext = currentContext.parent;
      }
      return null;
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
      check(
        context.isValidContext("break"),
        "Break statement must be used inside a loop",
        _break
      );
      return core.breakStatement();
    },
    Stmt_return(_return, exp, _newline) {
      const functionContext = context.findParentContextOfType("function");
      check(
        functionContext,
        "Output statement must be used inside a function",
        _return
      );
      // Check if there is an expression
      if (exp.sourceString) {
        const returnedValue = exp.analyze()[0];
        if (functionContext.returnType) {
          check(
            returnedValue.type === functionContext.returnType,
            `Expected output type ${functionContext.returnType}, but got ${returnedValue.type}`,
            exp
          );
        }
        check(
          context.isValidContext("output"),
          `Expected output type ${functionContext.returnType}, but got ${returnedValue.type}`,
          exp
        );
        return core.returnStatement(returnedValue);
      } else {
        // No expression provided
        if (
          functionContext.returnType &&
          functionContext.returnType !== "nothing"
        ) {
          throw new Error(
            `${_return.source.getLineAndColumnMessage()} Reusable_code must output a ${
              functionContext.returnType
            }`
          );
        }
        return core.returnStatement();
      }
    },
    Stmt_print(_print, args, _newline) {
      return core.printStatement(args.analyze());
    },
    Stmt_if(_if, exp, block, _else, block2, _newline) {
      const test = exp.analyze();
      checkType(test, "truth_value", exp);
      const consequent = block.analyze();
      const alternate = block2 ? block2.analyze() : null;
      return core.ifStatement(test, consequent, alternate);
    },
    Stmt_while(_while, exp, block, _newline) {
      context = new Context(context, "loop");
      const test = exp.analyze();
      checkType(test, "truth_value", exp);
      const body = block.analyze();
      context = context.parent;
      return core.whileStatement(test, body);
    },
    Assignment(varNode, _is, exp) {
      const variable = varNode.analyze();
      checkDeclared(variable.name, varNode);
      const source = exp.analyze();
      checkSameType(variable, source, exp);
      return core.assignment(source, variable);
    },
    VarDec(type, id, maybeInit) {
      checkNotDeclared(id.sourceString, id);
      // Create the variable with the declared type
      const variable = core.variable(id.sourceString, type.sourceString);

      // Store the variable in the context
      context.add(id.sourceString, variable);

      if (maybeInit.sourceString) {
        const initializer = maybeInit.analyze()[0];

        // For list types, store the element type from the initializer
        if (type.sourceString === "list" && initializer.elementType) {
          variable.elementType = initializer.elementType;
        }

        checkSameType(variable, initializer, id);
        return core.variableDeclaration(variable, initializer);
      }
      return core.variableDeclaration(variable);
    },
    Initializer(_is, exp) {
      const initializer = exp.analyze();
      return initializer;
    },
    FunDec(_function, id, _open, params, _close, _outputs, type, block) {
      checkNotDeclared(id.sourceString, id);

      context = new Context(context, "function");
      context.returnType = type.sourceString;

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

      // Check that we're accessing a list
      checkType(variable, "list", id);
      checkType(index, "number", exp);

      // Determine the element type from the variable's elementType property
      const elementType = variable.elementType;

      return core.subscript(variable, index, elementType);
    },
    NewList(_new, _list, _open, args, _close) {
      const elements = args.analyze();
      let elementType = null;

      // Determine element type from the first element if the list is not empty
      if (elements.length > 0) {
        elementType = elements[0].type;

        // Check that all elements have the same type
        for (let i = 1; i < elements.length; i++) {
          check(
            elements[i].type === elementType,
            `List elements must have the same type. Expected ${elementType} but got ${elements[i].type}`,
            args
          );
        }
      }

      return core.newList(elements, elementType);
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
