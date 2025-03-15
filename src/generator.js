// The code generator exports a single function, generate(program), which
// accepts a program representation and returns the JavaScript translation
// as a string.

export default function generate(program) {
  // When generating code for statements, we'll accumulate the lines of
  // the target code here. When we finish generating, we'll join the lines
  // with newlines and return the result.
  const output = [];

  // Variable and function names in JS will be suffixed with _1, _2, _3,
  // etc. This is because "switch", for example, is a legal name in snake,
  // but not in JS. So, the snake variable "switch" must become something
  // like "switch_1". We handle this by mapping each name to its suffix.
  const targetName = ((mapping) => {
    return (entity) => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1);
      }
      return `${entity.name}_${mapping.get(entity)}`;
    };
  })(new Map());

  const gen = (node) => generators?.[node?.kind]?.(node) ?? node;

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    program(p) {
      p.statements.forEach(gen);
    },
    variableDeclaration(d) {
      // We don't care about const vs. let in the generated code! The analyzer has
      // already checked that we never updated a const, so let is always fine.
      output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`);
    },
    functionDeclaration(d) {
      output.push(
        `function ${gen(d.fun)}(${d.fun.params.map(gen).join(", ")}) {`
      );
      d.fun.body.forEach(gen);
      output.push("}");
    },
    variable(v) {
      return targetName(v);
    },
    funct(f) {
      return targetName(f);
    },
    assignmentStatement(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`);
    },
    breakStatement(s) {
      output.push("break;");
    },
    // returnStatement(s) {
    //   output.push(`return ${gen(s.expression)};`)
    // },
    // shortReturnStatement(s) {
    //   output.push("return;")
    // },
    // ifStatement(s) {
    //   output.push(`if (${gen(s.test)}) {`)
    //   s.consequent.forEach(gen)
    //   if (s.alternate?.kind?.endsWith?.("IfStatement")) {
    //     output.push("} else")
    //     gen(s.alternate)
    //   } else {
    //     output.push("} else {")
    //     s.alternate.forEach(gen)
    //     output.push("}")
    //   }
    // },
    // shortIfStatement(s) {
    //   output.push(`if (${gen(s.test)}) {`)
    //   s.consequent.forEach(gen)
    //   output.push("}")
    // },
    whileStatement(s) {
      output.push(`while (${gen(s.test)}) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    // repeatStatement(s) {
    //   // JS can only repeat n times if you give it a counter variable!
    //   const i = targetName({ name: "i" })
    //   output.push(`for (let ${i} = 0; ${i} < ${gen(s.count)}; ${i}++) {`)
    //   s.body.forEach(gen)
    //   output.push("}")
    // },
    // ForRangeStatement(s) {
    //   const i = targetName(s.iterator)
    //   const op = s.op === "..." ? "<=" : "<"
    //   output.push(`for (let ${i} = ${gen(s.low)}; ${i} ${op} ${gen(s.high)}; ${i}++) {`)
    //   s.body.forEach(gen)
    //   output.push("}")
    // },
    // ForStatement(s) {
    //   output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`)
    //   s.body.forEach(gen)
    //   output.push("}")
    // },
    // Conditional(e) {
    //   return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(e.alternate)}))`
    // },
    binaryExpression(e) {
      const op =
        {
          or: "||",
          and: "&&",
          "=?": "===",
          "!=?": "!==",
          "<=?": "<=",
          "<?": "<",
          ">=?": ">=",
          ">?": ">",
        }[e.op] ?? e.op;
      return `(${gen(e.left)} ${op} ${gen(e.right)})`;
    },
    unaryExpression(e) {
      const operand = gen(e.operand);
      return `${e.op}(${operand})`;
    },
    // SubscriptExpression(e) {
    //   return `${gen(e.array)}[${gen(e.index)}]`
    // },
    // ArrayExpression(e) {
    //   return `[${e.elements.map(gen).join(",")}]`
    // },
    // EmptyArray(e) {
    //   return "[]"
    // },
    // FunctionCall(c) {
    //   const targetCode = `${gen(c.callee)}(${c.args.map(gen).join(", ")})`
    //   // Calls in expressions vs in statements are handled differently
    //   if (c.callee.type.returnType !== voidType) {
    //     return targetCode
    //   }
    //   output.push(`${targetCode};`)
    // },
    printStatement(s) {
      output.push(`console.log(${s.args.map(gen).join(", ")});`);
    },
  };

  gen(program);
  return output.join("\n");
}
