import http       from 'http'
import cors       from 'cors'
import express    from 'express'
import { Server } from 'socket.io'

const corsConfig = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: 'http://localhost:3000'
}

const app = express()
const server = http.Server(app)

const io = new Server(server, {
  cors: corsConfig
})

app.use(cors(corsConfig))

io.on('connection', (socket) => {
  io.emit('channels.channels-received', {
    payload: [
      {
        id: 'test'
      }
    ]
  })
})

server.listen(6868)
