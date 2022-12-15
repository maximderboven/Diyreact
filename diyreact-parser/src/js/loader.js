import {visit} from './visitor'


let sourcePosition = 0

export function loader(source) {
    const astFromVisitor = visit(source)
    let returnString = ''
    sourcePosition = 0

    if (astFromVisitor.program) {
        const splitSource = source.split(/\n/)
        const splitSource2 = []
        for (let index = 0; index < splitSource.length; index++) {
            const element = splitSource[index]
            if (element !== '' && !element.includes('//') && !element.includes('/*')) {
                if (!element.match('<(.*)>.*?|<(.*) />') && !element.match(/^\s*$/))
                    splitSource2.push(element)
            }
        }

        for (let index = 0; index < astFromVisitor.program.length; index++) {
            const element = astFromVisitor.program[index].statement
            if (typeof element.Value != 'undefined' && element.Value.type === 'JSX') {
                returnString += loaderVariable(element)
            } else if (element.type === 'EXPORT') {
                if (element.exports.type === 'FCT_STM') {
                    returnString += 'export '
                    if (typeof element.Default != 'undefined') {
                        returnString += 'default '
                    }
                    returnString += loaderFunction(splitSource2, element.exports)
                } else if (element.exports.type === 'VAR_STM') {
                    returnString += 'export '
                    if (typeof element.Default != 'undefined') {
                        returnString += 'default '
                    }
                    returnString += loaderVariable(element.exports)
                }
            } else if (element.type === 'FCT_STM') {
                returnString += loaderFunction(splitSource2, element)
            } else {
                returnString += splitSource2[sourcePosition] + '\n'
                sourcePosition++
            }
        }
    }
    return returnString
}

function loaderFunction(source, functionStatement) {
    let returnString = `function ${functionStatement.FunctionName}(`
    if (typeof functionStatement.functionVariables != 'undefined') {
        if (
            typeof functionStatement.functionVariables.VariableName != 'undefined'
        ) {
            returnString += functionStatement.functionVariables.VariableName
        } else if (
            typeof functionStatement.functionVariables.Variable != 'undefined'
        )
            returnString += functionStatement.functionVariables.Variable
    }
    sourcePosition++
    returnString += ') {'
    for (let index = 0; index < functionStatement.statement.length; index++) {
        const element = functionStatement.statement[index].statement
        if (
            element.type === 'RETURN_STM' &&
            element.returnValue.type === 'EXPR' &&
            element.returnValue.expression.type === 'JSX'
        ) {
            const jsxTag = element.returnValue.expression
            returnString += `return Diyreact.createElement('${jsxTag.FirstTag}',`
            if (typeof jsxTag.attributes != 'undefined') {
                returnString += `'${jsxTag.attributes}',`
            } else {
                returnString += '\'\','
            }
            if (
                typeof jsxTag.fullTag != 'undefined' &&
                (typeof jsxTag.fullTag.Contents != 'undefined' ||
                    typeof jsxTag.fullTag.expression != 'undefined')
            ) {
                const contents =
                    typeof jsxTag.fullTag.Contents == 'undefined'
                        ? ''
                        : jsxTag.fullTag.Contents
                returnString += `'${contents}'`
                if (typeof jsxTag.fullTag.expression != 'undefined') {
                    returnString += ','
                    returnString += loaderCreateElement(jsxTag.fullTag.expression)
                } else {
                    returnString += ')'
                }
            } else {
                returnString += '\'\')'
            }
        } else {
            returnString += source[sourcePosition]
            sourcePosition++
        }
    }
    returnString += '}'
    sourcePosition++
    return returnString
}

function loaderVariable(variableStatement) {
    const element = variableStatement.Value
    let returnString = `${variableStatement.VariableType} ${variableStatement.Identifier} = Diyreact.createElement('${element.FirstTag}',`
    if (typeof element.attributes != 'undefined') {
        returnString += `'${element.attributes}',`
    } else {
        returnString += '\'\','
    }
    if (
        typeof element.fullTag != 'undefined' &&
        (typeof element.fullTag.Contents != 'undefined' ||
            typeof element.fullTag.expression != 'undefined')
    ) {
        const contents =
            typeof element.fullTag.Contents == 'undefined'
                ? ''
                : element.fullTag.Contents
        returnString += `'${contents}'`
        if (typeof element.fullTag.expression != 'undefined') {
            returnString += ','
            returnString += loaderCreateElement(element.fullTag.expression)
        } else {
            returnString += ')'
        }
    } else {
        returnString += '\'\')'
    }
    returnString += '\n'
    return returnString
}

function loaderCreateElement(jsxExpression) {
    let returnString = ''
    for (let index = 0; index < jsxExpression.length; index++) {
        const element = jsxExpression[index]
        returnString += `Diyreact.createElement('${element.FirstTag}',`
        if (typeof element.attributes != 'undefined') {
            returnString += `'${element.attributes}',`
        } else {
            returnString += '\'\','
        }
        if (
            typeof element.fullTag != 'undefined' &&
            (typeof element.fullTag.Contents != 'undefined' ||
                typeof element.fullTag.expression != 'undefined')
        ) {
            const contents =
                typeof element.fullTag.Contents == 'undefined'
                    ? ''
                    : element.fullTag.Contents
            if (element.fullTag.expression !== undefined) {
                returnString += `'${contents}',${loaderCreateElement(
                    element.fullTag.expression
                )}`
            } else {
                returnString += `'${contents}')`
            }
        } else {
            returnString += '\'\')'
        }
        if (index + 1 !== jsxExpression.length) {
            returnString += ','
        } else {
            returnString += ')'
        }
    }
    return returnString
}
