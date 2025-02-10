// snake interpreter
import parse from "./parser.js";
import interpret from "./interpreter.js";
import * as fs from "fs";

if (process.argv.length !== 3) {
  console.error("Usage: node src/snake.js <source>");
  process.exit(1);
}

try {
  const source = fs.readFileSync(process.argv[2], "utf8");
  const match = parse(source);
  interpret(match);
} catch (error) {
  console.error(error);
  process.exit(1);
}
