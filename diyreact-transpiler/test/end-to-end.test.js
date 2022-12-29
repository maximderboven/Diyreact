// End-to-end test die aantoont dat er correcte JavaScript code voortkomt uit originele broncode.
const Le = require('../src/js/lexer')
const P = require('../src/js/parser')
const V = require('../src/js/visitor')
const C = require('../src/js/compiler')
const assert = require("assert");

test ('test end-to-end - VAR DECLARATION', () => {
    const input = `
const x = 2
    `
    const js = C.compile(input)
    assert.equal(js, "const x = 2 \n")
})

test ('test end-to-end - {} IMPORT STATEMENT', () => {
    const input = `
import {x} from "y"
    `
    const js = C.compile(input)
    assert.equal(js, "import { x } from \"y\" \n")
})

test ('test end-to-end - * IMPORT STATEMENT', () => {
    const input = `
import * as test from "y"
    `
    const P = require("../src/js/parser");
    const cst = P.parse(input)
    const js = C.compile(input)
    assert.equal(js, "import * as  test from \"y\" \n")
})



test('test2', () => {
    const input = `
    const x = <div>
        <h1>Welkom bij DIYReact</h1>
        <p>Deze tekst is een paragraaf</p>
    </div>
    `
    const js = C.compile(input)
    assert.equal(js, 'const x = Diyreact.createElement("div",[Diyreact.createElement("h1",["Welkom bij DIYReact "]),Diyreact.createElement("p",["Deze tekst is een paragraaf "])])\n')
})

test('test', () => {
    const input = `
import { Diyreact } from 'diyreact'

// Declaratie van variabelen en functies
const getal = 5
function optellen(getal, getal2) {
    return getal + getal2
}

const optelling = optellen(getal, 2)
console.log(optelling)

const naam = "Maxim Derboven"
console.log(naam)

function App() {
    return <div>
            <h1>Welkom bij DIYReact</h1>
            <p>Deze tekst is een paragraaf</p>
        </div>
}

const element = <div><h1>Derboven Maxim</h1><div><p>This is a paragraph</p></div></div>
const element2 = <div><h1>Programmeren 3</h1><div><p>Hij ondersteunt <i>gelukkig</i> ook nummers, anders was het <strong>programmeren drie</strong></p></div></div>
const element3 = App()
const list = <ul><li>Item 5</li><li>Item 2</li><li>Item 3</li></ul>
const table = <table><tr><td>Item 1</td><td>Item 2</td><td>Item 3</td></tr></table>

console.log(element)

const root = document.getElementById('root')
Diyreact.render(element, root)
Diyreact.render(element3, root)
Diyreact.render(element2, root)
Diyreact.render(list, root)
Diyreact.render(table, root)
    `
    const jscode = C.compile(input)
    assert.equal(jscode, 'import { Diyreact } from \'diyreact\' \nconst getal = 5 \nfunction optellen (getal,getal2) { \nreturn getal + getal2 \n} \nconst optelling = optellen(2,getal) \n\nconsole.log(optelling) \nconst naam = "Maxim Derboven" \nconsole.log(naam) \nfunction App () { \nreturn Diyreact.createElement("div",[Diyreact.createElement("h1",["Welkom bij DIYReact "]),Diyreact.createElement("p",["Deze tekst is een paragraaf "])])\n} \nconst element = Diyreact.createElement("div",[Diyreact.createElement("h1",["Derboven Maxim "]),Diyreact.createElement("div",[Diyreact.createElement("p",["This is a paragraph "])])])\nconst element2 = Diyreact.createElement("div",[Diyreact.createElement("h1",["Programmeren 3 "]),Diyreact.createElement("div",[Diyreact.createElement("p",["Hij ondersteunt ",Diyreact.createElement("i",["gelukkig "]),"ook nummers anders was het ",Diyreact.createElement("strong",["programmeren drie "])])])])\nconst element3 = App() \n\nconst list = Diyreact.createElement("ul",[Diyreact.createElement("li",["Item 5 "]),Diyreact.createElement("li",["Item 2 "]),Diyreact.createElement("li",["Item 3 "])])\nconst table = Diyreact.createElement("table",[Diyreact.createElement("tr",[Diyreact.createElement("td",["Item 1 "]),Diyreact.createElement("td",["Item 2 "]),Diyreact.createElement("td",["Item 3 "])])])\nconsole.log(element) \nconst root = document.getElementById(\'root\') \n\nDiyreact.render(element,root) \nDiyreact.render(element3,root) \nDiyreact.render(element2,root) \nDiyreact.render(list,root) \nDiyreact.render(table,root) \n')
})
