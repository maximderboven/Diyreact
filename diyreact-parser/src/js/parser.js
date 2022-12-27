//Implementation of the parser
// is a state machine that reads the tokens produced by the lexer and produces an AST
const Lexer = require('./lexer')
const CstParser = require('chevrotain').CstParser

const tokenVocabulary = Lexer.tokenVocabulary

const OpenParenthesis = tokenVocabulary.OpenParenthesis
const CloseParenthesis = tokenVocabulary.CloseParenthesis
const OpenBracket = tokenVocabulary.OpenBracket
const CloseBracket = tokenVocabulary.CloseBracket
const Comma = tokenVocabulary.Comma
const Point = tokenVocabulary.Point
const EqualSign = tokenVocabulary.EqualSign
const Asterisk = tokenVocabulary.Asterisk
const As = tokenVocabulary.As
const Operator = tokenVocabulary.Operator
const Not = tokenVocabulary.Not
const Default = tokenVocabulary.Default
const New = tokenVocabulary.New
const VarDeclaration = tokenVocabulary.VarDeclaration
const Return = tokenVocabulary.Return
const Function = tokenVocabulary.Function
const From = tokenVocabulary.From
const Export = tokenVocabulary.Export
const Import = tokenVocabulary.Import
const Require = tokenVocabulary.Require
const Identifier = tokenVocabulary.Identifier
const Literal = tokenVocabulary.Literal
const StringLiteral = tokenVocabulary.StringLiteral
const OpenAngleBracket = tokenVocabulary.OpenAngleBracket
const CloseAngleBracket = tokenVocabulary.CloseAngleBracket
const OpenEndAngleBracket = tokenVocabulary.OpenEndAngleBracket


//The parser definition
class DiyreactParser extends CstParser {

    constructor() {
        super(tokenVocabulary, {recoveryEnabled: true, outputCst: true})
        const $ = this

        //this is the top level rule
        //program form : (statement)*
        $.RULE('program', () => {
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
        })

        //statement form : (importStatement | exportStatement | functionDeclaration | varDeclaration | returnStatement | expressionStatement)
        $.RULE('statement', () => {
            $.OR([
                {ALT: () => $.SUBRULE($.importStatement)},
                {ALT: () => $.SUBRULE($.exportStatement)},
                {ALT: () => $.SUBRULE($.functionDeclaration)},
                {ALT: () => $.SUBRULE($.variableDeclaration)},
                {ALT: () => $.SUBRULE($.returnStatement)},
                {ALT: () => $.SUBRULE($.callFunction)}
            ])
        })

        //importStatement form : import (* | curlyImport | identifier) from (StringLiteral)
        $.RULE('importStatement', () => {
            $.CONSUME(Import)
            $.OPTION(() => {
                $.OR([
                    {ALT: () => $.SUBRULE($.AsteriskImport)},
                    {ALT: () => $.SUBRULE($.curlyImport)},
                    {ALT: () => $.CONSUME(Identifier)}
                ])
                $.CONSUME(From)
            })
            $.CONSUME(StringLiteral)
        })

        //asteriskImport form : * as identifier
        $.RULE('AsteriskImport', () => {
            $.CONSUME(Asterisk)
            $.CONSUME(As)
            $.CONSUME(Identifier)
        })

        //curlyImport form : {identifier (, identifier)*}
        $.RULE('curlyImport', () => {
            $.CONSUME(OpenBracket)
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier)
                }
            })
            $.CONSUME(CloseBracket)
        })

        //exportStatement form : export (default) (functionDeclaration | variableDeclaration)
        $.RULE('exportStatement', () => {
            $.CONSUME(Export)
            $.OPTION(() => {
                $.CONSUME(Default)
            })
            $.OR([
                {ALT: () => $.SUBRULE($.variableDeclaration)},
                {ALT: () => $.SUBRULE($.functionDeclaration)}
            ])
        })

        //variableDeclaration form : var identifier = (literals | jsxExpression | operation | statement)
        $.RULE('variableDeclaration', () => {
            $.CONSUME(VarDeclaration)
            $.CONSUME(Identifier)
            $.OPTION(() => {
                $.CONSUME(EqualSign)
                $.OR([
                    {ALT: () => $.SUBRULE($.literals)},
                    {ALT: () => $.SUBRULE($.jsxExpression)},
                    {ALT: () => $.SUBRULE($.operation)},
                    {ALT: () => $.SUBRULE($.statement)}
                ])
            })
        })

        //functionDeclaration form : function identifier (functionVariables) {statement}
        $.RULE('functionDeclaration', () => {
            $.CONSUME(Function)
            $.CONSUME(Identifier)
            $.CONSUME(OpenParenthesis)
            $.OPTION(() => {
                $.SUBRULE($.functionVariables)
            })
            $.CONSUME(CloseParenthesis)
            $.CONSUME(OpenBracket)
            $.OPTION1(() => {
                $.SUBRULE($.statement)
            })
            $.CONSUME(CloseBracket)
        })

        $.RULE('functionVariables', () => {
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier)
                }
            })
        })

        //literals form : (StringLiteral | MultiLineStringLiteral | Literal)
        $.RULE('literals', () => {
            $.OR([
                {ALT: () => $.CONSUME(Literal)},
                {ALT: () => $.CONSUME(StringLiteral)}
            ])
        })

        //operation form : (identifier) + (operator (literals | identifier))
        $.RULE('operation', () => {
            $.CONSUME(Identifier)
            $.CONSUME(Operator)
            $.OR([
                {ALT: () => $.CONSUME1(Identifier)},
                {ALT: () => $.CONSUME1(Literal)}
            ])
        })

        //jsxExpression form : <identifier> (jsxExpression | literals)* </identifier>
        $.RULE('jsxExpression', () => {
            $.CONSUME(OpenAngleBracket)
            $.CONSUME(Identifier)
            $.CONSUME(CloseAngleBracket)
            $.OPTION(() => {
                $.MANY(() => {
                    $.SUBRULE($.jsxContent)
                })
            })
            $.OPTION1(() => {
                $.MANY1(() => {
                    $.SUBRULE($.jsxExpression)
                })
            })
            $.CONSUME(OpenEndAngleBracket)
            $.CONSUME1(Identifier)
            $.CONSUME1(CloseAngleBracket)
        })

        $.RULE('jsxContent', () => {
            $.OR([
                {ALT: () => $.CONSUME(Identifier)},
                {ALT: () => $.CONSUME(Literal)},
                {ALT: () => $.CONSUME(StringLiteral)},
                {ALT: () => $.CONSUME(Comma)},
                {ALT: () => $.CONSUME(Point)},
                {ALT: () => $.CONSUME(Operator)}
            ])
        })

        //returnStatement form : return (literals | jsxExpression | operation | statement)
        $.RULE('returnStatement', () => {
            $.CONSUME(Return)
            $.OR([
                {ALT: () => $.SUBRULE($.expression)},
                {ALT: () => $.SUBRULE($.callFunction)},
                {ALT: () => $.CONSUME(Identifier)}
            ])
        })

        //expression form : (jsxExpression | operation)
        $.RULE('expression', () => {
            $.OR([
                {ALT: () => $.SUBRULE($.operation)},
                {ALT: () => $.SUBRULE($.jsxExpression)}
            ])
        })

        //callFunction form : identifier.(identifier) (, (literals | jsxExpression | operation | statement))*)
        $.RULE('callFunction', () => {
            $.OPTION(() => {
                $.CONSUME(Identifier)
                $.CONSUME(Point)
            })
            $.CONSUME1(Identifier)
            $.CONSUME(OpenParenthesis)
            $.OPTION2(() => {
                $.SUBRULE($.functionCallVariables)
            })
            $.CONSUME(CloseParenthesis)
        })

        $.RULE('functionCallVariables', () => {
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.OR([
                        {ALT: () => $.CONSUME(Literal)},
                        {ALT: () => $.CONSUME(StringLiteral)},
                        {ALT: () => $.SUBRULE($.jsxExpression)},
                        {ALT: () => $.SUBRULE($.statement)},
                        {ALT: () => $.CONSUME2(Identifier)}
                    ])
                }
            })
        })

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self-analysis phase.
        $.performSelfAnalysis()
    }
}

export const parserInstance = new DiyreactParser()
export const Parser = DiyreactParser

export function parse(inputText) {
    const lexResult = Lexer.tokenize(inputText)
    parserInstance.input = lexResult.tokens
    if (parserInstance.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    return parserInstance.program()
}
