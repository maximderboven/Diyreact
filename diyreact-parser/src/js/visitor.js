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
        if (typeof ctx.statement != 'undefined') {
            const statements = []
            for (let index = 0; index < ctx.statement.length; index++) {
                const statement = this.visit(ctx.statement[index])
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
        const variableDeclaration = this.visit(ctx.variableDeclaration)
        const functionDeclaration = this.visit(ctx.functionDeclaration)
        const callFunctionOn = this.visit(ctx.callFunctionOn)
        const callFunction = this.visit(ctx.callFunction)
        const importStatement = this.visit(ctx.importStatement)
        const exportStatement = this.visit(ctx.exportStatement)
        const returnStatement = this.visit(ctx.returnStatement)
        const statement = {
            type: 'STM',
            statement: ''
        }
        if (typeof importStatement != 'undefined') {
            statement.statement = importStatement
        } else if (typeof exportStatement != 'undefined') {
            statement.statement = exportStatement
        } else if (typeof functionDeclaration != 'undefined') {
            statement.statement = functionDeclaration
        } else if (typeof variableDeclaration != 'undefined') {
            statement.statement = variableDeclaration
        } else if (typeof returnStatement != 'undefined') {
            statement.statement = returnStatement
        } else if (typeof callFunctionOn != 'undefined') {
            statement.statement = callFunctionOn
        } else if (typeof callFunction != 'undefined') {
            statement.statement = callFunction
        }
        return statement
    }

    importStatement(ctx) {
        const Import = ctx.Import[0].image
        const ImportSource = ctx.StringLiteral[0].image
        const astericImport = this.visit(ctx.astericImport)
        const curlyImport = this.visit(ctx.curlyImport)
        if (typeof astericImport != 'undefined') {
            const From = ctx.From[0].image
            return {
                type: 'IMP_STM',
                Import: Import,
                astericImport: astericImport,
                From: From,
                ImportSource: ImportSource
            }
        } else if (typeof curlyImport != 'undefined') {
            const From = ctx.From[0].image
            return {
                type: 'IMP_STM',
                Import: Import,
                curlyImport: curlyImport,
                From: From,
                ImportSource: ImportSource
            }
        } else if (typeof ctx.Identifier != 'undefined') {
            const From = ctx.From[0].image
            const Identifier = ctx.Identifier[0].image
            return {
                type: 'IMP_STM',
                Import: Import,
                ImportName: Identifier,
                From: From,
                ImportSource: ImportSource
            }
        }
        return {
            type: 'IMP_STM',
            Import: Import,
            ImportSource: ImportSource
        }
    }

    astericImport(ctx) {
        const Asteric = ctx.Asteric[0].image
        const As = ctx.As[0].image
        const Identifier = ctx.Identifier[0].image

        return {
            type: 'IMP_AS_STM',
            Asteric: Asteric,
            As: As,
            ImportName: Identifier
        }
    }

    curlyImport(ctx) {
        const LeftCurly = ctx.LeftCurly[0].image
        const Identifier = ctx.Identifier[0].image
        const RightCurly = ctx.RightCurly[0].image
        return {
            type: 'IMP_CRL_STM',
            LeftCurly: LeftCurly,
            ImportName: Identifier,
            RightCurly: RightCurly
        }
    }

    exportStatement(ctx) {
        const Export = ctx.Export[0].image
        const variableDeclaration = this.visit(ctx.variableDeclaration)
        const functionDeclaration = this.visit(ctx.functionDeclaration)
        if (typeof variableDeclaration != 'undefined') {
            if (typeof ctx.Default != 'undefined') {
                const Default = ctx.Default[0].image
                return {
                    type: 'EXP_STM',
                    Export: Export,
                    Default: Default,
                    exports: variableDeclaration
                }
            }
            return {
                type: 'EXP_STM',
                Export: Export,
                exports: variableDeclaration
            }
        } else {
            if (typeof ctx.Default != 'undefined') {
                const Default = ctx.Default[0].image
                return {
                    type: 'EXP_STM',
                    Export: Export,
                    Default: Default,
                    exports: functionDeclaration
                }
            }
            return {
                type: 'EXP_STM',
                Export: Export,
                exports: functionDeclaration
            }
        }
    }

    functionDeclaration(ctx) {
        let statements
        const FunctionKey = ctx.Function[0].image
        const Identifier = ctx.Identifier[0].image
        const OpenParem = ctx.OpenParem[0].image
        const functionVariables = this.visit(ctx.functionVariables)
        const CloseParem = ctx.CloseParem[0].image
        const LeftCurly = ctx.LeftCurly[0].image
        const statement = this.visit(ctx.statement)
        const RightCurly = ctx.RightCurly[0].image
        if (
            typeof functionVariables != 'undefined' &&
            typeof statement != 'undefined'
        ) {
            statements = new Array()
            for (let index = 0; index < ctx.statement.length; index++) {
                const element = this.visit(ctx.statement[index])
                statements.push(element)
            }
            return {
                type: 'FCT_STM',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParem: OpenParem,
                functionVariables: functionVariables,
                CloseParem: CloseParem,
                LeftCurly: LeftCurly,
                statement: statements,
                RightCurly: RightCurly
            }
        } else if (typeof functionVariables != 'undefined') {
            return {
                type: 'FCT_STM',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParem: OpenParem,
                functionVariables: functionVariables,
                CloseParem: CloseParem,
                LeftCurly: LeftCurly,
                RightCurly: RightCurly
            }
        } else if (typeof statement != 'undefined') {
            statements = []
            for (let index = 0; index < ctx.statement.length; index++) {
                const element = this.visit(ctx.statement[index])
                statements.push(element)
            }
            return {
                type: 'FCT_STM',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParem: OpenParem,
                CloseParem: CloseParem,
                LeftCurly: LeftCurly,
                statement: statements,
                RightCurly: RightCurly
            }
        } else {
            return {
                type: 'FCT_STM',
                Function: FunctionKey,
                FunctionName: Identifier,
                OpenParem: OpenParem,
                CloseParem: CloseParem,
                LeftCurly: LeftCurly,
                RightCurly: RightCurly
            }
        }
    }

    functionVariables(ctx) {
        if (typeof ctx.Identifier != 'undefined') {
            const Identifier = ctx.Identifier[0].image
            if (typeof ctx.Comma == 'undefined') {
                return {
                    VariableName: Identifier,
                    type: 'FCT_VAR'
                }
            } else {
                let elements = ''
                const Comma = ctx.Comma[0].image
                for (var i = 0; i < ctx.Comma.length + 1; i++) {
                    const element = ctx.Identifier[i].image
                    if (elements.length != 0) {
                        elements += ','
                    }
                    elements += element
                }
                return {
                    type: 'FCT_VAR',
                    Variable: elements,
                    Comma: Comma
                }
            }
        }
    }

    variableDeclaration(ctx) {
        const VariableType = ctx.VariableKey[0].image
        const Identifier = ctx.Identifier[0].image
        if (typeof ctx.EqualSign != 'undefined') {
            const EqualSign = ctx.EqualSign[0].image
            const literals = this.visit(ctx.literals)
            const jsxExpression = this.visit(ctx.jsxExpression)
            const operation = this.visit(ctx.operation)
            const statement = this.visit(ctx.statement)
            const object = {
                type: 'VAR_STM',
                VariableType: VariableType,
                Identifier: Identifier,
                EqualSign: EqualSign,
                Value: ''
            }
            if (typeof literals != 'undefined') {
                object.Value = literals
            } else if (typeof jsxExpression != 'undefined') {
                object.Value = jsxExpression
            } else if (typeof statement != 'undefined') {
                object.Value = statement
            } else if (typeof operation != 'undefined') {
                object.Value = operation
            }
            return object
        } else {
            return {
                type: 'VAR_STM',
                VariableType: VariableType,
                Identifier: Identifier
            }
        }
    }

    literals(ctx) {
        if (typeof ctx.Literal != 'undefined') {
            const Literal = ctx.Literal[0].image
            return Literal
        } else if (typeof ctx.StringLiteral != 'undefined') {
            const Literal = ctx.StringLiteral[0].image
            return Literal
        } else if (typeof ctx.MultiLineStringLiteral != 'undefined') {
            const Literal = ctx.MultiLineStringLiteral[0].image
            return Literal
        }
    }

    expression(ctx) {
        const jsxExpression = this.visit(ctx.jsxExpression)
        const operation = this.visit(ctx.operation)
        if (typeof jsxExpression != 'undefined') {
            return {
                type: 'EXPR',
                expression: jsxExpression
            }
        } else if (typeof operation != 'undefined') {
            return {
                type: 'EXPR',
                expression: operation
            }
        }
    }

    operation(ctx) {
        const Identifier = ctx.Identifier[0].image
        const Operator = ctx.Operator[0].image
        if (typeof ctx.Literal != 'undefined') {
            const Literal = ctx.Literal[0].image
            return {
                type: 'OP',
                FirstPart: Identifier,
                Operator: Operator,
                SecondPart: Literal
            }
        } else {
            const Identifier1 = ctx.Identifier[1].image
            return {
                type: 'OP',
                FirstPart: Identifier,
                Operator: Operator,
                SecondPart: Identifier1
            }
        }
    }

    jsxExpression(ctx) {
        const OpeningForTag = ctx.OpeningForTag[0].image
        const Identifier = ctx.Identifier[0].image
        const fullTag = this.visit(ctx.fullTag)

        if (typeof ctx.Identifier[1] != 'undefined') {
            var statements = ''

            const EqualSign = ctx.EqualSign[0].image
            for (let index = 0; index < ctx.EqualSign.length; index++) {
                statements +=
                    ctx.Identifier[index + 1].image +
                    ' ' +
                    EqualSign +
                    ' ' +
                    ctx.StringLiteral[index].image
            }
            if (typeof fullTag != 'undefined') {
                return {
                    type: 'JSX',
                    OpeningForTag: OpeningForTag,
                    FirstTag: Identifier,
                    attributes: statements,
                    fullTag: fullTag
                }
            } else {
                const CloseSimpleTag = ctx.CloseSimpleTag[0].image
                return {
                    type: 'JSX',
                    OpeningForTag: OpeningForTag,
                    FirstTag: Identifier,
                    attributes: statements,
                    CloseSimpleTag: CloseSimpleTag
                }
            }
        } else {
            if (typeof fullTag != 'undefined') {
                return {
                    type: 'JSX',
                    OpeningForTag: OpeningForTag,
                    FirstTag: Identifier,
                    fullTag: fullTag
                }
            } else {
                const CloseSimpleTag = ctx.CloseSimpleTag[0].image
                return {
                    type: 'JSX_S',
                    OpeningForTag: OpeningForTag,
                    FirstTag: Identifier,
                    CloseSimpleTag: CloseSimpleTag
                }
            }
        }
    }

    fullTag(ctx) {
        let expressions
        const CloseForTag = ctx.CloseForTag[0].image
        const OpeningForSecondTag = ctx.OpeningForSecondTag[0].image
        const Identifier = ctx.Identifier[0].image
        const jsxAllowedSymbols = this.visit(ctx.jsxAllowedSymbols)
        const jsxExpression = this.visit(ctx.jsxExpression)

        if (typeof jsxAllowedSymbols != 'undefined') {
            var elements = ''
            for (let index = 0; index < ctx.jsxAllowedSymbols.length; index++) {
                const element = this.visit(ctx.jsxAllowedSymbols[index])
                if (elements.length != 0) {
                    elements += ' '
                }
                elements += element
            }
            if (typeof jsxExpression != 'undefined') {
                expressions = new Array()
                for (let index = 0; index < ctx.jsxExpression.length; index++) {
                    const statement = this.visit(ctx.jsxExpression[index])
                    expressions.push(statement)
                }
                return {
                    type: 'JSX_F',
                    Contents: elements,
                    expression: expressions,
                    OpeningForSecondTag: OpeningForSecondTag,
                    SecondTag: Identifier,
                    CloseForSecondTag: CloseForTag
                }
            } else {
                return {
                    type: 'JSX_F',
                    Contents: elements,
                    OpeningForSecondTag: OpeningForSecondTag,
                    SecondTag: Identifier,
                    CloseForSecondTag: CloseForTag
                }
            }
        }
        if (typeof jsxExpression != 'undefined') {
            expressions = []
            for (let index = 0; index < ctx.jsxExpression.length; index++) {
                const statement = this.visit(ctx.jsxExpression[index])
                expressions.push(statement)
            }
            return {
                type: 'JSX_F',
                expression: expressions,
                OpeningForSecondTag: OpeningForSecondTag,
                SecondTag: Identifier,
                CloseForSecondTag: CloseForTag
            }
        } else {
            return {
                type: 'JSX_F',
                OpeningForSecondTag: OpeningForSecondTag,
                SecondTag: Identifier,
                CloseForSecondTag: CloseForTag
            }
        }
    }

    jsxAllowedSymbols(ctx) {
        if (typeof ctx.Identifier != 'undefined') {
            const Identifier = ctx.Identifier[0].image
            return Identifier
        }
        if (typeof ctx.Comma != 'undefined') {
            const Comma = ctx.Comma[0].image
            return Comma
        }
        if (typeof ctx.Point != 'undefined') {
            const Point = ctx.Point[0].image
            return Point
        }
        if (typeof ctx.Operator != 'undefined') {
            const Operator = ctx.Operator[0].image
            return Operator
        }
    }

    returnStatement(ctx) {
        const Return = ctx.Return[0].image
        const expression = this.visit(ctx.expression)
        const callFunctionOn = this.visit(ctx.callFunctionOn)
        const callFunction = this.visit(ctx.callFunction)
        const returnStat = {
            type: 'RETURN_STM',
            Return: Return,
            returnValue: ''
        }
        if (typeof expression != 'undefined') {
            returnStat.returnValue = expression
        } else if (typeof callFunctionOn != 'undefined') {
            returnStat.returnValue = callFunctionOn
        } else if (typeof callFunction != 'undefined') {
            returnStat.returnValue = callFunction
        } else {
            const Identifier = ctx.Identifier[0].image
            returnStat.returnValue = Identifier
        }
        return returnStat
    }

    callFunctionOn(ctx) {
        const Identifier = ctx.Identifier[0].image
        const Point = ctx.Point[0].image
        const Identifier1 = ctx.Identifier[1].image
        const OpenParem = ctx.OpenParem[0].image
        const jsxExpression = this.visit(ctx.jsxExpression)
        const statement = this.visit(ctx.statement)

        const CloseParem = ctx.CloseParem[0].image

        if (typeof ctx.Comma != 'undefined') {
            const Comma = ctx.Comma[0].image
            const values = {
                type: 'CALL_FCT_STM',
                FunctionName: Identifier,
                OpenParem: OpenParem,
                value: '',
                CloseParem: CloseParem
            }
            var element = ''
            if (typeof ctx.Literal != 'undefined') {
                for (let index = 0; index < ctx.Literal.length; index++) {
                    const element1 = ctx.Literal[index]
                    element += element1 + Comma
                }
            } else if (typeof ctx.StringLiteral != 'undefined') {
                for (let index = 0; index < ctx.StringLiteral.length; index++) {
                    const element1 = ctx.StringLiteral[index]
                    element += element1 + Comma
                }
            } else if (typeof ctx.Identifier != 'undefined') {
                for (let index = 0; index < ctx.Identifier.length; index++) {
                    const element1 = ctx.Identifier[index]
                    element += element1 + Comma
                }
            } else if (typeof jsxExpression != 'undefined') {
                for (let index = 0; index < ctx.jsxExpression.length; index++) {
                    const element1 = ctx.jsxExpression[index]
                    element += element1 + Comma
                }
            }
            values.value = element
            return values
        }
        const returnItem = {
            type: 'CALL_FCT_ON_STM',
            VariableName: Identifier,
            Point: Point,
            FunctionName: Identifier1,
            OpenParem: OpenParem,
            value: '',
            CloseParem: CloseParem
        }
        if (typeof ctx.Literal != 'undefined') {
            const Literal = ctx.Literal[0].image
            returnItem.value = Literal
        } else if (typeof ctx.StringLiteral != 'undefined') {
            const Literal = ctx.StringLiteral[0].image
            returnItem.value = Literal
        } else if (typeof ctx.Identifier != 'undefined') {
            const Identifier = ctx.Identifier[0].image
            returnItem.value = Identifier
        } else if (typeof jsxExpression != 'undefined') {
            returnItem.value = jsxExpression
        } else if (typeof statement != 'undefined') {
            returnItem.value = statement
        } else {
            return {
                type: 'CALL_FCT_ON_STM',
                VariableName: Identifier,
                Point: Point,
                FunctionName: Identifier1,
                OpenParem: OpenParem,
                CloseParem: CloseParem
            }
        }
        return returnItem
    }

    callFunction(ctx) {
        const Identifier = ctx.Identifier[0].image
        const OpenParem = ctx.OpenParem[0].image
        const jsxExpression = this.visit(ctx.jsxExpression)

        const CloseParem = ctx.CloseParem[0].image
        if (typeof ctx.Comma == 'undefined') {
            const element = {
                type: 'CALL_FCT_STM',
                FunctionName: Identifier,
                OpenParem: OpenParem,
                value: '',
                CloseParem: CloseParem
            }
            if (typeof ctx.Literal != 'undefined') {
                const Literal = ctx.Literal[0].image
                element.value = Literal
            } else if (typeof ctx.StringLiteral != 'undefined') {
                const StringLiteral = ctx.StringLiteral[0].image
                element.value = StringLiteral
            } else if (typeof ctx.Identifier != 'undefined') {
                const Identifier = ctx.Identifier[0].image
                element.value = Identifier
            } else if (typeof jsxExpression != 'undefined') {
                element.value = jsxExpression
            } else {
                return {
                    type: 'CALL_FCT_STM',
                    FunctionName: Identifier,
                    OpenParem: OpenParem,
                    CloseParem: CloseParem
                }
            }
            return element
        } else {
            const Comma = ctx.Comma[0].image
            const values = {
                type: 'CALL_FCT_STM',
                FunctionName: Identifier,
                OpenParem: OpenParem,
                value: '',
                CloseParem: CloseParem
            }
            var element = ''
            if (typeof ctx.Literal != 'undefined') {
                for (let index = 0; index < ctx.Literal.length; index++) {
                    const element1 = ctx.Literal[index]
                    element += element1 + Comma
                }
            } else if (typeof ctx.StringLiteral != 'undefined') {
                for (let index = 0; index < ctx.StringLiteral.length; index++) {
                    const element1 = ctx.StringLiteral[index]
                    element += element1 + Comma
                }
            } else if (typeof ctx.Identifier != 'undefined') {
                for (let index = 0; index < ctx.Identifier.length; index++) {
                    const element1 = ctx.Identifier[index]
                    element += element1 + Comma
                }
            } else if (typeof jsxExpression != 'undefined') {
                for (let index = 0; index < ctx.jsxExpression.length; index++) {
                    const element1 = ctx.jsxExpression[index]
                    element += element1 + Comma
                }
            }
            values.value = element
            return values
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
