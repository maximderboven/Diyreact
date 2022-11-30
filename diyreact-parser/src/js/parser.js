//Implementation of the parser
//The parser is a state machine that reads the tokens produced by the lexer and produces an AST
import * as L from './lexer'

const CstParser = require('chevrotain').CstParser
//All the tokens that can be produced by the lexer


//The parser definition
class DiyreactParser extends CstParser {
    constructor() {
        super(L.tokenVocabulary, {recoveryEnabled: true})
        const $ = this

        //RULES
        $.RULE('import', () => {
            $.CONSUME(L.Import)
            $.CONSUME(L.Identifier)
            $.CONSUME(L.From)
            $.CONSUME(L.StringLiteral)
        })


        // very important to call this after all the rules have been setup.
        // otherwise the parser may not work correctly as it will lack information
        // derived from the self analysis.
        this.performSelfAnalysis()
    }
}


// We only ever need one as the parser internal state is reset for each new input.
const diyreactParserInstance = new DiyreactParser()

module.exports = {
    parserInstance: diyreactParserInstance,

    DiyreactParser: DiyreactParser,

    parse: function (inputText) {
        const lexResult = diyreactLexer.lex(inputText)

        // ".input" is a setter which will reset the parser's internal's state.
        diyreactParserInstance.input = lexResult.tokens

        // No semantic actions so this won't return anything yet.
        //diyreactParserInstance.selectStatement()

        if (diyreactParserInstance.errors.length > 0) {
            throw Error(
                'Sad, parsing errors detected!\n' +
                diyreactParserInstance.errors[0].message
            )
        }
    }
}
