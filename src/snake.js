// snake compiler
import * as fs from "fs";
import parse from "./parser.js";
import analyze from "./analyzer.js";
import translate from "./translator.js";

if (process.argv.length !== 3) {
  console.error("Usage: node src/snake.js <source>");
  process.exit(1);
}

try {
  const source = fs.readFileSync(process.argv[2], "utf8");
  const match = parse(source);
  // const program = analyze(match);
  // const target = translate(program);
  const target = translate(match);
  console.log(target.join("\n"));
} catch (error) {
  console.error(`${error}`);
  process.exit(1);
}
