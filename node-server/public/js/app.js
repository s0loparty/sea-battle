import uuidv4 from "./helpers.js"

const socket = io(location.origin.replace('5500', '5000'))

document.addEventListener('DOMContentLoaded', () => {
	const UUID = uuidv4() 

	createCell()

	const PLAYER_ITEMS = document.querySelectorAll('.space__box--player .space__fight-item')
	const ENEMY_ITEMS = document.querySelectorAll('.space__box--enemy .space__fight-item')

	PLAYER_ITEMS.forEach((item, idx) => {
		const cellId = idx + 1
		item.dataset.cellPlayerId = cellId
	})

	ENEMY_ITEMS.forEach((item, idx) => {
		const cellId = idx + 1
		item.dataset.cellEnemyId = cellId

		item.addEventListener('click', () => {
         if (item.dataset.hasClicked) return
         
			socket.emit('shot', { cellId, uuid: UUID })
         item.dataset.hasClicked = true
			showShot(cellId, 'enemy')
		})
	})

	socket.on('shot', payload => {
		showShot(payload.cellId, 'player')
	})

   socket.on('exit', () => {
      console.log('emited exit')
      clearSpaces()
   })
})

function createCell() {
	const listEnemy = document.querySelector('.space__box--enemy .space__fight-list')
	const listPlayer = document.querySelector('.space__box--player .space__fight-list')
	
	for (let index = 0; index < 100; index++) {
		const cell = document.createElement('div')
		cell.classList.add('space__fight-item')
		listEnemy.append(cell)
	}

	for (let index = 0; index < 100; index++) {
		const cell = document.createElement('div')
		cell.classList.add('space__fight-item')
		listPlayer.append(cell)
	}
}
function showShot(cellId, type = 'enemy') {
	const classes = ['space__fight-item--miss', 'space__fight-item--damage', 'space__fight-item--killed']
	const target = document.querySelector(`.space__fight-item[data-cell-${type}-id="${cellId}"]`)
	target.classList.add(classes[Math.floor(Math.random() * classes.length)])
}
function clearSpaces() {
   document.querySelectorAll('.space__fight-item').forEach(cell => {
      cell.className = 'space__fight-item'
      delete cell.dataset.hasClicked
   })
}
