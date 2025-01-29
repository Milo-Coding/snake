import * as fs from 'fs';
import * as ohm from 'ohm-js';

console.log('Hello World!');

// read the contents of the file snake.ohm into a string
const grammar = ohm.grammar(fs.readFileSync('src/snake.ohm', 'utf8'));

const sourceCode = process.argv[2];
const match = grammar.match(sourceCode);

if (match.succeeded()) {
  console.log('The source code is syntactically correct!');
  interpret(match);
} else {
  console.error('The source code is syntactically incorrect!');
  console.error(match.message);
}
