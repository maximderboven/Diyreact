import * as L from './lexer'
import DiyreactParser from './parser'
import DiyreactVisitor from './visitor'

const chevrotain = require('chevrotain')
const path = require('path')
const fs = require('fs')

const parser = new DiyreactParser()
const visitor = new DiyreactVisitor(parser)
const lexer = new chevrotain.Lexer(L.allTokens, {positionTracking: 'onlyStart'})

export default function loader(source, map) {
    const options = this.getOptions()
    if ('generateDiagram' in options) generateDiagram()

    this.callback(
        null,
        parse(source, options),
        map
    )
}

export default function parse(input, options) {
    const lexResult = lexer.tokenize(input)
    parser.input = lexResult.tokens
    const cst = parser.parse(lexingResult.tokens);
    console.log(cst)
}

export default function generatediagram() {
    const htmlText = chevrotain.createSyntaxDiagramsCode(parser.getSerializedGastProductions())
    const outPath = path.resolve(__dirname, './')
    fs.writeFileSync(outPath + '/generated_diagrams.html', htmlText)
}
