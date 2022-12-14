//Implementation of the lexer
//it is a state machine that reads the input and produces tokens
const chevrotain = require('chevrotain')
const createToken = chevrotain.createToken
const DiyreactLexer = chevrotain.Lexer


//comment
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

//symbols
const OpenParem = createToken({ name: 'OpenParem', pattern: /\(/ })
const CloseParem = createToken({ name: 'CloseParem', pattern: ')' })
const LeftCurly = createToken({ name: 'LeftCurly', pattern: /{/ })
const RightCurly = createToken({ name: 'RightCurly', pattern: '}' })
const SemiColon = createToken({
    name: 'SemiColon',
    pattern: /;/,
    group: chevrotain.Lexer.SKIPPED
})
const Comma = createToken({ name: 'Comma', pattern: /,/ })
const Point = createToken({ name: 'Point', pattern: /\./ })
const EqualSign = createToken({ name: 'EqualSign', pattern: /=/ })
const Operator = createToken({ name: 'Operator', pattern: /-|\+|\*|\// })
const Not = createToken({ name: 'Not', pattern: /!/ })
const Asteric = createToken({ name: 'Asteric', pattern: /\*/ })

//keywords
const New = createToken({ name: 'New', pattern: /new/ })
const VariableKey = createToken({
    name: 'VariableKey',
    pattern: /const|let|var/
})
const Return = createToken({ name: 'Return', pattern: /return/ })
const Function = createToken({ name: 'Function', pattern: /function/ })
const From = createToken({ name: 'From', pattern: /from/ })
const Export = createToken({ name: 'Export', pattern: /export/ })
const Default = createToken({ name: 'Default', pattern: /default/ })
const Import = createToken({ name: 'Import', pattern: /import/ })
const Require = createToken({ name: 'Require', pattern: /require/ })
const As = createToken({ name: 'As', pattern: /as/ })

//identifier
const Identifier = createToken({
    name: 'Identifier',
    pattern: /[a-zA-Z][a-zA-Z0-9]*/
})

//literal
const Literal = createToken({
    name: 'Literal',
    pattern: /null|true|false|\d+(\.[0-9]+)?/
})

const StringLiteral = createToken({
    name: 'StringLiteral',
    pattern: /'.*'|".*"/
})

const MultiLineStringLiteral = createToken({
    name: 'MultiLineStringLiteral',
    pattern: /`[^`]*`/,
    line_breaks: true
})

const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: chevrotain.Lexer.SKIPPED
})

//jsxtags
const OpenTag = createToken({ name: 'OpeningForTag', pattern: /</ })
const CloseTag = createToken({ name: 'CloseForTag', pattern: '>' })
const CloseSimpleTag = createToken({ name: 'CloseSimpleTag', pattern: '/>' })
const OpeningForSecondTag = createToken({
    name: 'OpeningForSecondTag',
    pattern: '</'
})

const allTokens = [
    SingleLineComment,
    MultiLineComment,
    OpenParem,
    CloseParem,
    LeftCurly,
    RightCurly,
    SemiColon,
    Comma,
    Point,
    EqualSign,
    Asteric,
    As,
    CloseSimpleTag,
    OpeningForSecondTag,
    Operator,
    Not,
    Default,
    New,
    VariableKey,
    Return,
    Function,
    From,
    Export,
    Import,
    Require,
    Identifier,
    Literal,
    StringLiteral,
    MultiLineStringLiteral,
    WhiteSpace,
    OpenTag,
    CloseTag
]

const DiyreactLexerInstance = new DiyreactLexer(allTokens, { positionTracking: 'onlyStart' })

export const diyreactVocabulary = allTokens
export function tokenize(input) {
    const lexResult = DiyreactLexerInstance.tokenize(input)
    if (lexResult.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    return lexResult
}
