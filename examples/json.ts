import Lexy from "../mod.ts";

const source = `{ "key": "value", "number": 123, "nested": { "key": [1,2,3] } }`

const digit = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

let lexer = new Lexy(source, { skip_whitspace: true });

lexer.use(["{", "}"], (c) => {
    return { type: "parenthesis", value: c }
})

lexer.use(["[", "]"], (c) => {
    return { type: "brackets", value: c }
})

lexer.use('"', (c) => {
    return { type: "quote", value: c }
})

lexer.use(':', (c) => {
    return { type: "colon", value: c }
})

lexer.use(digit, function (c) {
    return { type: "digit", value: c }
});

lexer.use(',', (c) => {
    return { type: "comma", value: c }
})

const tokens = lexer.lex();
console.log(tokens)