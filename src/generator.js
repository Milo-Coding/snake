export default function generate(program) {
  const output = [];

  // Create separate maps for tracking variables and functions
  const variableMap = new Map();
  const functionMap = new Map();

  // Create a function to generate unique names based on the entity type
  const targetName = (entity) => {
    // Determine which map to use based on entity type
    const map = entity.kind === "funct" ? functionMap : variableMap;
    const key = entity.kind === "funct" ? entity.id : entity.name;

    if (!map.has(key)) {
      map.set(key, map.size + 1);
    }
    return `${key}_${map.get(key)}`;
  };

  const gen = (node) => {
    // Special handling for string literals
    if (typeof node === "string") {
      return `"${node}"`;
    }
    return generators?.[node?.kind]?.(node) ?? node;
  };

  const generators = {
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
      const { func, body } = d;
      output.push(
        `function ${targetName(func)}(${func.params.map(gen).join(", ")}) {`
      );
      gen(body);
      output.push("}");
    },
    variable(v) {
      return targetName(v);
    },
    printStatement(s) {
      output.push(`console.log(${s.args.map(gen).join(", ")});`);
    },
    ifStatement(s) {
      output.push(`if (${gen(s.test)}) {`);
      s.consequent.statements.forEach(gen);

      output.push("}");

      if (s.alternate) {
        output.push("else {");
        s.alternate.forEach(gen);
        output.push("}");
      }
    },
    whileStatement(s) {
      output.push(`while (${gen(s.test)}) {`);
      let body = s.body.statements;
      body.forEach(gen);

      output.push("}");
    },
    assignment(a) {
      return `${gen(a.source)} = ${gen(a.target)}`;
    },
    variableDeclaration(v) {
      if (v.initializer) {
        output.push(`let ${targetName(v.variable)} = ${gen(v.initializer)};`);
      } else {
        // Handle uninitialized variables
        const defaultVal = v.variable.type === "list" ? "[]" : "null";
        output.push(`let ${targetName(v.variable)} = ${defaultVal};`);
      }
    },
    block(b) {
      b.statements.forEach(gen);
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
      return `${gen(s.variable)}[${gen(s.subscript)}]`;
    },
    newList(l) {
      return `[${l.args.map(gen).join(", ")}]`;
    },
    call(c) {
      return `${targetName(c.callee)}(${c.args.map(gen).join(", ")})`;
    },
    newline() {
      return "";
    },
  };

  gen(program);
  return output.join("\n");
}
