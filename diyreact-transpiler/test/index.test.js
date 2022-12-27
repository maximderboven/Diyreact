// Unit tests die aantonen dat er een correcte AST of CST voortkomt uit de taalconstructies die je ondersteunt (declaratie, toekenning, aanroep, jsx-expressie, ...)
// Enkele tests die aantonen dat syntax-fouten op een gepaste manier gerapporteerd worden.
// End-to-end test die aantoont dat er correcte JavaScript code voortkomt uit originele broncode.
const Le = require('../src/js/lexer')
const P = require('../src/js/parser')
const V = require('../src/js/visitor')
const C = require('../src/js/compiler')
const {visit} = require('../src/js/visitor')

test('test', () => {
    const input = `
import * as diy from 'diyreact'
    `
    const ast = V.visit(input)
    const cst  = P.parse(input)
    console.log(C.compile(input))
})
