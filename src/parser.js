import * as fs from "fs";
import * as ohm from "ohm-js";

const grammar = ohm.grammar(fs.readFileSync("src/snake.ohm", "utf8"));

export default function parse(source) {
  const sourceCode = fs.readFileSync(source, "utf8");

  const match = grammar.match(sourceCode);

  if (match.succeeded()) {
    return match;
  } else {
    throw new Error(match.message);
  }
}
