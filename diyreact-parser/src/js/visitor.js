import {parserInstance} from './parser'


const GreetingVisitor = {
    greeting: (ctx) => {
        return ctx.Greeting.image;
    },
    name: (ctx) => {
        return ctx.nameParam.image + ctx.lastNameParam.image;
    }
};
//
// const visitor = new GreetingVisitor();
// const greetingResult = visitor.visit(cst);
// console.log(greetingResult); // Hello World! Jan Test
