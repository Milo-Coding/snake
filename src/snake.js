// snake compiler
import parse from "./parser.js";
import * as fs from "fs";
import translate from "./translator.js";

if (process.argv.length !== 3) {
  console.error("Usage: node src/snake.js <source>");
  process.exit(1);
}

try {
  const source = fs.readFileSync(process.argv[2], "utf8");
  const match = parse(source);
  translate(match);
} catch (error) {
  console.error(`${error}`);
  process.exit(1);
}
