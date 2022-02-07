const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let wordle

const getWordle = () => {
    fetch('/word')
        .then(response => response.json())
        .then(json => {
            const minute = 1000*60
            const hour = minute * 60
            const day = hour * 24
            let currDay = Math.round(Date.now()/day) % json.length
            wordle = '$' + json[currDay]
            console.log(wordle)
        })
        .catch(err => console.log(err)) 
}
getWordle()

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '«',
]
const guessRows = [
    ['$', '', '', '', ''],
    ['$', '', '', '', ''],
    ['$','', '', '', ''],
    ['$','', '', '', ''],
    ['$','', '', '', ''],
    ['$','', '', '', '']
]

const final_Rows = 
[
    ['b', 'b', 'b', 'b', 'b'],
    ['b', 'b', 'b', 'b', 'b'],
    ['b', 'b', 'b', 'b', 'b'],
    ['b', 'b', 'b', 'b', 'b'],
    ['b', 'b', 'b', 'b', 'b'],
    ['b', 'b', 'b', 'b', 'b'],
]
let currentRow = 0
let currentTile = 1
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
})

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

document.addEventListener('keydown', (event) =>{
    if (event.key.toUpperCase() === 'BACKSPACE'){
        handleClick('«')
    } else if (keys.includes(event.key.toUpperCase())){
        handleClick(event.key.toUpperCase())
    }
})

const handleClick = (letter) => {
    if (!isGameOver) {
        if (letter === '«' || letter === 'BACKSPACE') {
            deleteLetter()
            return
        }
        if (letter === 'ENTER') {
            checkRow()
            return
        }
        addLetter(letter)
    }
}

const addLetter = (letter) => {
    if (currentTile === 1){
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + 0)
        tile.textContent = '$'
        guessRows[currentRow][currentTile] = '$'
        tile.setAttribute('data', '$')
    }

    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}

const deleteLetter = () => {
    if (currentTile > 1) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('').substring(1)
    if (currentTile > 4) {
        fetch(`/check/?word=${guess}`)
            .then(response => response.json())
            .then(json => {
                if (json == 'Symbol not found') {
                    showMessage('Symbol not in list')
                    return
                } else {
                    flipTile()
                    if (wordle == ('$' + guess)) {
                        winMessage("$$$")
                        isGameOver = true
                        return
                    } else {
                        if (currentRow >= 5) {
                            isGameOver = true
                            loseMessage('Game Over')
                            return
                        }
                        if (currentRow < 5) {
                            currentRow++
                            currentTile = 1
                        }
                    }
                }
            }).catch(err => console.log(err))
    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 10000)
}



const loseMessage = (message) => {
    const outerDiv = document.createElement('div');
    const innerDiv = document.createElement('div');
    const onclickDiv = document.createElement('button');
    let str_cont = "Bankrupt... \n" + (currentRow + 1) + "/" + "6 \n" 
    for (let g = 0; g <= currentRow; g++){
        for (let j = 0; j < 5; j++){
            if (final_Rows[g][j] === 'b'){
                str_cont += '⬛ '
            } else if (final_Rows[g][j] === 'bl'){
                str_cont += '🟦 '
            } else {
                str_cont += '🟩 '
            }
        }
        str_cont += '\n'
    }
    innerDiv.textContent = str_cont
    onclickDiv.textContent = "Copy to clipboard"
    outerDiv.appendChild(innerDiv);
    outerDiv.appendChild(onclickDiv)
    outerDiv.style.justifyContent = 'center'
    innerDiv.style.justifyContent = 'center'
    innerDiv.style.textAlign = 'center'
    innerDiv.style.top = '20%'
    onclickDiv.style.textAlign = 'center'
    outerDiv.style.whiteSpace = "pre-wrap"
    innerDiv.style.whiteSpace = "pre-wrap"
    onclickDiv.style.whiteSpace = 'pre-wrap'
    outerDiv.style.textAlign = 'center'
    innerDiv.style.fontSize = 'x-large'
    outerDiv.style.textAlign = 'x-large'
    onclickDiv.style.textAlign = 'x-large'
    innerDiv.style.color = "#000000";
    onclickDiv.style.color = "#000000";
    outerDiv.style.zIndex = '1000';
    outerDiv.style.height = '30%';
    outerDiv.style.width = '40%';
    outerDiv.style.position = 'fixed';
    outerDiv.style.left = '30%';
    outerDiv.style.top = '35%';
    outerDiv.style.overflow = 'auto';
    outerDiv.style.outlineColor = "#FF0000"
    outerDiv.style.backgroundColor = 'rgba(255,255,255,0.85)';
    onclickDiv.onclick = function copy(){
        var dummy = document.createElement("textarea")
        document.body.appendChild(dummy)
        dummy.value = str_cont
        dummy.select()
        document.execCommand("copy")
        document.body.removeChild(dummy)
    }
    outerDiv.style.display = 'block';
    setTimeout(() => messageDisplay.append(outerDiv), 3000)
}

const winMessage = (message) => {
    const outerDiv = document.createElement('div');
    const innerDiv = document.createElement('div');
    const onclickDiv = document.createElement('button');
    const closeDiv = document.createElement('button');
    let str_cont = "Stockle ... \n" + (currentRow + 1) + "/" + "6 \n" 
    for (let g = 0; g <= currentRow; g++){
        for (let j = 0; j < 5; j++){
            if (final_Rows[g][j] === 'b'){
                str_cont += '⬛ '
            } else if (final_Rows[g][j] === 'bl'){
                str_cont += '🟦 '
            } else {
                str_cont += '🟩 '
            }
        }
        str_cont += '\n'
    }
    closeDiv.style.position = 'absolute'
    closeDiv.style.backgroundColor = 'red'
    closeDiv.style.color = 'white'
    closeDiv.style.top = '-10px'
    closeDiv.style.right = '-10px'
    innerDiv.textContent = str_cont
    onclickDiv.textContent = "Copy to clipboard"
    outerDiv.appendChild(innerDiv);
    outerDiv.appendChild(onclickDiv)
    outerDiv.appendChild(closeDiv)
    outerDiv.style.justifyContent = 'center'
    innerDiv.style.justifyContent = 'center'
    innerDiv.style.textAlign = 'center'
    innerDiv.style.top = '20%'
    onclickDiv.style.textAlign = 'center'
    outerDiv.style.whiteSpace = "pre-wrap"
    innerDiv.style.whiteSpace = "pre-wrap"
    onclickDiv.style.whiteSpace = 'pre-wrap'
    outerDiv.style.textAlign = 'center'
    innerDiv.style.fontSize = 'x-large'
    outerDiv.style.textAlign = 'x-large'
    onclickDiv.style.textAlign = 'x-large'
    innerDiv.style.color = "#000000";
    onclickDiv.style.color = "#000000";
    outerDiv.style.zIndex = '1000';
    outerDiv.style.height = '30%';
    outerDiv.style.width = '40%';
    outerDiv.style.position = 'fixed';
    outerDiv.style.left = '30%';
    outerDiv.style.top = '35%';
    outerDiv.style.overflow = 'auto';
    outerDiv.style.outlineColor = "#FF0000"
    outerDiv.style.backgroundColor = 'rgba(255,255,255,0.85)';
    onclickDiv.onclick = function copy(){
        var dummy = document.createElement("textarea")
        document.body.appendChild(dummy)
        dummy.value = str_cont
        dummy.select()
        document.execCommand("copy")
        document.body.removeChild(dummy)
    }

    closeDiv.onclick = function close(){
        messageDisplay.removeChild(outerDiv)
    }
    outerDiv.style.display = 'block';
    setTimeout(() => messageDisplay.append(outerDiv), 3000)
}

const addColorToKey = (keyLetter, color) => {
    if (keyLetter !== '$'){
        const key = document.getElementById(keyLetter)
        key.classList.add(color)
    }
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })


    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            final_Rows[currentRow][index] = 'g'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach((guess, index) => {
        if (checkWordle.includes(guess.letter)) {
            final_Rows[currentRow][index] = 'bl'
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}
