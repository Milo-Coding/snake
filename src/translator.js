// snake compiler backend

export default function translate(program) {
  
  function emit(line) {
    target.push(line);
  }

  console.log("translator not implemented");

  // const translator = grammar.createSemantics().addOperation("translate", {
  //   Program(statements) {
  //     for (const statement of statements.children) {
  //       statement.translate();
  //     }
  //   },
  //   Stmt_emptyLine(_newline) {},
  //   Stmt_declaration(dec, _newline) {
  //     dec.translate();
  //   },
  //   Stmt_assignment(Assignment, _newline) {
  //     emit(`${Assignment.translate()};`);
  //   },
  //   // Stmt_call
  //   // Stmt_break
  //   // Stmt_return
  //   Stmt_print(_print, args, _newline) {
  //     emit(`console.log(${args.translate()});`);
  //   },
  //   // Stmt_if
  //   Stmt_while(_while, exp, block) {
  //     emit(`while (${exp.translate()}) {`);
  //     block.translate();
  //     emit(`}`);
  //   },
  //   Assignment(id, _eq, exp) {
  //     checkDeclared(id.sourceString, id);
  //     const value = exp.translate();
  //     const variable = id.translate();
  //     return `${variable} = ${value};`;
  //   },
  //   VarDec(type, id, _eq, exp) {
  //     checkNotDeclared(id.sourceString, id);
  //     const initializer = exp?.translate();
  //     const variable = {
  //       kind: "variable",
  //       name: id.sourceString,
  //       type: type.sourceString,
  //       mutable: true,
  //       toString() {
  //         return this.name;
  //       },
  //     };
  //     locals.set(id.sourceString, variable);
  //     emit(`let ${variable.name} = ${initializer};`);
  //   },
  //   FunDec(_fun, id, _open, params, _close, _outputs, _type, block) {
  //     emit(`function ${id.sourceString}(${params.translate()}) {`);
  //     block.translate();
  //     emit(`}`);
  //   },
  //   Params(params) {
  //     return params.asIteration().children.map((p) => p.translate());
  //   },
  //   Param(_type, id) {
  //     checkNotDeclared(id.sourceString, id);
  //     locals.set(id.sourceString, _type.sourceString);
  //     return id.sourceString;
  //   },
  //   Block(_open, statements, _close) {
  //     statements.translate();
  //   },
  //   Exp(args) {
  //     // one argument
  //     if (args.asIteration().children.length === 1) {
  //       return args.asIteration().children[0].translate();
  //     }
  //     // multiple arguments
  //     // args.asIteration().children.forEach((arg) => {
  //     //   checkType(arg.sourceString, "truth_value", arg);
  //     // });
  //     return args
  //       .asIteration()
  //       .children.map((arg) => arg.translate())
  //       .join(" || ");
  //   },
  //   Exp1(args) {
  //     return args
  //       .asIteration()
  //       .children.map((arg) => arg.translate())
  //       .join(" && ");
  //   },
  //   Exp2(args) {
  //     return args
  //       .asIteration()
  //       .children.map((arg) => arg.translate())
  //       .join(" ** ");
  //   },
  //   Exp3_binary(left, op, right) {
  //     const targetOp =
  //       {
  //         "=?": "===",
  //         "!=?": "!==",
  //         "<?": "<",
  //         "<=?": "<=",
  //         ">?": ">",
  //         ">=?": ">=",
  //       }?.[op.sourceString] ?? op.sourceString;
  //     return `${left.translate()} ${targetOp} ${right.translate()}`;
  //   },
  //   Exp4_binary(left, op, right) {
  //     const targetOp =
  //       { "+": "+", "-": "-" }[op.sourceString] || op.sourceString;
  //     return `${left.translate()} ${targetOp} ${right.translate()}`;
  //   },
  //   Exp4_unary(_neg, operand) {
  //     return `-${operand.translate()}`;
  //   },
  //   Exp5_binary(left, op, right) {
  //     const targetOp =
  //       { "*": "*", "/": "/", modulus: "%" }[op.sourceString] ||
  //       op.sourceString;
  //     return `${left.translate()} ${targetOp} ${right.translate()}`;
  //   },
  //   Exp6_parens(_open, exp, _close) {
  //     return `(${exp.translate()})`;
  //   },
  //   Exp6(args) {
  //     return args.translate();
  //   },
  //   Var_subscript(id, _open, exp, _close) {
  //     return `${id.sourceString}[${exp.translate()}]`;
  //   },
  //   Var_property(id, _dot, prop) {
  //     return `${id.sourceString}.${prop.sourceString}`;
  //   },
  //   NewList(_new, _list, _open, args, _close) {
  //     return `[${args.translate()}]`;
  //   },
  //   EmptyList(_new, _list, _open, _close) {
  //     return `new Array()`;
  //   },
  //   Call(id, _open, args, _close) {
  //     checkDeclared(id.sourceString, id);
  //     return `${id.sourceString}(${args.translate()});`;
  //   },
  //   Args(expressions) {
  //     return expressions.asIteration().children.map((arg) => arg.translate());
  //   },
  //   true(_) {
  //     return true;
  //   },
  //   false(_) {
  //     return false;
  //   },
  //   id(_first, _rest) {
  //     checkDeclared(this.sourceString, this);
  //     return locals.get(this.sourceString);
  //   },
  //   numberlit(_digits, _period, _decimals, _e, _unary, _exponent) {
  //     return Number(this.sourceString);
  //   },
  //   stringlit(_open, chars, _close) {
  //     return `${chars.sourceString}`;
  //   },
  //   newline(_) {
  //     return "";
  //   },
  //   _iter(...children) {
  //     return children.map((child) => child.translate());
  //   },
  // });

  // translator(match).translate();
  // return target;
}
