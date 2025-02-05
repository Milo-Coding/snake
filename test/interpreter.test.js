import {describe, it} from "node:test"
import { deepEqual } from "node:assert/strict"
import { parse } from "../src/snake.js"

describe("Interpreter", () => {
    it("it parses", () => {
        deepEqual(parse(), "I do not work yet");
    });
});