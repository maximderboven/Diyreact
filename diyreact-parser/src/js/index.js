import DiyreactParser from './parser'
import {createVisitorClass} from './visitor'
const chevrotain = require('chevrotain')
const L = require('./lexer')

const input = `
<></>
`

export function f(input) {
    const lexer = new chevrotain.Lexer(L.allTokens, { positionTracking: 'onlyStart' })
    const lexingResult = lexer.tokenize(input)
    const parser = new DiyreactParser()
    parser.input = lexingResult.tokens
    const cst = parser.program()

    const DiyReactToAstVisitor = new createVisitorClass(parser)
    const visitor = new DiyReactToAstVisitor()
    const ast = visitor.visit(cst)
    console.log(ast)
    return ast
}
