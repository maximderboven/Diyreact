const V = require('./visitor')

export function compile(input) {
    //TODO: catch options and handle them
    let returnString = ''
    const ast = V.visit(input)

    //root as start otherwise there is someting wrong
    if (ast.root.length > 0) {
        for (let index = 0; index < ast.root.length; index++) {
            loadstatement(ast.root[index].statement)
        }
    }

    function loadstatement(element) {
        if (element.type === 'IMPORTSTATEMENT') {
            loadimportstatement(element)
        } else if (element.type === 'EXPORTSTATEMENT') {
            loadexportstatement(element)
        } else if (element.type === 'FUNCTIONDECLARATION') {
            loadFunction(element)
        } else if (element.type === 'VARIABLEDECLARATION') {
            loadVariable(element)
        } else if (element.type === 'RETURN') {
            loaderReturn(element)
        } else if (element.type === 'CALLFUNCTION') {
            loadcallFunction(element)
        }
    }

    /* Covering:
    import * as diy from 'diyreact'
    import { Component } from 'diyreact'
    import 'diyreact'

    not covering:
    import diy from 'diyreact'
    import diy, { Component } from 'diyreact'
    import diy, * as diyreact from 'diyreact'
    import diy, { Component as C } from 'diyreact'
    import diy, { Component as C, createElement } from 'diyreact'
    import { Component as C, createElement } from 'diyreact'
    import * as diyreact, { Component as C, createElement } from 'diyreact'
     */
    function loadimportstatement(element) {
        returnString += 'import '
        if (element.asteriskImport) {
            returnString += `* as  ${element.asteriskImport.ImportName} from `
        } else if (element.curlyImport) {
            returnString += `{ ${element.curlyImport.ImportName} } from `
        } else if (element.ImportName) {
            returnString += `${element.ImportName} from `
        }
        returnString += `${element.ImportSource} \n`
    }

    // function loadVariableDeclaration(element) {
    //     returnString += `${element.VariableType} ${element.Identifier}`
    //     if (element.EqualSign) {
    //         returnString += ` = `
    //         if (element.Value.type === 'JSXEXPRESSION') {
    //             returnString += loadJSXExpression(element.Value)
    //         }
    //     }
    //     return returnString
    // }

    function loadexportstatement(element) {
        returnString += 'export '
        if (element.exports.type === 'FUNCTIONDECLARATION') {
            if (element.Default) {
                returnString += 'default '
            }
            loadFunction(element.exports)
        } else if (element.exports.type === 'VARIABLEDECLARATION') {
            returnString += 'export '
            if (element.Default) {
                returnString += 'default '
            }
            loadVariable(element.exports)
        }
    }

    /* Covering:
     */
    function loadVariable(element) {
        returnString += `${element.VariableType} ${element.Identifier} `
        if (element.EqualSign) {
            returnString += `= `
            if (element.Value) {
                if (element.Value.type === 'JSXEXPRESSION') {
                    loadJSX(element.Value)
                } else if (element.Value.type === 'OPERATION') {
                    loadOperation(element.Value)
                } else if (element.Value.type === 'STATEMENT') {
                    loadstatement(element.Value.statement)
                } else {
                    returnString += `${element.Value} `
                }
            }
        }
        returnString += '\n'
    }

    function loadJSX(element, parent) {
        returnString += `Diyreact.createElement("${element.Identifier}",[`
        for (let index = 0; index < element.jsxContent.length; index++) {
            const elem = element.jsxContent[index]
            if (elem.type === 'JSXEXPRESSION') {
                loadJSX(elem,(element.jsxContent[index+1]))
            }
            if (elem.type === 'JSXCONTENT') {
                if (!element.jsxContent[index - 1] || element.jsxContent[index - 1].type === 'JSXEXPRESSION') {
                    returnString += `"`
                }
                if (elem.Identifier) {
                    returnString += `${elem.Identifier} `
                } else if (elem.Literal) {
                    returnString += `${elem.Literal} `
                } else if (elem.Operator) {
                    returnString += `${elem.Operator} `
                }
                if (!element.jsxContent[index + 1] || element.jsxContent[index + 1].type === 'JSXEXPRESSION') {
                    returnString += `"`
                }
                if (element.jsxContent[index + 1] && element.jsxContent[index + 1].type === 'JSXEXPRESSION') {
                    returnString += `,`
                }
            }
        }
        returnString += '])'
        if (parent) {
            returnString += `,`
        }
    }

    function loadOperation(element) {
        returnString += `${element.FirstPart} ${element.Operator} ${element.SecondPart} `
    }

    function loadFunction(element) {
        returnString += `function ${element.FunctionName} `
        if (element.functionVariables) {
            returnString += `(`
            loadFunctionVariables(element.functionVariables)
            returnString += `) `
        } else {
            returnString += `() `
        }
        if (element.statement) {
            returnString += `{ \n`
            for (let index = 0; index < element.statement.length; index++) {
                loadstatement(element.statement[index].statement)
            }
            returnString += `} \n`
        }
    }

    function loadFunctionVariables(element) {
        if (element.Variable.length) {
            for (let index = 0; index < element.Variable.length; index++) {
                if (index > 0) {
                    returnString += `,`
                }
                returnString += `${element.Variable[index].image}`
            }
        } else {
            returnString += `${element.Variable.image}`
        }
    }

    function loaderReturn(element) {
        returnString += `return `
        if (element.returnValue.type === 'EXPRESSION') {
            if (element.returnValue.expression.type === 'JSXEXPRESSION') {
                loadJSX(element.returnValue.expression)
            } else if (element.returnValue.expression.type === 'OPERATION') {
                loadOperation(element.returnValue.expression)
            }
        } else if (element.returnValue.type === 'CALLFUNCTION') {
            loadcallFunction(element.returnValue.expression)
        } else {
            returnString += `${element.returnValue} `
        }
        returnString += '\n'
    }


    function loadcallFunction(element) {
        returnString += `${element.Identifier}`
        if (element.FunctionName1) {
            returnString += `.${element.FunctionName1}`
        }
        returnString += `(`

        if (element.variables) {
            loadFunctionVariables(element.variables)
        }
        returnString += `) \n`
    }

    return returnString
}
