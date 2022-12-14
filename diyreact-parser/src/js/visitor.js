const diyreactLexer = require('./lexer')
const parser = require('./parser')
const diyreactParser = parser.Parser

const parserInstance = new diyreactParser()

class DiyreactVisitor extends parserInstance.getBaseCstVisitorConstructor() {
    constructor() {
        super()
        this.validateVisitor()
    }

    program(ctx) {
        if (ctx.statement) {
            const statements = []
            for (var i = 0; i < ctx.statement.length; i++) {
                const statement = this.visit(ctx.statement[i])
                statements.push(statement)
            }
            return {
                type: 'PROGRAM',
                program: statements
            }
        }
        return {
            type: 'PROGRAM'
        }
    }
    statement(ctx) {
        const statement = {
            type: 'STATEMENT',
            statement: ''
        }
        if (ctx.importStatement) {
            statement.statement = this.visit(ctx.importStatement)
        } else if (ctx.exportStatement) {
            statement.statement = this.visit(ctx.exportStatement)
        } else if (ctx.functionDeclaration) {
            statement.statement = this.visit(ctx.functionDeclaration)
        } else if (ctx.variableDeclaration) {
            statement.statement = this.visit(ctx.variableDeclaration)
        } else if (ctx.returnStatement) {
            statement.statement = this.visit(ctx.returnStatement)
        } else if (ctx.callFunctionOn) {
            statement.statement = this.visit(ctx.callFunctionOn)
        } else if (ctx.callFunction) {
            statement.statement = this.visit(ctx.callFunction)
        }
        return statement
    }
    importStatement(ctx) {
        const Import = ctx.Import[0].image
        const Source = ctx.StringLiteral[0].image
        const astericImport =  this.visit(ctx.astericImport)
        const curlyImport = this.visit(ctx.curlyImport)
        if (astericImport) {
            return {
                type: 'IMPORT',
                import: Import,
                astericImport: astericImport,
                From: ctx.From[0].image,
                ImportSource: Source
            }
        } else if (curlyImport) {
            return {
                type: 'IMPORT',
                import: Import,
                curlyImport: curlyImport,
                From: ctx.From[0].image,
                ImportSource: Source
            }
        } else if (ctx.Identifier) {
            return {
                type: 'IMPORT',
                import: Import,
                ImportName: ctx.Identifier[0].image,
                From: ctx.From[0].image,
                ImportSource: Source
            }
        }
        return {
            type: 'IMPORT',
            import: Import,
            ImportSource: Source
        }
    }

    astericImport(ctx) {
        const asteric = ctx.Asterisk[0].image
        const as = ctx.As[0].image
        const identifier = ctx.Identifier[0].image
        return {
            type: 'ASTERICIMPORT',
            asteric: asteric,
            as: as,
            identifier: identifier
        }
    }

    curlyImport(ctx) {
        const curlyOpen = ctx.CurlyOpen[0].image
        const curlyClose = ctx.CurlyClose[0].image
        const importList = this.visit(ctx.importList)
        return {
            type: 'CURLYIMPORT',
            curlyOpen: curlyOpen,
            importList: importList,
            curlyClose: curlyClose
        }
    }

    importList(ctx) {
        const importList = []
        for (var i = 0; i < ctx.Identifier.length; i++) {
            const identifier = ctx.Identifier[i].image
            importList.push(identifier)
        }
        return importList
    }

    exportStatement(ctx) {
        const Export = ctx.Export[0].image
        const variableDeclaration = this.visit(ctx.variableDeclaration)
        const functionDeclaration = this.visit(ctx.functionDeclaration)
        if (variableDeclaration) {
            return {
                type: 'EXPORT',
                export: Export,
                variableDeclaration: variableDeclaration
            }
        } else if (functionDeclaration) {
            return {
                type: 'EXPORT',
                export: Export,
                functionDeclaration: functionDeclaration
            }
        }
        return {
            type: 'EXPORT',
            export: Export
        }
    }

    functionDeclaration(ctx) {
        const functionKeyword = ctx.Function[0].image
        const identifier = ctx.Identifier[0].image
        const parameterList = this.visit(ctx.parameterList)
        const block = this.visit(ctx.block)
        return {
            type: 'FUNCTIONDECLARATION',
            functionKeyword: functionKeyword,
            identifier: identifier,
            parameterList: parameterList,
            block: block
        }
    }

    parameterList(ctx) {
        const parameterList = []
        for (var i = 0; i < ctx.Identifier.length; i++) {
            const identifier = ctx.Identifier[i].image
            parameterList.push(identifier)
        }
        return parameterList
    }

    block(ctx) {
        const block = []
        for (var i = 0; i < ctx.statement.length; i++) {
            const statement = this.visit(ctx.statement[i])
            block.push(statement)
        }
        return block
    }

    variableDeclaration(ctx) {
        const variableKeyword = ctx.Variable[0].image
        const identifier = ctx.Identifier[0].image
        const assignment = this.visit(ctx.assignment)
        return {
            type: 'VARIABLEDECLARATION',
            variableKeyword: variableKeyword,
            identifier: identifier,
            assignment: assignment
        }
    }

    assignment(ctx) {
        const assignment = ctx.Assignment[0].image
        const expression = this.visit(ctx.expression)
        return {
            type: 'ASSIGNMENT',
            assignment: assignment,
            expression: expression
        }
    }

    returnStatement(ctx) {
        const returnKeyword = ctx.Return[0].image
        const expression = this.visit(ctx.expression)
        return {
            type: 'RETURNSTATEMENT',
            returnKeyword: returnKeyword,
            expression: expression
        }
    }

    callFunctionOn(ctx) {
        const identifier = ctx.Identifier[0].image
        const dot = ctx.Dot[0].image
        const callFunction = this.visit(ctx.callFunction)
        return {
            type: 'CALLFUNCTIONON',
            identifier: identifier,
            dot: dot,
            callFunction: callFunction
        }
    }

    callFunction(ctx) {
        const identifier = ctx.Identifier[0].image
        const argumentList = this.visit(ctx.argumentList)
        return {
            type: 'CALLFUNCTION',
            identifier: identifier,
            argumentList: argumentList
        }
    }

    argumentList(ctx) {
        const argumentList = []
        for (var i = 0; i < ctx.expression.length; i++) {
            const expression = this.visit(ctx.expression[i])
            argumentList.push(expression)
        }
        return argumentList
    }

    expression(ctx) {
        const expression = []
        for (var i = 0; i < ctx.addition.length; i++) {
            const addition = this.visit(ctx.addition[i])
            expression.push(addition)
        }
        return expression
    }

    addition(ctx) {
        const addition = []
        for (var i = 0; i < ctx.multiplication.length; i++) {
            const multiplication = this.visit(ctx.multiplication[i])
            addition.push(multiplication)
        }
        return addition
    }

    multiplication(ctx) {
        const multiplication = []
        for (var i = 0; i < ctx.power.length; i++) {
            const power = this.visit(ctx.power[i])
            multiplication.push(power)
        }
        return multiplication
    }

    power(ctx) {
        const power = []
        for (var i = 0; i < ctx.unary.length; i++) {
            const unary = this.visit(ctx.unary[i])
            power.push(unary)
        }
        return power
    }

    unary(ctx) {
        const unary = []
        for (var i = 0; i < ctx.primary.length; i++) {
            const primary = this.visit(ctx.primary[i])
            unary.push(primary)
        }
        return unary
    }

    primary(ctx) {
        const primary = []
        for (var i = 0; i < ctx.primary.length; i++) {
            const primary = this.visit(ctx.primary[i])
            primary.push(primary)
        }
        return primary
    }
}

const vititorInstance = new DiyreactVisitor()

export function parse(input) {
    const lexResult = diyreactLexer.tokenize(input)
    parserInstance.input = lexResult.tokens
    const cst = parserInstance.program()
    if (parserInstance.errors.length > 0) {
        throw Error('sad sad panda, lexing errors detected')
    }
    return vititorInstance.visit(cst)
}
