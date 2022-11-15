//Implementation of the lexer
//The lexer is a state machine that reads the input and produces tokens
const chevrotain = require('chevrotain')
const createToken = chevrotain.createToken

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {}

//All the tokens that can be produced by the lexer
const tokenVocubulary = {}
const Identifier = createToken({name: 'Identifier', pattern: /[a-zA-Z_]\w*/})
const NumberLiteral = createToken({name: 'NumberLiteral', pattern: /0|[1-9]\d*/})
const StringLiteral = createToken({name: 'StringLiteral', pattern: /"(?:[^"\\]|\\.)*"/})
const BooleanLiteral = createToken({name: 'BooleanLiteral', pattern: /true|false/})
const NullLiteral = createToken({name: 'NullLiteral', pattern: /null/})
const LeftBrace = createToken({name: 'LeftBrace', pattern: /{/})
const RightBrace = createToken({name: 'RightBrace', pattern: /}/})
const LeftBracket = createToken({name: 'LeftBracket', pattern: /\[/})
const RightBracket = createToken({name: 'RightBracket', pattern: /]/})
const Comma = createToken({name: 'Comma', pattern: /,/})
const Colon = createToken({name: 'Colon', pattern: /:/})
const WhiteSpace = createToken({name: 'WhiteSpace', pattern: /\s+/, group: Lexer.SKIPPED})
const Import = createToken({name: 'Import', pattern: /import/})
const From = createToken({name: 'From', pattern: /from/})
const Export = createToken({name: 'Export', pattern: /export/})
const Function = createToken({name: 'Function', pattern: /function/})
const Return = createToken({name: 'Return', pattern: /return/})
const If = createToken({name: 'If', pattern: /if/})
const Else = createToken({name: 'Else', pattern: /else/})
const For = createToken({name: 'For', pattern: /for/})
const While = createToken({name: 'While', pattern: /while/})
const Break = createToken({name: 'Break', pattern: /break/})
const Continue = createToken({name: 'Continue', pattern: /continue/})
const Var = createToken({name: 'Var', pattern: /var/})
const Let = createToken({name: 'Let', pattern: /let/})
const Const = createToken({name: 'Const', pattern: /const/})
const In = createToken({name: 'In', pattern: /in/})
const Of = createToken({name: 'Of', pattern: /of/})
const New = createToken({name: 'New', pattern: /new/})
const This = createToken({name: 'This', pattern: /this/})
const Class = createToken({name: 'Class', pattern: /class/})
const Extends = createToken({name: 'Extends', pattern: /extends/})
const Super = createToken({name: 'Super', pattern: /super/})
const Get = createToken({name: 'Get', pattern: /get/})

// The order of tokens is important, as the lexer uses first-match wins.
const allTokens = [
    WhiteSpace,
    NumberLiteral,
    StringLiteral,
    BooleanLiteral,
    NullLiteral,
    LeftBrace,
    RightBrace,
    LeftBracket,
    RightBracket,
    Comma,
    Colon,
    Import,
    From,
    Export,
    Function,
    Return,
    If,
    Else,
    For,
    While,
    Break,
    Continue,
    Var,
    Let,
    Const,
    In,
    Of,
    New,
    This,
    Class,
    Extends,
    Super,
    Get,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier
]

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
