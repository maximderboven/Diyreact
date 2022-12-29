# Opdracht Programmeren 3 - Frontend Framework (Chevrotain, JS)
Maxim Derboven  
0145196-84  
maxim.derboven@student.kdg.be  

# Inhoudsopgave
[[_TOC_]]

# Diyreact

Voor het vak programmeren 3 heb ik gewerkt aan mijn eigen simpele versie van react. Diyreact AKA Direct :) Dit heb ik gedaan met behulp van Chevrotain, chevorotain beweert de snelste te zijn[1] in zijn soort en hiervoor moet je geen EBNF code schrijven. Dit heb ik echter wel gedaan omdat het je toch een goed overzicht geeft van je gramatica (meer daarover volgt).

## Installatie
1. De eerste stap is het project clonen.
```bash
git clone https://gitlab.com/kdg-ti/programmeren-3/projecten-22-23/maxim.derboven.git
```
2. In het 'diyreact-transpiler' project run je de volgende commando's. Na het builende zou er een dist folder moeten verschijnen.
```bash
npm install 
npm run build
```
3. In het 'diyreact-loader' project voer je de volgende commandos uit.
```bash
npm install 
npm run build
```
4. Vervolgens build je het 'diyreact-package' project met de volgende commandos
```bash
npm install 
npm run build
```
5. Als laatste kan je het 'diyreact-demo' project opendoen met webstorm en de volgende commandos uitvoeren
```bash
npm install 
npm start
```
Dit Demo project bevat al de juiste web pack configuratie om aan de slag te gaan met het processen van `.jsx` bestanden.  
*webpack.config.js*
```js
            {
                test: /\.jsx$/,
                loader: path.resolve('../diyreact-loader/src/index.js'),
            }
```
Na die stap zou er in de browser volgend scherm moeten open gaan:
![First screen when running demo opening project](https://gitlab.com/kdg-ti/programmeren-3/projecten-22-23/maxim.derboven/-/raw/main/assets/scherm_1.PNG "First screen when running demo opening project")

## Testen

De testen bevinden zich in het 'diyreact-transpiler' project. Deze testen testen de cst, ast en end-to-end (of de JS klopt) van alle acties besproken in de [Ondersteuning section](#Ondersteuning).

Om de testen uit te voeren voer je volgend commando uit in het transpiler project
```bash
npm run test
```

## Ondersteuning

Diyreact biedt mogelijkheden voor de volgende zaken
- **Variable declarations** (type x = statement of dergelijke)
- **Import Statements** (import x,* as x, {x} from y)
- **Return Statements** (return x)
- **Export Statements** (export default x)
- **Operations** (x +/* y)
- **Function Statements** (function x() {})
- **Function Statements with params** (function x(y,z) {})
- **JSX Expressions** (\<p>Test\</p>)
- **Geneste JSX Expressions** (\<p>Test \<Strong> Test2 \</Strong> Test3 \</p>)
- **Function Call** (x())
- **Function Call with params** (x(y,z))
- **Function Call on object** (x.y())
- **Function Call on object with params** (x.y(a,b))

## EBNF Gramatica
Zoals al eerder vermeld is het bij Chevrotain niet vereist om je EBNF Gramatica uit te schrijven. Ik heb dit echter wel gedaan om een goed overzicht te krijgen van alle mogelijkheden. 
De Gramatica is terug te vinden op [gitlab](https://gitlab.com/kdg-ti/programmeren-3/projecten-22-23/maxim.derboven/-/blob/main/diyreact-transpiler/src/grammar/DiyReact.g4), evenals het gramatica diagram [schema](https://gitlab.com/kdg-ti/programmeren-3/projecten-22-23/maxim.derboven/-/blob/main/diyreact-transpiler/diagrams.html).

## Werkwijze

Om met Chevrotain en JavaScript een frontend framework te maken naar analogie van React, heb ik de volgende stappen gevolgt:

1. Gebruik Chevrotain om een lexer te bouwen die de invoercode tokeniseert
2. Een parser die een Concrete Syntax Tree (CST) construeert uit de tokens.
3. De CST doorlopen met visitors en een Abstract Syntax Tree (AST) genereren die de structuur en inhoud van de code weergeeft.
4. De AST gebruiken om JavaScript-code te genereren.
5. Een externe package maken die @ runtime de code js code omzet naar create Elements (naar analogie van reactDOM)

Tijdens dit voorbeeld maken we gebruik van input string: `import {x} from "y"`

## De Compiler
### Tokens & Lexer
De eerste stap was om de tokens te definieren. De token representeerd een bepaald deel van de code.  
De code 'import from' bestaat uit twee tokens (import & from keywords).  
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
        
        //gramatica regels
    }
}
```
Voorbeeld van de import Statement rule en een subrule van een soort import.
```js
        $.RULE('importStatement', () => {
            $.CONSUME(Import)
            $.OPTION(() => {
                $.OR([
                    {ALT: () => $.SUBRULE($.asteriskImport)},
                    {ALT: () => $.SUBRULE($.curlyImport)},
                    {ALT: () => $.CONSUME(Identifier)}
                ])
                $.CONSUME(From)
            })
            $.CONSUME(StringLiteral)
        })

        $.RULE('curlyImport', () => {
            $.CONSUME(OpenBracket)
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier)
                }
            })
            $.CONSUME(CloseBracket)
        })
```
Deze stap duurt een eeuwigheid aangezien je moet rekening houden met alle mogelijke opties die er zijn in je taal.  
Zoals eerder gezegd genereert de parser een CST

```json
{
  "name": "root",
  "children": {
    "statement": [
      {
        "name": "statement",
        "children": {
          "importStatement": [
            {
              "name": "importStatement",
              "children": {
                "Import": [
                  {
                    "image": "import",
                    [...]
                  }
                ],
                "curlyImport": [
                  {
                    "name": "curlyImport",
                    "children": {
                      "OpenBracket": [
                        {
                          "image": "{",
                          [...]
                        }
                      ],
                      "Identifier": [
                        {
                          "image": "x",
                          [...]
                        }
                      ],
                      "CloseBracket": [
                        {
                          "image": "}",
                          [...]
                        }
                      ]
                    }
                  }
                ],
                "From": [
                  {
                    "image": "from",
                    [...]
                  }
                ],
                "StringLiteral": [
                  {
                    "image": "\"y\"",
                    [...]
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
```

### Visitors

Zodra we onze CST hebben, gaan we die omzetten in een Abstract Syntax Tree (AST). Een AST is als een CST, maar bevat specifieke informatie voor ons programma, dus geen overbodige informatie zoals puntkomma's of accolades. Om een AST te verkrijgen, moeten we elke node van de CST 'bezoeken' met behulp van een CST Visitor.

In onderstaand voorbeeld bezoeken we het importstatement (zoals hierboven ook als voorbeeld gebruikt). De visitor visit elke tak van de boom tot in de puntjes en op basis van de uitkomsten maakt hij een object aan.

```js
class DiyreactVisitor extends parserInstance.getBaseCstVisitorConstructor() {
    constructor() {
        super()
        this.validateVisitor()
    }

    // Visit importStatement
    importStatement(ctx) {
        const Import = ctx.Import[0].image
        const ImportSource = ctx.StringLiteral[0].image
        const asteriskImport = this.visit(ctx.asteriskImport)
        const curlyImport = this.visit(ctx.curlyImport)
        if (asteriskImport) {
            const From = ctx.From[0].image
            return {
                type: 'IMPORTSTATEMENT',
                Import: Import,
                asteriskImport: asteriskImport,
                From: From,
                ImportSource: ImportSource
            }
        } else if (curlyImport) {
            const From = ctx.From[0].image
            return {
                type: 'IMPORTSTATEMENT',
                Import: Import,
                curlyImport: curlyImport,
                From: From,
                ImportSource: ImportSource
            }
        } else if (ctx.Identifier) {
            const From = ctx.From[0].image
            const Identifier = ctx.Identifier[0].image
            return {
                type: 'IMPORTSTATEMENT', 
                Import: Import, 
                ImportName: Identifier, 
                From: From, 
                ImportSource: ImportSource
            }
        }
        return {
            type: 'IMPORTSTATEMENT', 
            Import: Import, 
            ImportSource: ImportSource
        }
    }
```
De AST van de input na de visits ziet er zo uit:
```json
{
  "type": "ROOT",
  "root": [
    {
      "type": "STATEMENT",
      "statement": {
        "type": "IMPORTSTATEMENT",
        "Import": "import",
        "curlyImport": {
          "type": "CURLYIMPORT",
          "OpenBracket": "{",
          "ImportName": "x",
          "CloseBracket": "}"
        },
        "From": "from",
        "ImportSource": "\"y\""
      }
    }
  ]
}
```
### Compiler / Transpiler

Op basis van de AST die enkel de noodzakelijke onderdelen bevat in een (veeeel) overzichtelijkere vorm kunnen we JS code maken.  
Hierbij bezoeken we alle nodes van de AST boom en beslissen we welke code er zou moeten gegenereert worden (returnString) (in dit geval JS want het moet door een moderne browser gelezen kunnen worden).

```js
    function loadimportstatement(element) {
        returnString += 'import '
        if (element.asteriskImport) {
            returnString += `* as  ${element.asteriskImport.ImportName} from `
        } else if (element.curlyImport) {
            returnString += `{ ${element.curlyImport.ImportName} } from `
        } else if (element.ImportName) {
            returnString += `${element.ImportName} from `
        }
        returnString += `${element.ImportSource} \n`
    }
```
Uiteindelijk komt de volgende code uit de compiler:
`import { x } from "y"`  
In de compiler kan ik nu zelf bepalen in welke vorm/code het er uit zal komen.

### Loader
In een apart project hebben we nu een loader gedefinieert. Deze loader staat tussen de compiler en het demo project en wordt aangesproken door webpack van de demo. 

### reactDOM equivalent
Nu hebben we een werkende compiler die JS-code kan genereren uit JSX. Om het DOM te maken heb ik er voor gekozen om dit @ runtime te doen. Zo zou je dit virtueel kunnen bewerken. 

In diyreact wordt:  
`<div>test</div>`  
Omgezet naar:  
`Diyreact.createElement("div",["test "])`

Dit 'element' kunnen we aan de root hangen met de render functie:  
`Diyreact.render(element, root)`
  
Nu maken we een aparte package met de functies render en createElement om het dom aan te maken.

```js
function createElement(tag, ...children) {
    return {
        tag: tag,
        children: children
    }
}

function render(element, container) {
    if (Array.isArray(element)) {
        element.forEach(e => {
            render(e, container)
        })
    } else if (typeof element === "string") {
        container.appendChild(document.createTextNode(element))
    } else {
        const dom = document.createElement(element.tag)
        element.children.forEach(child => render(child, dom))
        container.appendChild(dom)
    }
    return container;
}
```
## Opties voor de webpack loader
De webpack plugin kan je opties meegeven en zo kan de preprocessor zich anders gedragen. 
Om dit uit te testen heb ik het simpel gehouden en enkel een methode uitgewerkt waarmee je een Diagram kon generaten die de rules voorstelden.  
Natuurlijk is dit minimaal en biedt dit veel meer mogelijkheden, denk aan bepaalde syntaxes wijzigen.
  
## Bronnen
[1]: <https://chevrotain.io/docs/features/blazing_fast.html> "Chevrotain is Blazing fast"
> Of.. Toch de belangrijkste;  
 https://dev.to/nathant/how-i-built-my-own-simplified-react-with-chevrotain-typescript-webpack-3ja6  
https://chevrotain.io/docs/tutorial/step0_introduction.html  
https://andela.com/insights/building-your-own-version-of-react-from-scratch-part-1/  
https://pomb.us/build-your-own-react/  
https://webpack.js.org/contribute/writing-a-loader/  
https://www.youtube.com/watch?v=0j91C_KfWc8  
https://mcocirio.medium.com/build-your-own-babel-plugin-from-scratch-8db0162f983a  
https://codepen.io/anamritraj/pen/gZVKBy  
https://leanylabs.com/blog/js-formula-engine/  
https://javascript.plainenglish.io/how-react-works-under-the-hood-277356c95e3d  


**En natuurlijk de cursus programmeren 3 op canvas!!**
