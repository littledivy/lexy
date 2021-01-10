import { alphabets26 } from "./predef.ts";

// Represents a lexical token
export interface Token {
  type: string;
  value: string | number;
}

// Lexer options
export interface Options {
  skip_whitspace?: boolean;
}

// Middleware handler for token identification
export type TokenHandler = (char: string) => Token;

export type Matcher = string | string[];

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
  // Keywords identified by lexer
  idents: string[] = [];

  constructor(source: string, options?: Options) {
    this.input = source;
    this.options = options || {};
    this.read_char();
  }

  use(match: Matcher, fn: TokenHandler) {
    if (Array.isArray(match)) {
      for (let i in match) {
        this._use(match[i], fn);
      }
    } else {
      this._use(match, fn);
    }
  }

  private _use(m: string, fn: TokenHandler) {
    this.handlers.set(m, fn);
  }

  register(...idents: string[]) {
    this.idents = [...this.idents, ...idents];
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
    while (tok = this.next()) {
      if (tok.type == "eof") break;
      tokens.push(tok);
    }
    return tokens;
  }

  next(): Token {
    // Skip whitespace (` ` & `\t`)
    if (this.options.skip_whitspace) this.skip_whitspace();
    let token: Token = { type: "unknown", value: this.ch };
    if (this.ch == 0) return { type: "eof", value: this.ch };
    let straightup = this.handlers.get(this.ch);
    if (straightup) {
      token = straightup.bind(this)(this.ch);
    } else {
      token = this.read_ident() || token;
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

  read_ident(): Token {
    let start_pos = this.pos;
    loop:
    for (;;) {
      if (alphabets26.includes(this.ch.toString())) {
        this.read_char();
      } else {
        break loop;
      }
    }

    let literal = this.input.substring(start_pos, this.pos);
    let token = { type: "unknown", value: literal };
    if (this.idents.includes(literal)) {
      token.type = "ident";
    }
    return token;
  }
}
