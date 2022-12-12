export function createVisitorClass(parser) {
    const BaseVisitor = parser.getBaseCstVisitorConstructor()
    return class DiyreactVisitor extends BaseVisitor {
        constructor() {
            super()
            this.validateVisitor()
        }

        program(ctx) {
            return this.visit(ctx)
        }

        declaration(ctx) {
            return this.visit(ctx)
        }

        const(ctx) {
            return this.visit(ctx)
        }

        let(ctx) {
            return this.visit(ctx)
        }

        var(ctx) {
            return this.visit(ctx)
        }

        expression(ctx) {
            return this.visit(ctx)
        }
    }
}
