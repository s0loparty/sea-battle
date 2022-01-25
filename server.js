'use strict'

const express = require('express')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000

const MY_ROOMS = ['room 1', 'room 2']

const server = express()
	.use((req, res) => res.sendFile('/index.html', { root: __dirname }))
	.listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = socketIO(server)

// private messages
// https://socket.io/get-started/private-messaging-part-1/#private-messaging
io.on('connection', socket => {
	console.log('Client connected')

	// console.log(socket)

	// console.log('id: ', socket.id)
	// console.log('rooms: ', socket.adapter.rooms)
	// console.log('sids: ', socket.adapter.sids)

	// просто сообщения
	socket.on('chat message', msg => io.emit('chat message', msg))

	socket.on('zashel_v_hatu', ({ room }) => {
		socket.join(room)
	})

	// users count
	io.emit('count_users', socket.conn.server.clientsCount)

	// io.emit(...) - отправить всем
	// socket.broadcast.emit(...) - отпраить всем кроме подключившегося

	// уведомляем всех о новом подключении
	socket.broadcast.emit('info_message', {type: 'connected'})

	// дискотнкт
	socket.on('disconnect', () => {
		console.log('Client disconnected')

		// уведомляем всех о дисконекте
		socket.broadcast.emit('info_message', {type: 'disconnected'})

		// users count
		io.emit('count_users', socket.conn.server.clientsCount)
	})

	io.emit('send_rooms', {my_rooms: MY_ROOMS, io: Object.keys(socket.adapter.rooms)})
})
