//Implementation of the parser
// is a state machine that reads the tokens produced by the lexer and produces an AST
import {diyreactVocabulary as v} from './lexer'
import {tokenize} from './lexer'

const DiyeactLexer = require('./lexer')
const CstParser = require('chevrotain').CstParser

//The parser definition
class DiyreactParser extends CstParser {
    constructor() {
        super(v, {recoveryEnabled: true, outputCst: true})
        const $ = this

        //program
        $.RULE('program', () => {
            $.MANY(() => {
                $.SUBRULE($.statement)
            })
        })
        //statement = expression | declaration
        $.RULE('statement', () => {
            $.OR([
                { ALT: () => $.SUBRULE($.importStatement) },
                { ALT: () => $.SUBRULE($.exportStatement) },
                { ALT: () => $.SUBRULE($.functionDeclaration) },
                { ALT: () => $.SUBRULE($.variableDeclaration) },
                { ALT: () => $.SUBRULE($.returnStatement) },
                { ALT: () => $.SUBRULE($.callFunctionOn) },
                { ALT: () => $.SUBRULE($.callFunction) },
            ])
        })
        //importStatement = import {{identifier | * as identifier | {identifier, identifier} } from} {string}
        $.RULE('importStatement', () => {
            $.CONSUME(v.Import);
            $.OPTION(() => {
                $.OR([
                    { ALT: () => $.SUBRULE($.astericImport) },
                    { ALT: () => $.SUBRULE($.curlyImport) },
                    { ALT: () => $.CONSUME(v.Identifier) },
                ]);
                $.CONSUME(v.From);
            });
            $.CONSUME(v.StringLiteral);
        })
        //astericImport = *
        $.RULE('astericImport', () => {
            $.CONSUME(v.Asterisk);
            $.CONSUME(v.As);
            $.CONSUME(v.Identifier);
        })
        //curlyImport = {identifier, identifier}
        $.RULE('curlyImport', () => {
            $.CONSUME(v.LeftCurly);
            $.MANY_SEP({
                SEP: v.Comma,
                DEF: () => $.CONSUME(v.Identifier)
            });
            $.CONSUME(v.RightCurly);
        })
        //exportStatement = export {default} {function | variableDeclaration}
        $.RULE('exportStatement', () => {
            $.CONSUME(v.Export);
            $.OPTION(() => $.CONSUME(v.Default));
            $.OR([
                { ALT: () => $.SUBRULE($.functionDeclaration) },
                { ALT: () => $.SUBRULE($.variableDeclaration) },
            ]);
        })
        //functionDeclaration = function identifier (parameters) {program}
        $.RULE('functionDeclaration', () => {
            $.CONSUME(v.Function);
            $.CONSUME(v.Identifier);
            $.CONSUME(v.LeftParen);
            $.OPTION(() => $.SUBRULE($.parameters));
            $.CONSUME(v.RightParen);
            $.CONSUME(v.LeftCurly);
            $.SUBRULE($.program);
            $.CONSUME(v.RightCurly);
        })
        //parameters = identifier, identifier
        $.RULE('parameters', () => {
            $.MANY_SEP({
                SEP: v.Comma,
                DEF: () => $.CONSUME(v.Identifier)
            });
        })
        //variableDeclaration = let | const | var identifier { = expression}
        $.RULE('variableDeclaration', () => {
            $.OR([
                { ALT: () => $.CONSUME(v.Let) },
                { ALT: () => $.CONSUME(v.Const) },
                { ALT: () => $.CONSUME(v.Var) },
            ]);
            $.CONSUME(v.Identifier);
            $.OPTION(() => {
                $.CONSUME(v.Assign);
                $.OR([
                    { ALT: () => $.SUBRULE($.literals) },
                    { ALT: () => $.SUBRULE($.jsxExpression) },
                    { ALT: () => $.SUBRULE($.operation) },
                    { ALT: () => $.SUBRULE($.statement) },
                ]);
            })
        })
        //literal = string | number | boolean
        $.RULE('literals', () => {
            $.OR([
                { ALT: () => $.CONSUME(v.StringLiteral) },
            ]);
        })
        //jsxExpression = <identifier> {jsxExpression} </identifier>
        $.RULE('jsxExpression', () => {
            $.CONSUME(v.OpeningForTag);
            $.CONSUME(v.Identifier);
            $.OPTION(() => {
                $.MANY(() => {
                    $.CONSUME1(v.Identifier);
                    $.CONSUME(v.EqualSign);
                    $.CONSUME(v.StringLiteral);
                });
            });
            $.OR([
                { ALT: () => $.CONSUME(v.CloseSimpleTag) },
                { ALT: () => $.SUBRULE($.fullTag) },
            ]);
        })
        //fullTag = <identifier> {jsxExpression} </identifier>
        $.RULE('fullTag', () => {
            $.CONSUME(v.CloseForTag);
            $.OPTION(() => {
                $.MANY(() => {
                    $.SUBRULE($.jsxAllowedSymbols);
                });
            });
            $.OPTION1(() => {
                $.MANY1(() => {
                    $.SUBRULE($.jsxExpression);
                });
            });
            $.CONSUME(v.OpeningForSecondTag);
            $.CONSUME(v.Identifier);
            $.CONSUME1(v.CloseForTag);
        })
        //jsxAllowedSymbols = string | number | boolean | identifier | operation
        $.RULE('jsxAllowedSymbols', () => {
            $.OR([
                { ALT: () => $.CONSUME(v.Identifier) },
                { ALT: () => $.CONSUME(v.Comma) },
                { ALT: () => $.CONSUME(v.Point) },
                { ALT: () => $.CONSUME(v.Operator) },
            ]);
        })
        //returnStatement = return expression
        $.RULE('returnStatement', () => {
            $.CONSUME(v.Return);
            $.OR([
                { ALT: () => $.SUBRULE($.expression) },
                { ALT: () => $.SUBRULE($.callFunctionOn) },
                { ALT: () => $.SUBRULE($.callFunction) },
                { ALT: () => $.CONSUME(Identifier) },
            ]);
        })
        //callFunctionOn = identifier . identifier (parameters)
        $.RULE('callFunctionOn', () => {
            $.CONSUME(v.Identifier);
            $.CONSUME(v.Point);
            $.CONSUME1(v.Identifier);
            $.CONSUME(v.OpenParem);
            $.OPTION(() => {
                $.MANY_SEP({
                    SEP: v.Comma,
                    DEF: () => {
                        $.OR([
                            { ALT: () => $.CONSUME(v.Literal) },
                            { ALT: () => $.CONSUME(v.StringLiteral) },
                            { ALT: () => $.SUBRULE($.jsxExpression) },
                            { ALT: () => $.SUBRULE($.statement) },
                            { ALT: () => $.CONSUME2(v.Identifier) },
                        ]);
                    },
                });
            });
            $.CONSUME(v.CloseParem);
        })
        //callFunction = identifier (parameters)
        $.RULE('callFunction', () => {
            $.CONSUME(v.Identifier);
            $.CONSUME(v.OpenParem);
            $.OPTION(() => {
                $.MANY_SEP({
                    SEP: v.Comma,
                    DEF: () => {
                        $.OR([
                            { ALT: () => $.CONSUME(v.Literal) },
                            { ALT: () => $.CONSUME(v.StringLiteral) },
                            { ALT: () => $.CONSUME1(v.Identifier) },
                            { ALT: () => $.SUBRULE($.jsxExpression) },
                        ]);
                    },
                });
            });
            $.CONSUME(v.CloseParem);
        })

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self-analysis phase.
        $.performSelfAnalysis()
    }
}

export const parserInstance = new DiyreactParser();
export const Parser = DiyreactParser;

export function parse(inputText) {
    const lexResult = DiyeactLexer.tokenize(inputText);
    parserInstance.input = lexResult.tokens;
    if (parserInstance.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    const cst = parserInstance.program();
    return cst
}
