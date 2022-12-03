//Implementation of the lexer
//The lexer is a state machine that reads the input and produces tokens
const chevrotain = require('chevrotain')
const createToken = chevrotain.createToken

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {}

//All the tokens that can be produced by the lexer
const tokenVocubulary = {}
const Identifier = createToken({name: 'Identifier', pattern: /[a-zA-Z_]\w*/})
const Export = createToken({name: 'Export', pattern: /export/})
const Default = createToken({name: 'Default', pattern: /default/})
const Function = createToken({name: 'Function', pattern: /function/})
const LeftBracket = createToken({name: 'LeftBracket', pattern: /\(/})
const RightBracket = createToken({name: 'RightBracket', pattern: /\)/})
const LeftBrace = createToken({name: 'LeftBrace', pattern: /\{/})
const RightBrace = createToken({name: 'RightBrace', pattern: /\}/})
const Return = createToken({name: 'Return', pattern: /return/})


// The order of tokens is important, as the lexer uses first-match wins.
const allTokens = [
    Identifier,
    Export,
    Default,
    Function,
    LeftBracket,
    RightBracket,
    LeftBrace,
    RightBrace,
    Return,
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
