const Le = require('./lexer')
const P = require('./parser')
const V = require('./visitor')

module.exports = {
    tokenize: function(input) {
        return Le.tokenize(input)
    },
    cst: function(input) {
        return P.parse(input)
    },
    ast: function(input) {
        return V.visit(input)
    }
}

