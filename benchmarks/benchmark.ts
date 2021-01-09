import Lexer, { Token } from "../mod.ts";
import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.83.0/testing/bench.ts";

// Modified regex from https://stackoverflow.com/questions/32468532/parsing-a-math-formula-using-regex
function lex_regexp(input: string): Token[] {
  return input
    .replace(/[\s]/g, "")
    .replace(/([-+*\/;])/g, " $1 ")
    .replace(/(\d+e) (([-|+]) )?(\d+)/g, "$1$3$4")
    .replace(/[()]/g, "")
    .split(/ /g)
    // Below logic is for token identification similar to lexy
    .map((i) => {
      let token: Token = { type: "unknown", value: i };
      if (numbers.includes(i)) {
        token.type = "number";
      } else if (operators.includes(i)) {
        token.type = "operator";
      }
      return token;
    });
}

const operators = ["+", "-", "*", "/"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

function createInput(): string {
  let str = "0";
  for (var i = 0; i < 100000; i++) {
    var op = operators[Math.floor(Math.random() * operators.length)];
    var number = numbers[Math.floor(Math.random() * numbers.length)];
    str += ` ${op} ${number}`;
  }
  return str;
}
const input = createInput();
console.log(input.length);

let lex = new Lexer(input, { skip_whitspace: true });

const parans = ["(", ")"];

lex.use(numbers, function (ch: string) {
  return { type: "number", value: ch };
});

lex.use(operators, function (ch: string) {
  return { type: "operator", value: ch };
});

lex.use(parans, function (ch: string) {
  return { type: "bracket", value: ch };
});
bench(function lexy_iter(b) {
  b.start();
  for (var i = 0; i < 1000; i++) lex.lex();
  b.stop();
});

bench(function regexp_iter(b) {
  b.start();
  for (var i = 0; i < 1000; i++) lex_regexp(input);
  b.stop();
});

runBenchmarks();

// iters: 1; inputlen: 400001; lexy: 0.4619420000001355ms; regexp:  196.24743899999999ms;
// iters: 10; inputlen: 400001; lexy:  0.5870310000000245ms; regexp: 1526.35242ms;
// iters: 100; inputlen: 400001; lexy: 0.6139200000000073ms; regexp: 14445.481962ms;
// iters: 1000; inputlen: 400001; lexy: 1.1585560000000896ms; regexp: 156252.44210000001ms;
