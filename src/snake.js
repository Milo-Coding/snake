// snake interpreter
import parse from "./parser.js";
import interpret from "./interpreter.js";

if (process.argv.length !== 3) {
  console.error("Usage: node src/snake.js <source>");
  process.exit(1);
}

try {
  // Syntax
  const match = parse(process.argv[2]);
  // Semantics
  interpret(match);
} catch (error) {
  console.error(error);
  process.exit(1);
}
