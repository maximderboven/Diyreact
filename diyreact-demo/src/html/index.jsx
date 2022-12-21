//vragen
/*
1. dit voldoende als demo ?
2. Wat zijn de volgende stappen ?
3. Hoe kan ik de code in de browser laten zien ?
4. Hoe correct toevoegen met webpack ?
5. Diyreact.render functie aanmaken ?
 */

import {Diyreact} from 'diyreact-parser'

function optellen(getal, getal2) {
    return getal + getal2
}

const optelling = optellen(1, 2)
console.log(optelling)

const element = '<div>hello world</div> <strong>foo</strong>'

Diyreact.render(element, document.getElementById('root'))

