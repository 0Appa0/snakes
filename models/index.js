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
  // debugger
  initializeBoard(playerCount)
  // initializeSnake()
  initializeLadders()
  // initializeGame()
  initializeDice()
}


function initializeBoard(playerCount) {
  let board = document.createElement('div')
  board.classList.add('board')
  board.setAttribute('player-count', playerCount)
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
  let diceContainer = document.createElement('div')
  diceContainer.classList.add('dice-container')
  diceContainer.classList.add('active')

  let dice = document.createElement('div')

  document.body.appendChild(diceContainer)


}
function initializeSnake() {

}

function initializeLadders() {
  const element1 = document.getElementById('c-100')
  const element2 = document.getElementById('c-1')
  const elem1Dimension = getOffset(element1)
  const elem2Dimension = getOffset(element2)
  const bodyDimension = getDocumentHeghtWidth()

  element2.setAttribute('ladder-start', true)
  element2.setAttribute('end-position', 'c-33')

  const line = document.createElement('canvas')
  line.classList.add('fixed-canvas')
  document.body.appendChild(line)
  console.log(elem1Dimension, elem2Dimension, bodyDimension)
  const ctx = line.getContext('2d')
  ctx.moveTo(65, 55);    
  ctx.lineTo(150, 200);
  ctx.stroke();
}

function getOffset(el) {
  return el.getBoundingClientRect();
}

function getDocumentHeghtWidth() {
  return document.body.getBoundingClientRect()
}
function initializeGame() {

}