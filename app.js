const socket = io(location.origin.replace('5500', '5000'))

document.addEventListener('DOMContentLoaded', () => {
	const PLAYER_ITEMS = document.querySelectorAll('.space__box--player .space__fight-item')
	const ENEMY_ITEMS = document.querySelectorAll('.space__box--enemy .space__fight-item')
	const UUID = uuidv4() 

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
