
const Le = require('./lexer')
const P = require('./parser')
const V = require('./visitor')
const Lo = require('./loader')


export class Diyreact {
    static render(input) {
        //input opsplitsen in tokens
        // parsen naar CST
        //CST bezoeken
        //AST omzetten naar JS
        //JS teruggeven
        const tokens = Le.tokenize(input)
        const cst = P.parse(tokens)
        const ast = V.visit(cst)
        return Lo.loader(ast)
    }
}
