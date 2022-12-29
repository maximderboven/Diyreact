// Enkele tests die aantonen dat syntax-fouten op een gepaste manier gerapporteerd worden.
const C = require('../src/js/compiler')
const assert = require("assert");
//Syntax test:
test ('Syntax error on not closing tag', () => {
    const input = `
    const x = <div>hello
    `
    //check on error (does throw)
    expect(() => C.compile(input)).toThrow('Missing closing tag')
})

test ('Syntax error on different opening and closing tags', () => {
    const input = `
const x = <div>test</p>
    `
    //check on error (does throw)
    expect(() => C.compile(input)).toThrow('Opening and closing tag mismatch')
})

test ('Syntax error unsupported symbol', () => {
    const input = `
const x = true ? 3 : 2
    `
    //check on error (does throw)
    expect(() => C.compile(input)).toThrow("unexpected character: ->?<- at offset: 16, skipped 1 characters.")
})

test('test closing } in function', () => {
    const input = `
    function App() {
    `
    //check on error (does throw)
    expect(() => C.compile(input)).toThrow('Missing close bracket')
})
