// Unit tests die aantonen dat er een correcte AST of CST voortkomt uit de taalconstructies die je ondersteunt (declaratie, toekenning, aanroep, jsx-expressie, ...)
const V = require('../src/js/visitor')
const assert = require("assert");
const P = require("../src/js/parser");
//AST test:
// test if the ast is correct while parsing a var declaration
test('test ast - VAR DECLARATION', () => {
    const input = `
const x = 2
    `
    const ast = V.visit(input)
    assert.equal(ast.type, "PROGRAM")
    assert.equal(ast.program[0].type, "STATEMENT")
    assert.equal(ast.program[0].statement.type, "VARIABLEDECLARATION")
    assert.equal(ast.program[0].statement.VariableType, "const")
    assert.equal(ast.program[0].statement.Identifier, "x")
    assert.equal(ast.program[0].statement.EqualSign, "=")
    assert.equal(ast.program[0].statement.Value, "2")
})

//AST test:
// test if the ast is correct while parsing an import statement
test('test ast - IMPORT STATEMENT', () => {
    const input = `
import {x} from "y"
    `
    const ast = V.visit(input)
    assert.equal(ast.type, "PROGRAM")
    assert.equal(ast.program[0].type, "STATEMENT")
    assert.equal(ast.program[0].statement.type, "IMPORTSTATEMENT")
    assert.equal(ast.program[0].statement.Import, "import")
    assert.equal(ast.program[0].statement.curlyImport.type, "CURLYIMPORT")
    assert.equal(ast.program[0].statement.curlyImport.OpenBracket, "{")
    assert.equal(ast.program[0].statement.curlyImport.ImportName, "x")
    assert.equal(ast.program[0].statement.curlyImport.CloseBracket, "}")
    assert.equal(ast.program[0].statement.From, "from")
    assert.equal(ast.program[0].statement.ImportSource, "\"y\"")
})

//AST test:
// test if the ast is correct while parsing a return statement
test('test ast - RETURN STATEMENT', () => {
    const input = `
return x
    `
    const ast = V.visit(input)
    assert.equal(ast.type, "PROGRAM")
    assert.equal(ast.program[0].type, "STATEMENT")
    assert.equal(ast.program[0].statement.type, "RETURN")
    assert.equal(ast.program[0].statement.Return, "return")
    assert.equal(ast.program[0].statement.returnValue, "x")
})


//AST test:
// test if the ast is correct while parsing a function declaration

describe('test ast - FUNCTION DECLARATION', () => {
    it('function', () => {
        const input = `
function x() {

}
    `
        const ast = V.visit(input)
        assert.equal(ast.type, "PROGRAM")
        assert.equal(ast.program[0].type, "STATEMENT")
        assert.equal(ast.program[0].statement.type, "FUNCTIONDECLARATION")
        assert.equal(ast.program[0].statement.Function, "function")
        assert.equal(ast.program[0].statement.FunctionName, "x")
        assert.equal(ast.program[0].statement.OpenParenthesis, "(")
        assert.equal(ast.program[0].statement.CloseParenthesis, ")")
        assert.equal(ast.program[0].statement.OpenBracket, "{")
        assert.equal(ast.program[0].statement.CloseBracket, "}")
    })
    it('function with params', () => {
        const input = `
function x(a, b) {

}
    `
        const ast = V.visit(input)
        assert.equal(ast.type, "PROGRAM")
        assert.equal(ast.program[0].type, "STATEMENT")
        assert.equal(ast.program[0].statement.type, "FUNCTIONDECLARATION")
        assert.equal(ast.program[0].statement.Function, "function")
        assert.equal(ast.program[0].statement.FunctionName, "x")
        assert.equal(ast.program[0].statement.OpenParenthesis, "(")
        assert.equal(ast.program[0].statement.functionVariables.type, "FUNCTIONVARIABLES")
        assert.equal(ast.program[0].statement.functionVariables.Variable[0].image, "a")
        assert.equal(ast.program[0].statement.functionVariables.Variable[1].image, "b")
        assert.equal(ast.program[0].statement.functionVariables.Comma, ",")
        assert.equal(ast.program[0].statement.CloseParenthesis, ")")
        assert.equal(ast.program[0].statement.OpenBracket, "{")
        assert.equal(ast.program[0].statement.CloseBracket, "}")
    })
})


//AST test:
// test if the ast is correct while parsing a JSX expression
test('test ast - JSX EXPRESSION', () => {
    const input = `
const x = <div>test</div>
    `
    const ast = V.visit(input)
    assert.equal(ast.type, "PROGRAM")
    assert.equal(ast.program[0].type, "STATEMENT")
    assert.equal(ast.program[0].statement.type, "VARIABLEDECLARATION")
    assert.equal(ast.program[0].statement.VariableType, "const")
    assert.equal(ast.program[0].statement.Identifier, "x")
    assert.equal(ast.program[0].statement.EqualSign, "=")
    assert.equal(ast.program[0].statement.Value.type, "JSXEXPRESSION")
    assert.equal(ast.program[0].statement.Value.OpenAngleBracket, "<")
    assert.equal(ast.program[0].statement.Value.Identifier, "div")
    assert.equal(ast.program[0].statement.Value.CloseAngleBracket, ">")
    assert.equal(ast.program[0].statement.Value.jsxContent[0].type, "JSXCONTENT")
    assert.equal(ast.program[0].statement.Value.jsxContent[0].Identifier, "test")
    assert.equal(ast.program[0].statement.Value.OpenEndAngleBracket, "</")
    assert.equal(ast.program[0].statement.Value.Identifier1, "div")
    assert.equal(ast.program[0].statement.Value.CloseAngleBracket1, ">")
})


//AST test:
// test if the ast is correct while parsing a function call
describe('AST test - function calls', () => {
    it('function call', () => {
        const input = `
x(a,b)
    `
        const ast = V.visit(input)
        assert.equal(ast.type, "PROGRAM")
        assert.equal(ast.program[0].type, "STATEMENT")
        assert.equal(ast.program[0].statement.type, "CALLFUNCTION")
        assert.equal(ast.program[0].statement.Identifier, "x")
        assert.equal(ast.program[0].statement.OpenParenthesis, "(")
        assert.equal(ast.program[0].statement.variables.type, "FUNCTIONCALLVARIABLES")
        assert.equal(ast.program[0].statement.variables.Variable[0].image, "a")
        assert.equal(ast.program[0].statement.variables.Variable[1].image, "b")
        assert.equal(ast.program[0].statement.variables.Comma, ",")
        assert.equal(ast.program[0].statement.CloseParenthesis, ")")
    })
    it('function call on object', () => {
        const input = `
x.y(a,b)
    `
        const ast = V.visit(input)
        assert.equal(ast.type, "PROGRAM")
        assert.equal(ast.program[0].type, "STATEMENT")
        assert.equal(ast.program[0].statement.type, "CALLFUNCTION")
        assert.equal(ast.program[0].statement.Identifier, "x")
        assert.equal(ast.program[0].statement.FunctionName1, "y")
        assert.equal(ast.program[0].statement.OpenParenthesis, "(")
        assert.equal(ast.program[0].statement.variables.type, "FUNCTIONCALLVARIABLES")
        assert.equal(ast.program[0].statement.variables.Variable[0].image, "a")
        assert.equal(ast.program[0].statement.variables.Variable[1].image, "b")
        assert.equal(ast.program[0].statement.variables.Comma, ",")
        assert.equal(ast.program[0].statement.CloseParenthesis, ")")
    })
})
