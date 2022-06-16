import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'

const app = express()
app.use(express.static('public'))

const httpServer = createServer(app)
const io = new Server(httpServer, {
   cors: {
      origin: ['http://localhost:5500', 'http://127.0.0.1:5500']
   }
})

const HTTP_PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
   res.sendFile(path.resolve() + '/public/index.html')
})

io.on('connection', socket => {
   console.log('socket id:', socket.id)

   socket.on('shot', payload => {
      socket.broadcast.emit('shot', payload)
      console.log('payload:', payload);
   })
})

httpServer.listen(HTTP_PORT, () =>
   console.log(`Server started on port ${HTTP_PORT}`)
)
