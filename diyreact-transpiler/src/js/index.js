const Le = require('./lexer')
const P = require('./parser')
const V = require('./visitor')
const C = require('./compiler')

module.exports = {
    tokenize: function(input) {
        return Le.tokenize(input)
    },
    cst: function(input) {
        return P.parse(input)
    },
    ast: function(input) {
        return V.visit(input)
    },
    compile: function(input) {
        return C.compile(input)
    }
}
