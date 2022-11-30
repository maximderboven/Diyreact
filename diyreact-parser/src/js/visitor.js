import {parserInstance} from './parser'


export function diyreactVisitor(parser) {
    return class diyreactVisitor extends parser.getBaseCstVisitorConstructor() {
        constructor() {
            super()
            this.validateVisitor()
        }

        // Visit the root of the CST
        root(ctx) {
            return this.visit(ctx.children)
        }

        // Visit the import rule
        import(ctx) {
            return this.visit(ctx.children)
        }

        // Visit the from rule
        from(ctx) {
            return this.visit(ctx.children)
        }

        // Visit the string literal rule
        stringLiteral(ctx) {
            return this.visit(ctx.children)
        }

        // Visit the identifier rule
        identifier(ctx) {
            return this.visit(ctx.children)
        }
    }
}