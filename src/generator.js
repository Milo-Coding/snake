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
    assignmentStatement(s) {
      output.push(`${gen(s.assign)};`);
    },
    callStatement(s) {
      output.push(`${gen(s.call)};`);
    },
    breakStatement(b) {
      output.push("break;");
    },
    returnStatement(s) {
      output.push(`return ${gen(s.expression)};`);
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
    printStatement(s) {
      output.push(`console.log(${s.args.map(gen).join(", ")});`);
    },
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
    whileStatement(s) {
      output.push(`while (${gen(s.test)}) {`);
      s.body.forEach(gen);
      output.push("}");
    },
    assignment(a) {
      return `${gen(a.target)} = ${gen(a.source)}`;
    },
    variableDeclaration(v) {
      output.push(`let ${gen(v.variable)} = ${gen(v.initializer)};`);
    },
    functionDeclaration(f) {
      return `function ${gen(f.fun)}(${f.fun.params
        .map(gen)
        .join(", ")}) {${f.fun.body.map(gen)}}`;
    },
    block(b) {
      b.statements.forEach(gen);
    },
    binaryExpression(e) {
      const op =
        {
          "or": "||",
          "and": "&&",
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
    subscript(s) {
      return `${gen(s.array)}[${gen(s.index)}]`;
    },
    property(p) {
      return `${gen(p.object)}.${gen(p.property)}`;
    },
    newList(l) {
      return `[${l.elements.map(gen).join(", ")}]`;
    },
    emptyList(l) {
      return "[]";
    },
    call(c) {
      return `${gen(c.func)}(${c.args.map(gen).join(", ")})`;
    },
    funct(f) {
      return `${gen(f.name)}(${f.params.map(gen).join(", ")})`;
    },
  };

  gen(program);
  return output.join("\n");
}
