//Implementation of the parser
// is a state machine that reads the tokens produced by the lexer and produces an AST
import {diyreactVocabulary} from './lexer'

const DiyeactLexer = require('./lexer')
const CstParser = require('chevrotain').CstParser


const VariableKey = diyreactVocabulary.VariableKey
const Identifier = diyreactVocabulary.Identifier
const EqualSign = diyreactVocabulary.EqualSign
const From = diyreactVocabulary.From
const OpenParem = diyreactVocabulary.OpenParem
const Comma = diyreactVocabulary.Comma
const Operator = diyreactVocabulary.Operator
const Point = diyreactVocabulary.Point
const CloseSimpleTag = diyreactVocabulary.CloseSimpleTag
const CloseParem = diyreactVocabulary.CloseParem
const LeftCurly = diyreactVocabulary.LeftCurly
const Asteric = diyreactVocabulary.Asteric
const As = diyreactVocabulary.As
const Export = diyreactVocabulary.Export
const Default = diyreactVocabulary.Default
const RightCurly = diyreactVocabulary.RightCurly
const OpeningForTag = diyreactVocabulary.OpeningForTag
const OpeningForSecondTag = diyreactVocabulary.OpeningForSecondTag
const CloseForTag = diyreactVocabulary.CloseForTag
const Literal = diyreactVocabulary.Literal
const StringLiteral = diyreactVocabulary.StringLiteral
const MultiLineStringLiteral = diyreactVocabulary.MultiLineStringLiteral
const Function = diyreactVocabulary.Function
const Return = diyreactVocabulary.Return
const Import = diyreactVocabulary.Import

//The parser definition
class DiyreactParser extends CstParser {

    constructor() {
        super(diyreactVocabulary, {recoveryEnabled: true, outputCst: true})
        const $ = this


        $.RULE('program', () => {
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
        })

        $.RULE('statement', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.importStatement) },
                { ALT: () => $.SUBRULE($.exportStatement) },
                { ALT: () => $.SUBRULE($.functionDeclaration) },
                { ALT: () => $.SUBRULE($.variableDeclaration) },
                { ALT: () => $.SUBRULE($.returnStatement) },
                { ALT: () => $.SUBRULE($.callFunctionOn) },
                { ALT: () => $.SUBRULE($.callFunction) }
            ])
        })

        $.RULE('importStatement', () => {
            $.CONSUME(Import)
            $.OPTION(() => {
                $.OR([
                    { ALT: () => $.SUBRULE($.astericImport) },
                    { ALT: () => $.SUBRULE($.curlyImport) },
                    { ALT: () => $.CONSUME(Identifier) }
                ])
                $.CONSUME(From)
            })
            $.CONSUME(StringLiteral)
        })

        $.RULE('astericImport', () => {
            $.CONSUME(this.Asteric)
            $.CONSUME(As)
            $.CONSUME(Identifier)
        })

        $.RULE('curlyImport', () => {
            $.CONSUME(LeftCurly)
            $.CONSUME(Identifier)
            $.CONSUME(RightCurly)
        })

        $.RULE('exportStatement', () => {
            $.CONSUME(Export)
            $.OPTION(() => {
                $.CONSUME(Default)
            })
            $.OR([
                { ALT: () => $.SUBRULE($.variableDeclaration) },
                { ALT: () => $.SUBRULE($.functionDeclaration) }
            ])
        })

        $.RULE('functionDeclaration', () => {
            $.CONSUME(Function)
            $.CONSUME(Identifier)
            $.CONSUME(OpenParem)
            $.OPTION(() => {
                $.SUBRULE($.functionVariables)
            })
            $.CONSUME(CloseParem)
            $.CONSUME(LeftCurly)
            $.OPTION1(() => {
                $.SUBRULE($.statement)
            })
            $.CONSUME(RightCurly)
        })

        $.RULE('functionVariables', () => {
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier)
                }
            })
        })

        $.RULE('variableDeclaration', () => {
            $.CONSUME(VariableKey)
            $.CONSUME(Identifier)
            $.OPTION(() => {
                $.CONSUME(EqualSign)
                $.OR([
                    { ALT: () => $.SUBRULE($.literals) },
                    { ALT: () => $.SUBRULE($.jsxExpression) },
                    { ALT: () => $.SUBRULE($.operation) },
                    { ALT: () => $.SUBRULE($.statement) }
                ])
            })
        })

        $.RULE('literals', () => {
            $.OR([
                { ALT: () => $.CONSUME(Literal) },
                { ALT: () => $.CONSUME(StringLiteral) },
                { ALT: () => $.CONSUME(MultiLineStringLiteral) }
            ])
        })

        $.RULE('expression', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.operation) },
                { ALT: () => $.SUBRULE($.jsxExpression) }
            ])
        })

        $.RULE('operation', () => {
            $.CONSUME(Identifier)
            $.CONSUME(Operator)
            $.OR([
                { ALT: () => $.CONSUME1(Identifier) },
                { ALT: () => $.CONSUME1(Literal) }
            ])
        })

        $.RULE('jsxExpression', () => {
            $.CONSUME(OpeningForTag)
            $.CONSUME(Identifier)
            $.OPTION(() => {
                $.MANY(() => {
                    $.CONSUME1(Identifier)
                    $.CONSUME(EqualSign)
                    $.CONSUME(StringLiteral)
                })
            })
            $.OR([
                { ALT: () => $.CONSUME(CloseSimpleTag) },
                { ALT: () => $.SUBRULE($.fullTag) }
            ])
        })

        $.RULE('fullTag', () => {
            $.CONSUME(CloseForTag)
            $.OPTION(() => {
                $.MANY(() => {
                    $.SUBRULE($.jsxAllowedSymbols)
                })
            })
            $.OPTION1(() => {
                $.MANY1(() => {
                    $.SUBRULE($.jsxExpression)
                })
            })
            $.CONSUME(OpeningForSecondTag)
            $.CONSUME(Identifier)
            $.CONSUME1(CloseForTag)
        })

        $.RULE('jsxAllowedSymbols', () => {
            $.OR([
                { ALT: () => $.CONSUME(Identifier) },
                { ALT: () => $.CONSUME(Comma) },
                { ALT: () => $.CONSUME(Point) },
                { ALT: () => $.CONSUME(Operator) }
            ])
        })

        $.RULE('returnStatement', () => {
            $.CONSUME(Return)
            $.OR([
                { ALT: () => $.SUBRULE($.expression) },
                { ALT: () => $.SUBRULE($.callFunctionOn) },
                { ALT: () => $.SUBRULE($.callFunction) },
                { ALT: () => $.CONSUME(Identifier) }
            ])
        })

        $.RULE('callFunctionOn', () => {
            $.CONSUME(Identifier)
            $.CONSUME(Point)
            $.CONSUME1(Identifier)
            $.CONSUME(OpenParem)
            $.OPTION(() => {
                $.MANY_SEP({
                    SEP: Comma,
                    DEF: () => {
                        $.OR([
                            { ALT: () => $.CONSUME(Literal) },
                            { ALT: () => $.CONSUME(StringLiteral) },
                            { ALT: () => $.SUBRULE($.jsxExpression) },
                            { ALT: () => $.SUBRULE($.statement) },
                            { ALT: () => $.CONSUME2(Identifier) }
                        ])
                    }
                })
            })
            $.CONSUME(CloseParem)
        })

        $.RULE('callFunction', () => {
            $.CONSUME(Identifier)
            $.CONSUME(OpenParem)
            $.OPTION(() => {
                $.MANY_SEP({
                    SEP: Comma,
                    DEF: () => {
                        $.OR([
                            { ALT: () => $.CONSUME(Literal) },
                            { ALT: () => $.CONSUME(StringLiteral) },
                            { ALT: () => $.CONSUME1(Identifier) },
                            { ALT: () => $.SUBRULE($.jsxExpression) }
                        ])
                    }
                })
            })
            $.CONSUME(CloseParem)
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
    const lexResult = DiyeactLexer.tokenize(inputText)
    parserInstance.input = lexResult.tokens
    if (parserInstance.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    return parserInstance.program()
}
