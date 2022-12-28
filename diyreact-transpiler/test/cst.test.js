// Unit tests die aantonen dat er een correcte AST of CST voortkomt uit de taalconstructies die je ondersteunt (declaratie, toekenning, aanroep, jsx-expressie, ...)
const P = require('../src/js/parser')
const assert = require("assert");
//CST test:
// test if the cst is correct while parsing a var declaration
test('test cst - VAR DECLARATION', () => {
    const input = `
const x = 2
    `
    const cst = P.parse(input)
    assert.equal(cst.name, "program")
    assert.equal(cst.children.statement[0].name, "statement")
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].name, "variableDeclaration")
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.VarDeclaration[0].image, "const")
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.Identifier[0].image, "x")
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.EqualSign[0].image, "=")
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.literals[0].name, "literals")
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.literals[0].children.Literal[0].image, "2")
})


//CST test:
// test if the cst is correct while parsing an import statement
test('test cst - IMPORT STATEMENT', () => {
    const input = `
import {x} from "y"
    `
    const cst = P.parse(input)
    assert.equal(cst.name, "program")
    assert.equal(cst.children.statement[0].name, "statement")
    assert.equal(cst.children.statement[0].children.importStatement[0].name, "importStatement")
    assert.equal(cst.children.statement[0].children.importStatement[0].children.Import[0].image, "import")
    assert.equal(cst.children.statement[0].children.importStatement[0].children.curlyImport[0].name, "curlyImport")
    assert.equal(cst.children.statement[0].children.importStatement[0].children.curlyImport[0].children.OpenBracket[0].image, "{")
    assert.equal(cst.children.statement[0].children.importStatement[0].children.curlyImport[0].children.Identifier[0].image, "x")
    assert.equal(cst.children.statement[0].children.importStatement[0].children.curlyImport[0].children.CloseBracket[0].image, "}")
    assert.equal(cst.children.statement[0].children.importStatement[0].children.From[0].image, "from")
    assert.equal(cst.children.statement[0].children.importStatement[0].children.StringLiteral[0].image, "\"y\"")
})


//CST test:
// test if the cst is correct while parsing an export statement
test('test cst - EXPORT STATEMENT', () => {
    const input = `
export x
    `
    const cst = P.parse(input)
    assert.equal(cst.name, "program")
    assert.equal(cst.children.statement[0].name, "statement")
    assert.equal(cst.children.statement[0].children.exportStatement[0].name, "exportStatement")
    assert.equal(cst.children.statement[0].children.exportStatement[0].children.Export[0].image, "export")
})

//CST test:
// test if the cst is correct while parsing a return statement
test('test cst - RETURN STATEMENT', () => {
    const input = `
return x
    `
    const cst = P.parse(input)
    assert.equal(cst.name, "program")
    assert.equal(cst.children.statement[0].name, "statement")
    assert.equal(cst.children.statement[0].children.returnStatement[0].name, "returnStatement")
    assert.equal(cst.children.statement[0].children.returnStatement[0].children.Return[0].image, "return")
    assert.equal(cst.children.statement[0].children.returnStatement[0].children.Identifier[0].image, "x")
})


//CST test:
// test if the cst is correct while parsing a function declaration
test('test cst - FUNCTION DECLARATION', () => {
    const input = `
function x() {
    export <p>test</p>
}
    `
    const cst = P.parse(input)
    assert.equal(cst.name, "program")
    assert.equal(cst.children.statement[0].name, "statement")
    assert.equal(cst.children.statement[0].children.functionDeclaration[0].name, "functionDeclaration")
    assert.equal(cst.children.statement[0].children.functionDeclaration[0].children.Identifier[0].image, "x")
    assert.equal(cst.children.statement[0].children.functionDeclaration[0].children.OpenParenthesis[0].image, "(")
    assert.equal(cst.children.statement[0].children.functionDeclaration[0].children.CloseParenthesis[0].image, ")")
    assert.equal(cst.children.statement[0].children.functionDeclaration[0].children.OpenBracket[0].image, "{")
    assert.equal(cst.children.statement[0].children.functionDeclaration[0].children.statement[0].name, "statement")
    assert.equal(cst.children.statement[0].children.functionDeclaration[0].children.statement[0].children.exportStatement[0].name, "exportStatement")
})


//CST test:
// test if the cst is correct while parsing a JSX expression
test('test cst - JSX EXPRESSION', () => {
    const input = `
const x = <p>test<strong>test2</strong></p>
    `
    const cst = P.parse(input)
    assert.equal(cst.name, "program")
    assert.equal(cst.children.statement[0].name, "statement")
    //assert equal for cst; p, test, strong, test2
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.jsxExpression[0].children.Identifier[0].image, 'p');
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.jsxExpression[0].children.jsxContent[0].children.Identifier[0].image, 'test');
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.jsxExpression[0].children.jsxContent[1].children.jsxExpression[0].children.Identifier[0].image, 'strong');
    assert.equal(cst.children.statement[0].children.variableDeclaration[0].children.jsxExpression[0].children.jsxContent[1].children.jsxExpression[0].children.jsxContent[0].children.Identifier[0].image, 'test2');
})


//CST test:
// test if the cst is correct while parsing a function call
describe('CST test - function calls', () => {
    it("Function call", () => {
        const input = "test(1,2,3)"
        const cst = P.parse(input)
        assert.equal(cst.name, "program")
        assert.equal(cst.children.statement[0].name, "statement")
        assert.equal(cst.children.statement[0].children.callFunction[0].name, "callFunction")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.Identifier[0].image, "test")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.OpenParenthesis[0].image, "(")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Literal[0].image, "1")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Literal[1].image, "2")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Literal[2].image, "3")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Comma[0].image, ",")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Comma[1].image, ",")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.CloseParenthesis[0].image, ")")
    })

    it("Function call on object", () => {
        const input = "test.test2(1,2,3)"
        const cst = P.parse(input)
        assert.equal(cst.name, "program")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.Identifier[0].image, "test")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.Identifier[1].image, "test2")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.Point[0].image, ".")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.OpenParenthesis[0].image, "(")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Literal[0].image, "1")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Literal[1].image, "2")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Literal[2].image, "3")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Comma[0].image, ",")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.functionCallVariables[0].children.Comma[1].image, ",")
        assert.equal(cst.children.statement[0].children.callFunction[0].children.CloseParenthesis[0].image, ")")
    })
})
