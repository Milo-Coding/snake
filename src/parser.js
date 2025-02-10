import * as fs from "fs";
import * as ohm from "ohm-js";

const grammar = ohm.grammar(fs.readFileSync("src/snake.ohm", "utf8"));

export default function parse(source) {
  const match = grammar.match(source);

  if (match.failed()) {
    throw match.message;
  }
  return match;
}
