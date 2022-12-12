import DiyreactParser from './parser'
import {createVisitorClass} from './visitor'
const chevrotain = require('chevrotain')
const L = require('./lexer')

const input = `
<></>
`

//JSX komt binnen en JS gaat eruit

export function compile(input) {
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
