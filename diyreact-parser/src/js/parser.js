//Implementation of the parser
// is a state machine that reads the tokens produced by the lexer and produces an AST
import * as L from './lexer'
const CstParser = require('chevrotain').CstParser

//The parser definition
export default class DiyreactParser extends CstParser {
    constructor() {
        super(L.allTokens, {recoveryEnabled: true, outputCst: true})
        const $ = this

        //The parser definition using the imported tokens
        // program exists out of multiple statements (declaration, export or functions)
        $.RULE('program', () => {
            $.MANY(() => {
                $.OR([
                    {ALT: () => $.SUBRULE($.declaration)},
                    {ALT: () => $.SUBRULE($.export)},
                    {ALT: () => $.SUBRULE($.function)}
                ])
            })
        })

        // declaration can be a const, let or var
        $.RULE('declaration', () => {
            $.OR([
                {ALT: () => $.SUBRULE($.const)},
                {ALT: () => $.SUBRULE($.let)},
                {ALT: () => $.SUBRULE($.var)}
            ])
        })
        // const declaration
        $.RULE('const', () => {
            $.CONSUME(L.Const)
            $.CONSUME(L.Identifier)
            $.CONSUME(L.Equal)
            $.SUBRULE($.expression)
            $.CONSUME(L.SemiColon)
        } )
        // let declaration
        $.RULE('let', () => {
            $.CONSUME(L.Let)
            $.CONSUME(L.Identifier)
            $.CONSUME(L.Equal)
            $.SUBRULE($.expression)
            $.CONSUME(L.SemiColon)
        } )
        // var declaration
        $.RULE('var', () => {
            $.CONSUME(L.Var)
            $.CONSUME(L.Identifier)
            $.CONSUME(L.Equal)
            $.SUBRULE($.expression)
            $.CONSUME(L.SemiColon)
        } )

        // an expression is either a function call or a string
        $.RULE('expression', () => {
            $.OR([
                {ALT: () => $.SUBRULE($.functionCall)},
                {ALT: () => $.CONSUME(L.StringLiteral)}
            ])
        })
        // a function call has the form "identifier([<expression>, ...])"
        $.RULE('functionCall', () => {
            $.CONSUME(L.Identifier)
            $.MANY_SEP({
                SEP: L.Comma,
                DEF: () => $.SUBRULE($.expression)
            })
            $.CONSUME(L.CloseParen)
            $.CONSUME(L.CloseBracket)
        })

        // an export declaration has the form "export <declaration>"
        $.RULE('export', () => {
            $.CONSUME(L.Export)
            $.SUBRULE($.declaration)
        })

        // a function declaration has the form "function <identifier>([<identifier>, ...]) { <statements> }"
        $.RULE('function', () => {
            $.CONSUME(L.Function)
            $.CONSUME(L.Identifier)
            $.MANY_SEP({
                SEP: L.Comma,
                DEF: () => $.CONSUME(L.Identifier)
            })
            $.CONSUME(L.CloseParen)
            $.CONSUME(L.OpenBrace)
            $.MANY(() => {
                $.OR([
                    {ALT: () => $.SUBRULE($.declaration)},
                    {ALT: () => $.SUBRULE($.export)},
                    {ALT: () => $.SUBRULE($.function)}
                ])
            })
            $.CONSUME(L.CloseBrace)
        })

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self-analysis phase.
        this.performSelfAnalysis()
    }
}
