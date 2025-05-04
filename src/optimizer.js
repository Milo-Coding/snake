import * as core from "./core.js";

export default function optimize(node) {
  return optimizers?.[node?.kind]?.(node) ?? node;
}

const isZero = (n) => n === 0;
const isOne = (n) => n === 1;

const optimizers = {
  program(p) {
    p.statements = p.statements.flatMap(optimize);
    return p;
  },

  variableDeclaration(d) {
    d.variable = optimize(d.variable);
    if (d.initializer) {
      d.initializer = optimize(d.initializer);
    }
    return d;
  },

  functionDeclaration(d) {
    d.func = optimize(d.func);
    d.body = optimize(d.body);
    return d;
  },

  funct(f) {
    f.params = f.params.map(optimize);
    return f;
  },

  assignment(a) {
    a.source = optimize(a.source);
    a.target = optimize(a.target);
    // Eliminate self-assignments (x = x)
    if (
      a.source === a.target ||
      (a.source.name && a.target.name && a.source.name === a.target.name)
    ) {
      return [];
    }
    return a;
  },

  assignmentStatement(s) {
    const optimizedAssign = optimize(s.assign);
    // If the assignment was optimized away to an empty array, return an empty array
    if (Array.isArray(optimizedAssign) && optimizedAssign.length === 0) {
      return [];
    }
    s.assign = optimizedAssign;
    return s;
  },

  breakStatement(s) {
    return s;
  },

  returnStatement(s) {
    if (s.expression) {
      s.expression = optimize(s.expression);
    }
    return s;
  },

  printStatement(s) {
    s.args = s.args.map(optimize);
    return s;
  },

  ifStatement(s) {
    s.test = optimize(s.test);
    s.consequent = optimize(s.consequent);

    if (s.alternate) {
      s.alternate = optimize(s.alternate);
    }

    // If test is a boolean constant, replace with the appropriate branch
    if (typeof s.test === "boolean") {
      return s.test ? s.consequent : s.alternate || [];
    }

    return s;
  },

  whileStatement(s) {
    s.test = optimize(s.test);

    // while false is a no-op
    if (s.test === false) {
      return [];
    }

    s.body = optimize(s.body);
    return s;
  },

  block(b) {
    b.statements = b.statements.flatMap(optimize);
    return b;
  },

  binaryExpression(e) {
    e.left = optimize(e.left);
    e.right = optimize(e.right);

    // Constant folding for boolean operations
    if (e.op === "||") {
      if (e.left === true) return true;
      if (e.left === false) return e.right;
      if (e.right === true) return true;
      if (e.right === false) return e.left;
    } else if (e.op === "&&") {
      if (e.left === false) return false;
      if (e.left === true) return e.right;
      if (e.right === true) return e.left;
      if (e.right === false) return false;
    }

    // Numeric constant folding
    if (typeof e.left === "number" && typeof e.right === "number") {
      if (e.op === "+") return e.left + e.right;
      if (e.op === "-") return e.left - e.right;
      if (e.op === "*") return e.left * e.right;
      if (e.op === "/") return e.left / e.right;
      if (e.op === "**" || e.op === "^") return e.left ** e.right;
      if (e.op === "modulus") return e.left % e.right;

      // Comparisons
      if (e.op === "=?") return e.left === e.right;
      if (e.op === "!=?") return e.left !== e.right;
      if (e.op === "<?") return e.left < e.right;
      if (e.op === "<=?") return e.left <= e.right;
      if (e.op === ">?") return e.left > e.right;
      if (e.op === ">=?") return e.left >= e.right;
    }

    // Strength reductions
    if (isZero(e.left) && e.op === "+") return e.right;
    if (isZero(e.right) && ["+", "-"].includes(e.op)) return e.left;
    if (isOne(e.left) && e.op === "*") return e.right;
    if (isOne(e.right) && ["*", "/"].includes(e.op)) return e.left;
    if (isZero(e.right) && e.op === "*") return 0;
    if (isZero(e.left) && ["*"].includes(e.op)) return 0;
    if (isZero(e.right) && e.op === "^") return 1;
    if (isOne(e.right) && e.op === "^") return e.left;

    return e;
  },

  unaryExpression(e) {
    e.operand = optimize(e.operand);

    // Constant folding for unary operations
    if (typeof e.operand === "number") {
      if (e.op === "-") return -e.operand;
    }

    return e;
  },

  subscript(s) {
    s.variable = optimize(s.variable);
    s.subscript = optimize(s.subscript);
    return s;
  },

  newList(l) {
    l.args = l.args.map(optimize);
    return l;
  },

  call(c) {
    c.callee = optimize(c.callee);
    c.args = c.args.map(optimize);
    return c;
  },

  callStatement(s) {
    s.call = optimize(s.call);
    return s;
  },

  variable(v) {
    return v;
  },
};
