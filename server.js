'use strict'

const express = require('express')
const socketIO = require('socket.io')

const PORT = process.env.PORT || 3000
const INDEX = '/index.html'

const server = express()
	.use((req, res) => res.sendFile(INDEX, {
		root: __dirname
	}))
	.listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = socketIO(server)

// private messages
// https://socket.io/get-started/private-messaging-part-1/#private-messaging
io.on('connection', socket => {
	console.log('Client connected')

	console.log('id: ', socket.id)
	console.log('rooms: ', socket.adapter.rooms)
	console.log('sids: ', socket.adapter.sids)

	socket.on('chat message', msg => io.emit('chat message', msg))
	socket.on('disconnect', () => console.log('Client disconnected'))
})
