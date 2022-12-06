//Implementation of the lexer
//The lexer is a state machine that reads the input and produces tokens
const chevrotain = require('chevrotain')
const createToken = chevrotain.createToken

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {}

//All the tokens that can be produced by the lexer
const Identifier = createToken({
    name: "Identifier",
    pattern: /[a-zA-Z][a-zA-Z0-9_]*/
});

const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"(?:[^\\"]|\\.)*"/
});

const Whitespace = createToken({
    name: "Whitespace",
    pattern: /\s+/,
    group: chevrotain.Lexer.SKIPPED
});

const SemiColon = createToken({ name: "SemiColon", pattern: ";" });
const LeftCurly = createToken({ name: "LeftCurly", pattern: "{" });
const RightCurly = createToken({ name: "RightCurly", pattern: "}" });

const Export = createToken({ name: "Export", pattern: "export" });
const Default = createToken({ name: "Default", pattern: "default" });
const Function = createToken({ name: "Function", pattern: "function" });
const Const = createToken({ name: "Const", pattern: "const" });
const Let = createToken({ name: "Let", pattern: "let" });
const Var = createToken({ name: "Var", pattern: "var" });
const Return = createToken({ name: "Return", pattern: "return" });

const Equal = createToken({ name: "Equal", pattern: "=" });
const Plus = createToken({ name: "Plus", pattern: "+" });

const OpenParen = createToken({ name: "OpenParen", pattern: "(" });
const CloseParen = createToken({ name: "CloseParen", pattern: ")" });

const OpenBracket = createToken({ name: "OpenBracket", pattern: /</ });
const CloseBracket = createToken({ name: "CloseBracket", pattern: />/ });

const Comma = createToken({ name: "Comma", pattern: "," });



// The order of tokens is important, as the lexer uses first-match wins.
const allTokens = [
    SemiColon,
    LeftCurly,
    RightCurly,
    Export,
    Default,
    Equal,
    Plus,
    OpenParen,
    CloseParen,
    Comma,
    OpenBracket,
    CloseBracket,
    Function,
    Const,
    Let,
    Var,
    Return,
    Whitespace,
    StringLiteral,
    Identifier
];

//The lexer itself
const diyreactLexer = new chevrotain.Lexer(allTokens)

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lex: function (inputText) {
        const lexingResult = diyreactLexer.tokenize(inputText)

        if (lexingResult.errors.length > 0) {
            throw Error('Sad.. lexing errors detected')
        }

        return lexingResult
    }
}
