// Unit tests die aantonen dat er een correcte AST of CST voortkomt uit de taalconstructies die je ondersteunt (declaratie, toekenning, aanroep, jsx-expressie, ...)
// Enkele tests die aantonen dat syntax-fouten op een gepaste manier gerapporteerd worden.
// End-to-end test die aantoont dat er correcte JavaScript code voortkomt uit originele broncode.
const Le = require('../src/js/lexer')
const P = require('../src/js/parser')
const V = require('../src/js/visitor')
const Lo = require('../src/js/loader')

test('test', () => {
    const input = `import {Diyreact} from 'diyreact-parser'

function optellen(getal, getal2) {
    return getal + getal2
}

const optelling = optellen(1, 2)
console.log(optelling)

const element = '<div><p>hello world</p> <strong>foo</strong></div>'

Diyreact.render(element, document.getElementById('root'))`

    const js = Lo.loader(input)
    console.log(JSON.stringify(js))
})

test('check parser', () => {
    const input = `function optellen(getal, getal2) {
    return getal + getal2}`

    const ast = V.visit(input)
    console.dir(JSON.stringify(ast))
})

test('check loader', () => {
    const input = `function optellen(getal, getal2) {
    return getal + getal2}`

    const ast = V.visit(input)
    const js = Lo.loader(ast)
    console.dir(js)
})
