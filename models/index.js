document.addEventListener('DOMContentLoaded', () => {
  const playerElements = document.getElementsByClassName('number-selctor')
  if(playerElements.length !== 0) {
    for (let i=0;i<playerElements.length;i++) {
      playerElements[i].addEventListener('click', function(event){
        board({ playerCount: Number(event.target.innerText)})
      })
    }
  }
})
// initialize Board //
function board(params) {
  const playerCount = params['playerCount']
  const playerSelector = document.getElementById('player-board')
  playerSelector.classList.add('hidden')
  initializeBoard(playerCount)
  initializePlayer(playerCount)
  initializeLadders()
  initializeFixedSnake()
  initializeSnake()
  initializeDice()
}

function initializePlayer(playerCount) {
  for (let i=1; i<=playerCount; i++) {
    let playerElement = document.createElement('p')
    playerElement.classList.add(`player-${i}`)
    playerElement.setAttribute('id', `player-${i}`)
    playerElement.setAttribute(`current-position`, 1)
    const cellPosition = document.getElementById(`c-1`)
    cellPosition.appendChild(playerElement)
  }
}

function initializeBoard(playerCount) {
  let board = document.createElement('div')
  board.classList.add('board')
  board.setAttribute('id', 'snake-board')
  board.setAttribute('player-count', playerCount)
  board.setAttribute('current-player', 1)
  let gridCount = 1 

  for (let n=1;n<=10;n++) {
    let element = document.createElement('div')
    element.setAttribute('id', `grid-element-${n}`)
    element.classList.add('grid-element')
    board.appendChild(element)
  }
  document.body.appendChild(board)

  for (let i=100;i>=1;i--)  {
    const cellGrid = document.getElementById(`grid-element-${gridCount}`)
    const cell = document.createElement('div')
    cell.classList.add(`cell`)
    cell.setAttribute('id', `c-${i}`)
    const cellNumber = document.createElement('p')
    cellNumber.innerText = i
    cell.appendChild(cellNumber)
    cellGrid.appendChild(cell)

    if (cellGrid.childElementCount === 10) {
      gridCount += 1
    }
  }


}
// initialize Board //

function initializeDice() {
  Math.floor(Math.random() * 6) + 1  

  let diceContainer = document.createElement('div')
  diceContainer.classList.add('dice-container')
  diceContainer.classList.add('active')

  let dice = document.createElement('p')
  dice.innerText = 1
  dice.classList.add('dice')
  diceContainer.appendChild(dice)

  dice.addEventListener('click', function(event) {
    event.target.innerText = ''
    event.target.innerHtml = ''
    event.target.classList.add('rolling')

    let diceValue = Math.floor(Math.random() * 6 ) + 1
    event.target.innerText = diceValue
    let audio = new Audio('https://soundbible.com//mp3/Redneck%20Rolls%20Dice-SoundBible.com-1100715950.mp3')
    audio.play()

    setTimeout(function() {
      event.target.classList.remove('rolling')
      diceContainer.classList.remove('active')
      event.target.innerText = diceValue
      const board = document.getElementById('snake-board')
      audio.pause()
      const playerNumber = Number(board.getAttribute('current-player')) % Number(board.getAttribute('player-count')) || Number(board.getAttribute('player-count'))
      console.log(playerNumber)

      const currentPlayer = document.getElementById(`player-${playerNumber}`)
      let newCellPosition = document.getElementById(`c-${diceValue + Number(currentPlayer.getAttribute('current-position'))}`)
      
      if (Number(diceValue) !== 6) {
        board.setAttribute('current-player', Number(board.getAttribute('current-player') ) + 1)
      }

      if (newCellPosition.getAttribute('ladder-start') === 'true' && newCellPosition.getAttribute('end-position')) {
        newCellPosition = document.getElementById(`${newCellPosition.getAttribute('end-position')}`)
      }

      if(newCellPosition.getAttribute('snake-start') &&  newCellPosition.getAttribute('end-position')) {
        newCellPosition = document.getElementById(`${newCellPosition.getAttribute('end-position')}`)
      }

      currentPlayer.parentElement.removeChild(currentPlayer)
      const newCurrentPlayer = document.createElement('p')
      newCurrentPlayer.classList.add(`player-${playerNumber}`)
      newCurrentPlayer.setAttribute('id', `player-${playerNumber}`)
      newCurrentPlayer.setAttribute('current-position', Number(newCellPosition.getAttribute('id').split('-')[1]))
      newCellPosition.appendChild(newCurrentPlayer)

      eliminateAllPlayer(newCellPosition, playerNumber)
    }, 1000)

    setTimeout(function() {
      diceContainer.classList.add('active')
    }, 1200)
  })

  document.body.appendChild(diceContainer)

}

function eliminateAllPlayer(el, param) {
  const playerArray = [1,2,3,4]
  console.log(playerArray.filter(item=> Number(item) !== Number(item)))
  playerArray.filter(item=> item !== param).forEach(item => {
    const elimatingElement = el.getElementsByClassName(`player-${item}`)[0]
    console.log(elimatingElement)
    if (elimatingElement)
      {
        elimatingElement.parentElement.removeChild(elimatingElement)
        let playerElement = document.createElement('p')
        playerElement.classList.add(`player-${item}`)
        playerElement.setAttribute('id', `player-${item}`)
        playerElement.setAttribute(`current-position`, 1)
        const cellPosition = document.getElementById(`c-1`)
        cellPosition.appendChild(playerElement)
      }
  })
}

function initializeSnake() {
 for(let i=8;i>3;i--) {
  let cellS = Math.floor(Math.random() * 17) + (i*10)
  let fixedSanke = document.getElementById(`c-${cellS}`)

  while (fixedSanke.getAttribute('ladder-start') === "true" || fixedSanke.getAttribute('snake-start') === "true") {
    cellS = cellS + (Math.floor(Math.random() * 10 ) + 1)
    fixedSanke = document.getElementById(`c-${cellS}`)
  }

  let cellE = cellS - 10*(Math.floor(Math.random() * 5 ) + 3) - (Math.floor(Math.random() * 9 ) + 1)
  while (cellE < 1) {
    cellE = Number(cellE + 5)
  }
  let fixedSankeEnd = document.getElementById(`c-${cellE}`)

  while (fixedSankeEnd.getAttribute('ladder-start') === "true" || fixedSankeEnd.getAttribute('snake-start') === "true") {
    cellE = cellE + (Math.floor(Math.random() * 10 ) + 1)
      while (cellE < 1) {
        cellE = Number(cellE + 5)
      }
    fixedSankeEnd = document.getElementById(`c-${cellE}`)
  }

  

  fixedSanke.setAttribute('snake-start', true)
  fixedSanke.setAttribute('end-position', fixedSankeEnd.getAttribute('id'))
  fixedSankeEnd.setAttribute('snake-start', true)

  let fixedSankeDimension = getOffset(fixedSanke)
  let fixedSankeEndDimension = getOffset(fixedSankeEnd)
  const bodyDimension = getDocumentHeghtWidth()


  const line = document.createElement('canvas')
  line.classList.add('fixed-canvas')
  document.body.appendChild(line)
  const ctx = line.getContext('2d')
  ctx.moveTo(fixedSankeDimension.right/bodyDimension.width * 300 -(fixedSankeDimension.width/10), fixedSankeDimension.top/bodyDimension.height * 150 +(fixedSankeDimension.height/10)) ;    
  ctx.lineTo(fixedSankeEndDimension.right/bodyDimension.width * 300 -(fixedSankeEndDimension.width/10), fixedSankeEndDimension.top/bodyDimension.height * 150 +(fixedSankeEndDimension.height/10)) ;
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = 1
  ctx.stroke();
 }
}

function initializeFixedSnake() {
  let fixedSanke = document.getElementById(`c-98`)
  let fixedSankeEnd = document.getElementById('c-2')

  fixedSanke.setAttribute('snake-start', true)
  fixedSanke.setAttribute('end-position', 'c-2')
  fixedSankeEnd.setAttribute('snake-start', true)

  let fixedSankeDimension = getOffset(fixedSanke)
  let fixedSankeEndDimension = getOffset(fixedSankeEnd)
  const bodyDimension = getDocumentHeghtWidth()


  const line = document.createElement('canvas')
  line.classList.add('fixed-canvas')
  document.body.appendChild(line)
  const ctx = line.getContext('2d')
  ctx.moveTo(fixedSankeDimension.right/bodyDimension.width * 300 -(fixedSankeDimension.width/10), fixedSankeDimension.top/bodyDimension.height * 150 +(fixedSankeDimension.height/10)) ;    
  ctx.lineTo(fixedSankeEndDimension.right/bodyDimension.width * 300 -(fixedSankeEndDimension.width/10), fixedSankeEndDimension.top/bodyDimension.height * 150 +(fixedSankeEndDimension.height/10)) ;
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = 1
  ctx.stroke();

}

function initializeLadders() {
  for (let i=0;i<6;i++) {
    let cellS = Math.floor(Math.random() * ( i*10 + 20 )) + (2 + i*3)

    let element1 = document.getElementById(`c-${cellS}`)

    while (element1.getAttribute('ladder-start') === "true") {
      cellS = cellS + (Math.floor(Math.random() * 10 ) + 1)
      element1 = document.getElementById(`c-${cellS}`)
    }

    let cellE = cellS + 10*(Math.floor(Math.random() * 5 ) + 1) + (Math.floor(Math.random() * 9 ) + 1)

    
    while (cellE >= 100) {
      cellE = Number(cellE - 10)
    }
    let element2 = document.getElementById(`c-${cellE}`)

    while (element2.getAttribute('ladder-start') === "true") {
      cellE = cellE + (Math.floor(Math.random() * 10 ) + 1)
      while (cellE >= 100) {
        cellE = Number(cellE - 10)
      }
      element2 = document.getElementById(`c-${cellE}`)
    }

    const elem1Dimension = getOffset(element1)
    const elem2Dimension = getOffset(element2)
    const bodyDimension = getDocumentHeghtWidth()

    element1.setAttribute('ladder-start', true)
    element1.setAttribute('end-position', element2.getAttribute('id'))
    element2.setAttribute('ladder-start', true)

    const line = document.createElement('canvas')
    line.classList.add('fixed-canvas')
    document.body.appendChild(line)
    const ctx = line.getContext('2d')
    ctx.moveTo(elem1Dimension.right/bodyDimension.width * 300 -(elem1Dimension.width/10), elem1Dimension.top/bodyDimension.height * 150 +(elem1Dimension.height/10)) ;    
    ctx.lineTo(elem2Dimension.right/bodyDimension.width * 300 -(elem2Dimension.width/10), elem2Dimension.top/bodyDimension.height * 150 +(elem2Dimension.height/10)) ;
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2
    ctx.stroke();
  }
}

function getOffset(el) {
  return el.getBoundingClientRect();
}

function getDocumentHeghtWidth() {
  return document.body.getBoundingClientRect()
}
function initializeGame() {

}