<p align="center">

  <img src="logo.png" />
  
  <p align="center"> Lightweight, fast and non-regex based tokeniser for Deno. </p>

</p>

### `features`

* Fast compared to regex based lexers.
* Clever ident lookup.
* Works on Deno, Node and the browser.

### `usage`

```typescript
let lexer = new Lexer("1 + 1 - 1");
lexer.use("1", (ch) => { 
  return { type: "one", value: ch };
});

lexer.use(["+", "-"], (ch) => { 
  return { type: "operator", value: ch };
});

const tokens = lexer.lex();
```

### `why`

Lexical analysis is a common step towards building great parsers & analysers. Many libraries use regex for building lexers although that can impact performance in the long run. 

In real programming languages, lexers are generally hand-written instead of regex. One of the main reason is performance. 

[This article](https://eli.thegreenplace.net/2013/07/16/hand-written-lexer-in-javascript-compared-to-the-regex-based-ones) compares hand-written lexers to regex based. 
![](https://eli.thegreenplace.net/images/2013/07/lexer_runtime_vs_handwritten.png)

Complex regex can lead to abnormalities in the lexer (eg: [catastrophic backtracking](http://www.regular-expressions.info/catastrophic.html)

### `license`

MIT License
