//Implementation of the lexer
//it is a state machine that reads the input and produces tokens
const chevrotain = require('chevrotain')
const DiyreactLexer = chevrotain.Lexer
const createToken = chevrotain.createToken

// the vocabulary will be exported and used in the Parser definition.
export const tokenVocabulary = {}

const CloseParenthesis = createToken({name: 'CloseParenthesis', pattern: /\)/})
const OpenParenthesis = createToken({name: 'OpenParenthesis', pattern: /\(/})

const OpenBracket = createToken({name: 'OpenBracket', pattern: /\{/})
const CloseBracket = createToken({name: 'CloseBracket', pattern: /}/})

const SemiColon = createToken({name: 'SemiColon', pattern: /;/, group: chevrotain.Lexer.SKIPPED})

const Comma = createToken({name: 'Comma', pattern: /,/})
const Point = createToken({name: 'Point', pattern: /\./})
const EqualSign = createToken({name: 'EqualSign', pattern: /=/})
const Asterisk = createToken({name: 'Asterisk', pattern: /\*/})
const Not = createToken({name: 'Not', pattern: /!/})

const Operator = createToken({name: 'Operator', pattern: /-|\+|\*|\//})

const New = createToken({name: 'New', pattern: /new/})
const VarDeclaration = createToken({name: 'VarDeclaration', pattern: /const|let|var/})
const Return = createToken({name: 'Return', pattern: /return/})
const Export = createToken({name: 'Export', pattern: /export/})
const Default = createToken({name: 'Default', pattern: /default/})
const Function = createToken({name: 'Function', pattern: /function/})
const From = createToken({name: 'From', pattern: /from/})
const Import = createToken({name: 'Import', pattern: /import/})
const Require = createToken({name: 'Require', pattern: /require/})
const As = createToken({name: 'As', pattern: /as/})

//identifier
const Identifier = createToken({name: 'Identifier', pattern: /[a-zA-Z][a-zA-Z0-9]*/})
const Literal = createToken({name: 'Literal', pattern: /null|true|false|\d+(\.[0-9]+)?/})
const StringLiteral = createToken({name: 'StringLiteral', pattern: /'.*'|".*"/})
const WhiteSpace = createToken({name: 'WhiteSpace', pattern: /\s+/, group: chevrotain.Lexer.SKIPPED})

//jsxtags
const OpenAngleBracket = createToken({name: 'OpenAngleBracket', pattern: /</})
const CloseAngleBracket = createToken({name: 'CloseAngleBracket', pattern: '>'})
const OpenEndAngleBracket = createToken({name: 'OpenEndAngleBracket', pattern: '</'})

//comments
const Comment = createToken({name: 'Comment', pattern: /\/\/.*/, group: chevrotain.Lexer.SKIPPED})

const MLComment = createToken({
    name: 'MLComment',
    pattern: /\/\*[^`]*\*\//,
    line_breaks: true,
    group: chevrotain.Lexer.SKIPPED
})

const allTokens = [
    Comment,
    MLComment,
    OpenParenthesis,
    CloseParenthesis,
    OpenBracket,
    CloseBracket,
    SemiColon,
    Comma,
    Point,
    EqualSign,
    Asterisk,
    As,
    Operator,
    Not,
    Default,
    New,
    VarDeclaration,
    Return,
    Function,
    From,
    Export,
    Import,
    Require,
    Identifier,
    Literal,
    StringLiteral,
    WhiteSpace,
    OpenEndAngleBracket,
    OpenAngleBracket,
    CloseAngleBracket
]

const DiyreactLexerInstance = new DiyreactLexer(allTokens, {positionTracking: 'onlyStart'})

allTokens.forEach((tokenType) => {
    tokenVocabulary[tokenType.name] = tokenType
})

export function tokenize(input) {
    const lexResult = DiyreactLexerInstance.tokenize(input)
    if (lexResult.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    return lexResult
}
