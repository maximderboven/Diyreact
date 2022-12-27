const diyreactLexer = require('./lexer')
const parser = require('./parser')
const diyreactParser = parser.Parser

const parserInstance = new diyreactParser()

class DiyreactVisitor extends parserInstance.getBaseCstVisitorConstructor() {
    constructor() {
        super()
        this.validateVisitor()
    }

    // Visit program : program can have multiple statements
    program(ctx) {
        if (ctx.statement) {
            const statements = []
            for (let index = 0; index < ctx.statement.length; index++) {
                const statement = this.visit(ctx.statement[index])
                statements.push(statement)
            }
            return {
                type: 'PROGRAM', program: statements
            }
        }
        return {
            type: 'PROGRAM'
        }
    }

    // Visit statement
    statement(ctx) {
        const variableDeclaration = this.visit(ctx.variableDeclaration)
        const functionDeclaration = this.visit(ctx.functionDeclaration)
        const callFunction = this.visit(ctx.callFunction)
        const importStatement = this.visit(ctx.importStatement)
        const exportStatement = this.visit(ctx.exportStatement)
        const returnStatement = this.visit(ctx.returnStatement)
        const statement = {
            type: 'STATEMENT', statement: ''
        }
        if (importStatement) {
            statement.statement = importStatement
        } else if (exportStatement) {
            statement.statement = exportStatement
        } else if (functionDeclaration) {
            statement.statement = functionDeclaration
        } else if (variableDeclaration) {
            statement.statement = variableDeclaration
        } else if (returnStatement) {
            statement.statement = returnStatement
        } else if (callFunction) {
            statement.statement = callFunction
        }
        return statement
    }

    // Visit importStatement
    importStatement(ctx) {
        const Import = ctx.Import[0].image
        const ImportSource = ctx.StringLiteral[0].image
        const AsteriskImport = this.visit(ctx.AsteriskImport)
        const curlyImport = this.visit(ctx.curlyImport)
        if (AsteriskImport) {
            const From = ctx.From[0].image
            return {
                type: 'IMPORTSTATEMENT',
                Import: Import,
                AsteriskImport: AsteriskImport,
                From: From,
                ImportSource: ImportSource
            }
        } else if (curlyImport) {
            const From = ctx.From[0].image
            return {
                type: 'IMPORTSTATEMENT',
                Import: Import,
                curlyImport: curlyImport,
                From: From,
                ImportSource: ImportSource
            }
        } else if (ctx.Identifier) {
            const From = ctx.From[0].image
            const Identifier = ctx.Identifier[0].image
            return {
                type: 'IMPORTSTATEMENT', Import: Import, ImportName: Identifier, From: From, ImportSource: ImportSource
            }
        }
        return {
            type: 'IMPORTSTATEMENT', Import: Import, ImportSource: ImportSource
        }
    }

    // Visit AsteriskImport
    AsteriskImport(ctx) {
        const Asterisk = ctx.Asterisk[0].image
        const As = ctx.As[0].image
        const Identifier = ctx.Identifier[0].image

        return {
            type: 'ASTERISKIMPORT', Asterisk: Asterisk, As: As, ImportName: Identifier
        }
    }

    // Visit curlyImport
    curlyImport(ctx) {
        const OpenBracket = ctx.OpenBracket[0].image
        const Identifier = ctx.Identifier[0].image
        const CloseBracket = ctx.CloseBracket[0].image
        return {
            type: 'CURLYIMPORT', OpenBracket: OpenBracket, ImportName: Identifier, CloseBracket: CloseBracket
        }
    }

    // Visit exportStatement
    exportStatement(ctx) {
        const Export = ctx.Export[0].image
        const variableDeclaration = this.visit(ctx.variableDeclaration)
        const functionDeclaration = this.visit(ctx.functionDeclaration)
        if (variableDeclaration) {
            if (ctx.Default) {
                const Default = ctx.Default[0].image
                return {
                    type: 'EXPORTSTATEMENT', Export: Export, Default: Default, exports: variableDeclaration
                }
            }
            return {
                type: 'EXPORTSTATEMENT', Export: Export, exports: variableDeclaration
            }
        } else {
            if (ctx.Default) {
                const Default = ctx.Default[0].image
                return {
                    type: 'EXPORTSTATEMENT', Export: Export, Default: Default, exports: functionDeclaration
                }
            }
            return {
                type: 'EXPORTSTATEMENT', Export: Export, exports: functionDeclaration
            }
        }
    }

    // Visit variableDeclaration
    variableDeclaration(ctx) {
        const VariableType = ctx.VarDeclaration[0].image
        const Identifier = ctx.Identifier[0].image
        if (ctx.EqualSign) {
            const EqualSign = ctx.EqualSign[0].image
            const literals = this.visit(ctx.literals)
            const jsxExpression = this.visit(ctx.jsxExpression)
            const operation = this.visit(ctx.operation)
            const statement = this.visit(ctx.statement)
            const object = {
                type: 'VARIABLEDECLARATION',
                VariableType: VariableType,
                Identifier: Identifier,
                EqualSign: EqualSign,
                Value: ''
            }
            if (literals) {
                object.Value = literals
            } else if (jsxExpression) {
                object.Value = jsxExpression
            } else if (statement) {
                object.Value = statement
            } else if (operation) {
                object.Value = operation
            }
            return object
        } else {
            return {
                type: 'VARIABLEDECLARATION', VariableType: VariableType, Identifier: Identifier
            }
        }
    }

    // Visit functionDeclaration
    functionDeclaration(ctx) {
        let statements
        const FunctionKey = ctx.Function[0].image
        const Identifier = ctx.Identifier[0].image
        const OpenParenthesis = ctx.OpenParenthesis[0].image
        const functionVariables = this.visit(ctx.functionVariables)
        const CloseParenthesis = ctx.CloseParenthesis[0].image
        const OpenBracket = ctx.OpenBracket[0].image
        const statement = this.visit(ctx.statement)
        const CloseBracket = ctx.CloseBracket[0].image
        if (functionVariables && statement) {
            statements = []
            for (let index = 0; index < ctx.statement.length; index++) {
                const element = this.visit(ctx.statement[index])
                statements.push(element)
            }
            return {
                type: 'FUNCTIONDECLARATION',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParenthesis: OpenParenthesis,
                functionVariables: functionVariables,
                CloseParenthesis: CloseParenthesis,
                OpenBracket: OpenBracket,
                statement: statements,
                CloseBracket: CloseBracket
            }
        } else if (functionVariables) {
            return {
                type: 'FUNCTIONDECLARATION',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParenthesis: OpenParenthesis,
                functionVariables: functionVariables,
                CloseParenthesis: CloseParenthesis,
                OpenBracket: OpenBracket,
                CloseBracket: CloseBracket
            }
        } else if (statement) {
            statements = []
            for (let index = 0; index < ctx.statement.length; index++) {
                const element = this.visit(ctx.statement[index])
                statements.push(element)
            }
            return {
                type: 'FUNCTIONDECLARATION',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParenthesis: OpenParenthesis,
                CloseParenthesis: CloseParenthesis,
                OpenBracket: OpenBracket,
                statement: statements,
                CloseBracket: CloseBracket
            }
        } else {
            return {
                type: 'FUNCTIONDECLARATION',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParenthesis: OpenParenthesis,
                CloseParenthesis: CloseParenthesis,
                OpenBracket: OpenBracket,
                CloseBracket: CloseBracket
            }
        }
    }

    // Visit functionVariables
    functionVariables(ctx) {
        if (ctx.Identifier) {
            const Identifier = ctx.Identifier[0].image
            if (!ctx.Comma) {
                return {
                    VariableName: Identifier, type: 'FUNCTIONVARIABLES'
                }
            } else {
                let elements = []
                const Comma = ctx.Comma[0].image
                for (let i = 0; i < ctx.Comma.length + 1; i++) {
                    const element = ctx.Identifier[i]
                    elements.push(element)
                }
                return {
                    type: 'FUNCTIONVARIABLES', Variable: elements, Comma: Comma
                }
            }
        }
    }

    // Visit literals
    literals(ctx) {
        if (ctx.Literal) {
            return ctx.Literal[0].image
        } else if (ctx.StringLiteral) {
            return ctx.StringLiteral[0].image
        } else if (ctx.MultiLineStringLiteral) {
            return ctx.MultiLineStringLiteral[0].image
        }
    }

    // Visit expression
    expression(ctx) {
        const jsxExpression = this.visit(ctx.jsxExpression)
        const operation = this.visit(ctx.operation)
        if (jsxExpression) {
            return {
                type: 'EXPRESSION', expression: jsxExpression
            }
        } else if (operation) {
            return {
                type: 'EXPRESSION', expression: operation
            }
        }
    }

    // Visit Operation
    operation(ctx) {
        const Identifier = ctx.Identifier[0].image
        const Operator = ctx.Operator[0].image
        if (ctx.Literal) {
            const Literal = ctx.Literal[0].image
            return {
                type: 'OPERATION', FirstPart: Identifier, Operator: Operator, SecondPart: Literal
            }
        } else {
            const Identifier1 = ctx.Identifier[1].image
            return {
                type: 'OPERATION', FirstPart: Identifier, Operator: Operator, SecondPart: Identifier1
            }
        }
    }

    // Visit jsxExpression
    jsxExpression(ctx) {
        const OpenAngleBracket = ctx.OpenAngleBracket[0].image
        const Identifier = ctx.Identifier[0].image
        const CloseAngleBracket = ctx.CloseAngleBracket[0].image
        const jsxExpression = this.visit(ctx.jsxExpression)
        const OpenEndAngleBracket = ctx.OpenEndAngleBracket[1].image
        const Identifier1 = ctx.Identifier[1].image
        const CloseAngleBracket1 = ctx.CloseAngleBracket[1].image
        if (jsxExpression) {
            return {
                type: 'JSXEXPRESSION',
                OpenAngleBracket: OpenAngleBracket,
                Identifier: Identifier,
                CloseAngleBracket: CloseAngleBracket,
                jsxExpression: jsxExpression,
                OpenEndAngleBracket: OpenEndAngleBracket,
                Identifier1: Identifier1,
                CloseAngleBracket1: CloseAngleBracket1
            }
        } else {
            return {
                type: 'JSXEXPRESSION',
                OpenAngleBracket: OpenAngleBracket,
                Identifier: Identifier,
                CloseAngleBracket: CloseAngleBracket,
                OpenEndAngleBracket: OpenEndAngleBracket,
                Identifier1: Identifier1,
                CloseAngleBracket1: CloseAngleBracket1
            }
        }
    }

    returnStatement(ctx) {
        const Return = ctx.Return[0].image
        const expression = this.visit(ctx.expression)
        const callFunction = this.visit(ctx.callFunction)
        const returnStat = {
            type: 'RETURN', Return: Return, returnValue: ''
        }
        if (expression) {
            returnStat.returnValue = expression
        } else if (callFunction) {
            returnStat.returnValue = callFunction
        } else {
            returnStat.returnValue = ctx.Identifier[0].image
        }
        return returnStat
    }

    callFunction(ctx) {
        const Identifier = ctx.Identifier[0].image
        const OpenParenthesis = ctx.OpenParenthesis[0].image
        const CloseParenthesis = ctx.CloseParenthesis[0].image
        const variables = this.visit(ctx.functionCallVariables)
        let callFunction
        if (variables) {
            callFunction = {
                type: 'CALLFUNCTION',
                Identifier: Identifier,
                OpenParenthesis: OpenParenthesis,
                variables: variables,
                CloseParenthesis: CloseParenthesis
            }
        } else {
            callFunction = {
                type: 'CALLFUNCTION',
                Identifier: Identifier,
                OpenParenthesis: OpenParenthesis,
                CloseParenthesis: CloseParenthesis
            }
        }
        if (ctx.Identifier[1]) {
            callFunction.FunctionName1 = ctx.Identifier[1].image
        }
        return callFunction
    }

    functionCallVariables(ctx) {
        if (!ctx.Comma) {
            if (ctx.Literal) {
                return {
                    type: 'FUNCTIONCALLVARIABLES', Variable: ctx.Literal[0]
                }
            } else if (ctx.StringLiteral) {
                return {
                    type: 'FUNCTIONCALLVARIABLES', Variable: ctx.StringLiteral[0]
                }
            } else if (ctx.MultiLineStringLiteral) {
                return {
                    type: 'FUNCTIONCALLVARIABLES', Variable: ctx.MultiLineStringLiteral[0]
                }
            } else if (ctx.jsxExpression) {
                return {
                    type: 'FUNCTIONCALLVARIABLES', Variable: this.visit(ctx.jsxExpression)
                }
            } else if (ctx.Identifier) {
                return {
                    type: 'FUNCTIONCALLVARIABLES', Variable: ctx.Identifier[0]
                }
            }
        } else {
            let elements = []
            const Comma = ctx.Comma[0].image

            if (ctx.Literal) {
                for (let i = 0; i < ctx.Literal.length; i++) {
                    elements.push(ctx.Literal[i])
                }
            }
            if (ctx.StringLiteral) {
                for (let i = 0; i < ctx.StringLiteral.length; i++) {
                    elements.push(ctx.StringLiteral[i])
                }
            }
            if (ctx.MultiLineStringLiteral) {
                for (let i = 0; i < ctx.MultiLineStringLiteral.length; i++) {
                    elements.push(ctx.MultiLineStringLiteral[i])
                }
            }
            if (ctx.jsxExpression) {
                for (let i = 0; i < ctx.jsxExpression.length; i++) {
                    elements.push(this.visit(ctx.jsxExpression[i]))
                }
            }
            if (ctx.Identifier) {
                for (let i = 0; i < ctx.Identifier.length; i++) {
                    elements.push(ctx.Identifier[i])
                }
            }
            return {
                type: 'FUNCTIONCALLVARIABLES', Variable: elements, Comma: Comma
            }
        }
    }
}

const vititorInstance = new DiyreactVisitor()

export function visit(input) {
    const lexResult = diyreactLexer.tokenize(input)
    parserInstance.input = lexResult.tokens
    const cst = parserInstance.program()
    if (parserInstance.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    return vititorInstance.visit(cst)
}
