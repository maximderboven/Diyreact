# Opdracht Programmeren 3 - Frontend Framework (Chevrotain, JS)
Maxim Derboven  
0145196-84  
maxim.derboven@student.kdg.be  

# Inhoudsopgave
[[_TOC_]]

# DIY REACT

Voor het vak programmeren 3 heb ik gewerkt aan mijn eigen simpele versie van react. DiyReact AKA Direct :)

Om met Chevrotain en JavaScript een frontend framework te maken naar analogie van React, heb ik de volgende stappen gevolgt:

1. Gebruik Chevrotain om een lexer te bouwen die de invoercode tokeniseert
2. Een parser die een Concrete Syntax Tree (CST) construeert uit de tokens.
3. De CST doorlopen met visitors en een Abstract Syntax Tree (AST) genereren die de structuur van de code weergeeft.
4. De AST gebruiken om equivalente JavaScript-code te genereren die door een moderne browser kan worden uitgevoerd. Dit kan tot stand komen met document.createElement.

## De Compiler
### Tokens & Lexer
De eerste stap was om de tokens te definieren. De token representeerd een bepaald deel van de code.  
De code 'import from' bestaat uit twee tokens.
Na het creeren van al de tokens voegen we ze toe aan de vocabulair die door de parser gebruikt gaat worden.
```js
const Function = createToken({ name: 'Function', pattern: /function/ })
const From = createToken({ name: 'From', pattern: /from/ })
const Export = createToken({ name: 'Export', pattern: /export/ })
const Default = createToken({ name: 'Default', pattern: /default/ })

const allTokens = [...]
```
Met Chevrotain kunnen we de lexer gemakkelijk opzetten door de vocabulair mee te geven.
```js
const DiyreactLexerInstance = new chevrotain.Lexer(allTokens)
```
Met deze lexer kunnen we onze lange input string omzetten naar tokens
### Parser
Na het tokenizen van de input moet dit geparst worden. Tijdens het parsen wordt de lijst met tokens omgezet in een Concrete Syntax Tree (CST), een mooie term voor een boomstructuur die broncode voorstelt.

Om te kunnen parsen met een Chevrotain parser moeten we grammatica regels opstellen. De parser zal dan gaan kijken of een rij van tokens overeen komt met een bepaalde regel.

```js
class DiyreactParser extends CstParser {

    constructor() {
        super(diyreactVocabulary, {recoveryEnabled: true, outputCst: true})
        const $ = this
        
        //gramatica rules
    }
}
```
```js
$.RULE('importStatement', () => {
    $.CONSUME(Import)
        $.OPTION(() => {
            $.OR([
                { ALT: () => $.SUBRULE($.astericImport) },
                { ALT: () => $.SUBRULE($.curlyImport) },
                { ALT: () => $.CONSUME(Identifier) }
            ])
            $.CONSUME(From)
        })
    $.CONSUME(StringLiteral)
})

$.RULE('astericImport', () => {
    $.CONSUME(this.Asteric)
    $.CONSUME(As)
    $.CONSUME(Identifier)
})
```
Deze stap duurt een eeuwigheid aangezien je moet rekening houden met alle mogelijke opties die er zijn in je taal.  
Zoals eerder gezegd genereert de parser een CST

//VOEG IMAGE TOE

### Visitors

Zodra we onze CST hebben, gaan we die omzetten in een Abstract Syntax Tree (AST). Een AST is als een CST, maar bevat specifieke informatie voor ons programma, dus geen overbodige informatie zoals puntkomma's of accolades. Om een AST te verkrijgen, moeten we elke node van de CST 'bezoeken' met behulp van een CST Visitor.

```js
class DiyreactVisitor extends parserInstance.getBaseCstVisitorConstructor() {
    constructor() {
        super()
        this.validateVisitor()
    }

    program(ctx) {
        if (ctx.statement) {
            const statements = []
            for (let index = 0; index < ctx.statement.length; index++) {
                const statement = this.visit(ctx.statement[index])
                statements.push(statement)
            }
            return {
                type: 'PROGRAM',
                program: statements
            }
        }
        return {
            type: 'PROGRAM'
        }
    }
}
```
### Loader
De volgende stap in het proces was de loader. Hierbij moet je weer alle nodes van de AST overlopen en werkende JS code van maken.

```js
export function loader(source) {
    const astFromVisitor = visit(source)
    let returnString = ''
    sourcePosition = 0

    if (astFromVisitor.program) {
        const splitSource = source.split(/\n/)
        const splitSource2 = []
        for (let index = 0; index < splitSource.length; index++) {
            const element = splitSource[index]
            if (element !== '' && !element.includes('//') && !element.includes('/*')) {
                if (!element.match('<(.*)>.*?|<(.*) />') && !element.match(/^\s*$/))
                    splitSource2.push(element)
            }
        }
    
    ...
    }
}
```

# Gebruiken in een project

## Voorbeeld
### Input
### Output
