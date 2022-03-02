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
			socket.emit('shot', { cellId, uuid: UUID })
			showShot(cellId, 'enemy')
		})
	})

	socket.on('shot', payload => {
		showShot(payload.cellId, 'player')
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
function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}
