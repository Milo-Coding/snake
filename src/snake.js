import * as fs from "fs";
import * as ohm from "ohm-js";
import parse from "./parser.js";
import interpret from "./interpreter.js";

// read the contents of the file snake.ohm into a string
const grammar = ohm.grammar(fs.readFileSync("src/snake.ohm", "utf8"));

if (process.argv.length !== 3) {
  console.error("Usage: node src/snake.js <source>");
  process.exit(1);
}

try {
  const match = parse(process.argv[2]);
  interpret(match);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
