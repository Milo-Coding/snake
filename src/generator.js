export default function generate(program) {
  const output = [];

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
    program(p) {
      const statements = Array.isArray(p.statements) ? p.statements : [];
      statements.forEach(gen);
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
      const { func, body } = d;
      output.push(
        `function ${gen(func.id)}(${func.params.map(gen).join(", ")}) {`
      );
      gen(body);
      output.push("}");
    },
    variable(v) {
      return targetName(v);
    },
    funct(f) {
      return targetName(f);
    },
    printStatement(s) {
      const args = Array.isArray(s.args) ? s.args : [s.args];
      output.push(`console.log(${args.map(gen).join(", ")});`);
    },
    ifStatement(s) {
      output.push(`if (${gen(s.test)}) {`);

      const consequent = Array.isArray(s.consequent)
        ? s.consequent
        : [s.consequent];
      consequent.forEach(gen);

      output.push("}");

      if (s.alternate) {
        output.push("else {");
        const alternate = Array.isArray(s.alternate)
          ? s.alternate
          : [s.alternate];
        alternate.forEach(gen);
        output.push("}");
      }
    },
    whileStatement(s) {
      output.push(`while (${gen(s.test)}) {`);

      const body =
        s.body.kind === "block"
          ? s.body.statements
          : Array.isArray(s.body)
          ? s.body
          : [s.body];

      body.forEach(gen);

      output.push("}");
    },
    assignment(a) {
      return `${gen(a.target)} = ${gen(a.source)}`;
    },
    variableDeclaration(v) {
      output.push(`let ${gen(v.variable)} = ${gen(v.initializer)};`);
    },
    block(b) {
      const statements = Array.isArray(b.statements)
        ? b.statements
        : [b.statements];
      statements.forEach(gen);
    },
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
          modulus: "%",
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
      return `${gen(c.callee.id)}(${c.args.map(gen).join(", ")})`;
    },
    funct(f) {
      return `${gen(f.name)}(${f.params.map(gen).join(", ")})`;
    },
    newline() {
      return "";
    },
  };

  gen(program);
  return output.join("\n");
}
