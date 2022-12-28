// Enkele tests die aantonen dat syntax-fouten op een gepaste manier gerapporteerd worden.
const C = require('../src/js/compiler')
const assert = require("assert");
//Syntax test:
test ('Syntax error test 1', () => {
    const input = `
const x = 2 : 3
    `
    //check on error (does throw)
    assert.throws(() => C.compile(input), "Received SyntaxError: Error: unexpected character: ->:<- at offset: 13, skipped 1 characters.")
})

test ('Syntax error test 2', () => {
    const input = `
const x = 2 ?
    `
    //check on error (does throw)
    assert.throws(() => C.compile(input
    ), "Received SyntaxError: Error: unexpected character: ->?<- at offset: 13, skipped 1 characters.")
})

test ('Syntax error test 3', () => {
    const input = `
function (x,y,) {
    `
    assert.throws(() => C.compile(input
    ), "Received SyntaxError: Error: unexpected character: ->,<- at offset: 16, skipped 1 characters.")
})

test ('Syntax error test 4', () => {
    const input = `
function (x,y) {
    `
    assert.throws(() => C.compile(input
    ))
})
