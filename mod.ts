
interface Token {
  type: string;
  value: string | number;
}

interface Options {
  skip_whitspace?: boolean;
}

type TokenHandler = (char: string) => Token ;

export default class Lexer {
  input: string;
  // Current position of the lexer
  pos: number = 0;
  // Next position of the lexer
  next_pos: number = 0;
  // Current character being analysed
  ch: string | 0 = 0;
  // Behaviour options
  options: Options = {};
  // Middleware token handlers
  handlers: Map<string, TokenHandler> = new Map();
  // Tokens 
  tokens: Token[] = [];

  constructor(source: string, options?: Options) {
    this.input = source;
    this.options = options || {}
    this.read_char();
  }
  
  use(match: string, fn: TokenHandler) {
    this.handlers.set(match, fn);
  }

  read_char() {
    if (this.next_pos >= this.input.length) {
      this.ch = 0;
    } else {
      this.ch = this.input[this.next_pos];
    }
    this.pos = this.next_pos;
    this.next_pos += 1;
  }

  nextch(): string | 0 {
    if (this.next_pos >= this.input.length) {
      return 0;
    } else {
      return this.input[this.next_pos];
    }
  }

  nextch_is(ch: string): boolean {
    return this.nextch() == ch;
  }

  lex(): Token[] {
    let tokens: Token[] = [];
    let tok: Token;
    while(tok = this.next()) {
      if(tok.type == "eof") break;
      tokens.push(tok)
    }
    return tokens
  }

  next(): Token {
    // Skip whitespace (` ` & `\t`)
    if(this.options.skip_whitspace) this.skip_whitspace();
    let token: Token = { type: "unknown", value: this.ch };
    if(this.ch == 0) return { type: "eof", value: this.ch };
    let straightup = this.handlers.get(this.ch);
    if(straightup) {
      token = straightup.bind(this)(this.ch);
    }
    this.read_char();
    return token;
  }

  skip_whitspace() {
    loop:
    for (;;) {
      switch (this.ch) {
        case " ":
        case "\t":
          this.read_char();
          break;
        default:
          break loop;
      }
    }
  }

}

let lex = new Lexer("1 + 1 / 2", { skip_whitspace: true });

lex.use("1", function(ch: string) {
  return { type: "number", value: ch }
})

lex.use("+", function(ch: string) {
  return { type: "operator", value: ch }
})

console.log(lex.lex())