import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorHandler from './middleware/errorHandler'
import connectToDatabase from './config/db'
import authRoutes from './routes/auth.route'
import authenticate from './middleware/authenticate'
import userRoutes from './routes/user.route'
import sessionRoutes from './routes/session.route'

import { PORT, NODE_ENV, APP_ORIGIN } from './constants/env'
import { OK } from './constants/http'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true
  })
)
app.use(cookieParser())

app.get('/health', (req, res, next) => {
  return res.status(OK).json({
    status: 'healthy'
  })
})

// auth routes
app.use('/auth', authRoutes)

// protected routes
app.use('/user', authenticate, userRoutes)
app.use('/sessions', authenticate, sessionRoutes)

app.use(errorHandler)

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment.`)
  await connectToDatabase()
})
