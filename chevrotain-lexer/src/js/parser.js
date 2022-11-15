//Implementation of the parser
//The parser is a state machine that reads the tokens produced by the lexer and produces an AST
const diyreactLexer = require('./lexer')
const CstParser  = require('chevrotain').CstParser
const tokenVocabulary = diyreactLexer.tokenVocabulary

//All the tokens that can be produced by the lexer


//The parser definition
class DiyreactParser extends CstParser {
    constructor() {
        super(tokenVocabulary)
        const $ = this
    }
    //The parser's rules
    public importStatement = this.RULE('importStatement', () => {
        this.CONSUME(Import)
        this.CONSUME(Identifier)
        this.CONSUME(From)
        this.CONSUME(StringLiteral)
    })
    public exportStatement = this.RULE('exportStatement', () => {
        this.CONSUME(Export)
        this.CONSUME(Identifier)
    } )
    public functionStatement = this.RULE('functionStatement', () => {
        this.CONSUME(Function)
        this.CONSUME(Identifier)
        this.CONSUME(LeftBrace)
        this.CONSUME(RightBrace)
    })
    public returnStatement = this.RULE('returnStatement', () => {
        this.CONSUME(Return)
        this.CONSUME(Identifier)
    })
    public ifStatement = this.RULE('ifStatement', () => {
        this.CONSUME(If)
        this.CONSUME(LeftBrace)
        this.CONSUME(RightBrace)
    })
    public elseStatement = this.RULE('elseStatement', () => {
        this.CONSUME(Else)
        this.CONSUME(LeftBrace)
        this.CONSUME(RightBrace)
    })
    public forStatement = this.RULE('forStatement', () => {
        this.CONSUME(For)
        this.CONSUME(LeftBrace)
        this.CONSUME(RightBrace)
    })
    public whileStatement = this.RULE('whileStatement', () => {
        this.CONSUME(While)
        this.CONSUME(LeftBrace)
        this.CONSUME(RightBrace)
    })
    public breakStatement = this.RULE('breakStatement', () => {
        this.CONSUME(Break)
    })
    public continueStatement = this.RULE('continueStatement', () => {
        this.CONSUME(Continue)
    })
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
                "Sad, parsing errors detected!\n" +
                diyreactParserInstance.errors[0].message
            )
        }
    }
}
