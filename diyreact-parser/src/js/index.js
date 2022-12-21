const Le = require('./lexer')
const P = require('./parser')
const V = require('./visitor')


export default class Diyreact {
    static tokenize(input) {
        return Le.tokenize(input)
    }

    static cst(input) {
        return P.parse(input)
    }

    static ast(input) {
        return V.visit(input)
    }
}

