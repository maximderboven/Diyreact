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
            <h2>Welkom bij DIYReact</h2>
            <p>Deze tekst is een paragraaf</p>
        </div>
}

const element = <div><h1>Derboven Maxim</h1><div><p>This is a paragraph</p></div></div>
const element2 = <div><h3>Programmeren 3</h3><div><p>Hij ondersteunt <i>gelukkig</i> ook nummers, anders was het <strong>programmeren drie</strong></p></div></div>
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
