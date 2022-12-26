import diyreact from 'diyreact'

// Declaratie van variabelen en functies
const getal = 5
function optellen(getal, getal2) {
    return getal + getal2
}

const optelling = optellen(getal, 2)
console.log(optelling)
const naam = "Maxim"
console.log(naam)

const element = '<div><h1>Demo project</h1><h2>Maxim Derboven</h2></div><div><p>hello world</p><strong>foo</strong></div>'

diyreact.render(element, document.getElementById('root'))
