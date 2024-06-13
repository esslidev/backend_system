import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { authMiddleware, integrationAuthMiddleware } from './middlewares/authMidleware'
import authRoutes from './routes/authRoutes'
import { configDotenv } from 'dotenv'
import userRoutes from './routes/userRoutes'

configDotenv({ path: __dirname + '../../../.env' })

const app = express()
const port = process.env.HTTP_PORT || 4000

console.log(process.env.HTTP_PORT)

// remember to strict the cors in production
const corOptions = {
  origin: ['http://esslidev.dev', 'http://localhost:3000', 'http://localhost:3100','*'],
}

// this part is for initiating the socket.io
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: corOptions,
})

app.use(cors(corOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', integrationAuthMiddleware, authRoutes)
app.use('/api/users', authMiddleware, userRoutes)

app.get('/', async (req, res, next) => {
  res.send({ message: '🚀 API ready to serve! 🚀' })
})

httpServer.listen(port, () => console.log(`🚀 API istening at http://localhost:${port} 🚀`))
