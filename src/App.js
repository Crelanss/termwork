import React, {useState} from 'react'
import './App.css';
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import createPalette from "@material-ui/core/styles/createPalette";

const Container = styled.div`
  height:20vh;
  width:20vh;
  display:flex;
  margin-top:30vh;
  margin-left:40vw;
  align-items:center;
  flex-direction:column;
`

const order = "23456789TJQKA"
const h1 = '2C 5C 3C 4C 6C';
const h2 = '2C 5C 3C 4C 5H';
const h3 = '2C 5C 3C 4C 5H';
const possibleDeck = [
    '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH', 'AH',
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD', 'AD',
    '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC', 'AC',
    '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS', 'AS'
]
const createHands = (props) => {
    let finalHands = []
    let hands = props.split('/')
    let handsTrimmed = []
    for (let i = 0; i < hands.length; i++) {
        handsTrimmed[i] = hands[i].trim()
        finalHands[i] = hands[i].trim()
    }
    let outerLoopCounter = 0
    OUT:for (let i = 0; i < handsTrimmed.length; i++) {
        let cards = handsTrimmed[i].split(' ')
        let lengthChecker = 0
        for (let j = 0; j < cards.length; j++) {
            let checker = 0
            for (let k = 0; k < possibleDeck.length; k++) {
                if (cards[j] == possibleDeck[k]) {
                    checker++
                }
            }
            if (checker == 0) {
                break OUT
            }
            lengthChecker++
        }
        if (lengthChecker != 5) {
            break OUT
        }
        outerLoopCounter++
    }
    if (outerLoopCounter == handsTrimmed.length) {
        alert(compareHands(finalHands))
    } else {
        alert('Ошибка при создании руки, пожалуйста, введите снова')
    }
}


function getHandDetails(hand) {
    const cards = hand.split(" ")
    const faces = cards.map(a => String.fromCharCode([77 - order.indexOf(a[0])])).sort()
    const suits = cards.map(a => a[1]).sort()
    const counts = faces.reduce(count, {})
    const duplicates = Object.values(counts).reduce(count, {})
    const flush = suits[0] === suits[4]
    const first = faces[0].charCodeAt(0)
    const straight = faces.every((f, index) => f.charCodeAt(0) - first === index)
    let rank =
        (flush && straight && 1) || /* Стрит-флеш, в том числе и флеш-рояль - пять последовательных по номиналу карт одной масти */
        (duplicates[4] && 2) || /* Каре - четыре карты одного номинала */
        (duplicates[3] && duplicates[2] && 3) || /* Фулл-хаус - тройка + пара */
        (flush && 4) || /* Флеш - пять непоследовательных карт одной масти */
        (straight && 5) || /* Стрит - пять разномастных последовательных по номиналу карт */
        (duplicates[3] && 6) || /* Тройка - три карты одного номинала */
        (duplicates[2] > 1 && 7) || /* Две пары */
        (duplicates[2] && 8) || /*Пара - две карты одного номинала */
        9 /* Ни одна из комбинаций выше, просто старшая карта в руке */

    return {rank, value: faces.sort(byCountFirst).join("")}

    function byCountFirst(a, b) {
        //Подсчёт в обратном порядке - чем больше, тем лучше
        const countDiff = counts[b] - counts[a]

        if (countDiff) return countDiff //Если количество не совпадает, возвращаем разницу
        return b > a ? -1 : b === a ? 0 : 1
    }

    function count(c, a) {
        c[a] = (c[a] || 0) + 1
        return c
    }
}

function compareHands(handsArray) {
    let detailsOfArray = handsArray.map(getHandDetails)
    let ranksArray = detailsOfArray.map(array => array.rank)
    ranksArray.sort()
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };
    let highestRanksArray = detailsOfArray.filter(currentValue => currentValue.rank == ranksArray.min())

    function sortByField(field) {
        return (a, b) => a[field] < b[field] ? 1 : -1;
    }

    sortByField(highestRanksArray.value)
    switch (highestRanksArray[0].rank) {
        case 1: {
            return 'Стрит флеш'
            break;
        }
        case 2: {
            return 'Каре'
            break;
        }
        case 3: {
            return 'Фул-хаус'
            break;
        }
        case 4: {
            return 'Флеш'
            break;
        }
        case 5: {
            return 'Стрит'
            break;
        }
        case 6: {
            return 'Тройка'
            break;
        }
        case 7: {
            return 'Две пары'
            break;
        }
        case 8: {
            return 'Пара'
            break;
        }
        case 9: {
            return 'Старшая карта'
            break;
        }
    }

}


function App() {
    const [text, setText] = useState('')
    return (
        <form
            onSubmit={event => {
                event.preventDefault()
                createHands(text)
            }}
        >
            <Container>
                <TextField
                    id="outlined-basic"
                    label="Введите руки через /"
                    variant="outlined"
                    onChange={event => {
                        setText(event.target.value)
                    }}
                />
                <span>Руки: {text}</span>
                <span></span>
            </Container>
        </form>
    );
}

export default App;
