//Implementation of the lexer
//it is a state machine that reads the input and produces tokens
const chevrotain = require('chevrotain')
const createToken = chevrotain.createToken
const DiyreactLexer = chevrotain.Lexer

const tokenVocabulary = {};

//All the tokens that can be produced by the lexer
const SingleLineComment = createToken({
    name: 'SingleLineComment',
    pattern: /\/\/.*/,
    group: chevrotain.Lexer.SKIPPED
})
const MultiLineComment = createToken({
    name: 'MultiLineComment',
    pattern: /\/\*[^`]*\*\//,
    line_breaks: true,
    group: chevrotain.Lexer.SKIPPED
})

const Comma = createToken({name: 'Comma', pattern: ','})
const OpenParen = createToken({name: 'OpenParen', pattern: '('})
const CloseParen = createToken({name: 'CloseParen', pattern: ')'})
const LeftCurly = createToken({name: 'LeftCurly', pattern: '{'})
const RightCurly = createToken({name: 'RightCurly', pattern: '}'})
const SemiColon = createToken({name: 'SemiColon', pattern: ';', group: chevrotain.Lexer.SKIPPED})
const Point = createToken({name: 'Point', pattern: '.'})
const Equal = createToken({name: 'Equal', pattern: '='})
const Operator = createToken({name: 'Operator', pattern: /[\+\-\*\/]/})
const Not = createToken({name: 'Not', pattern: '!'})
const And = createToken({name: 'And', pattern: '&&'})
const Or = createToken({name: 'Or', pattern: '||'})
const Asterisk = createToken({name: 'Asterisk', pattern: '*'})

const New = createToken({name: 'New', pattern: 'new'})
const Const = createToken({name: 'Const', pattern: 'const'})
const Let = createToken({name: 'Let', pattern: 'let'})
const Var = createToken({name: 'Var', pattern: 'var'})
const Return = createToken({name: 'Return', pattern: 'return'})
const Function = createToken({name: 'Function', pattern: 'function'})
const From = createToken({name: 'From', pattern: 'from'})
const Import = createToken({name: 'Import', pattern: 'import'})
const Require = createToken({name: 'Require', pattern: 'require'})
const As = createToken({name: 'As', pattern: 'as'})
const Export = createToken({name: 'Export', pattern: 'export'})
const Default = createToken({name: 'Default', pattern: 'default'})

const OpenTag = createToken({name: 'OpenTag', pattern: '<'})
const CloseTag = createToken({name: 'CloseTag', pattern: '>'})
const OpenTagSlash = createToken({name: 'OpenTagSlash', pattern: '</'})
const CloseTagSlash = createToken({name: 'CloseTagSlash', pattern: '/>'})



const Identifier = createToken({
    name: 'Identifier',
    pattern: /[a-zA-Z][a-zA-Z0-9_]*/
})

const StringLiteral = createToken({
    name: 'StringLiteral',
    pattern: /"(?:[^\\"]|\\.)*"/
})

const Whitespace = createToken({
    name: 'Whitespace',
    pattern: /\s+/,
    group: chevrotain.Lexer.SKIPPED
})


// The order of tokens is important, as the lexer uses first-match wins.
export const allTokens = [
    SingleLineComment,
    MultiLineComment,
    Comma,
    OpenParen,
    CloseParen,
    LeftCurly,
    RightCurly,
    SemiColon,
    Point,
    Equal,
    Operator,
    Not,
    And,
    Or,
    Asterisk,
    New,
    Const,
    Let,
    Var,
    Return,
    Function,
    From,
    Import,
    Require,
    As,
    Export,
    Default,
    OpenTag,
    CloseTag,
    OpenTagSlash,
    CloseTagSlash,
    Whitespace,
    Identifier,
    StringLiteral
]
const DiyreactLexerInstance = new DiyreactLexer(allTokens, { positionTracking: 'onlyStart' })
allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
})

export const diyreactVocabulary = tokenVocabulary
export function tokenize(input) {
    const lexResult = DiyreactLexerInstance.tokenize(input)
    if (lexResult.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    return lexResult
}
