import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

const app = express()

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3002']

app.use(cors({
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      console.log('Allowed origins:', allowedOrigins)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(helmet({
  contentSecurityPolicy: false
}))

app.use(compression())

app.use(express.json({ limit: '10mb' }))

app.use(express.urlencoded({ extended: true, limit: '10mb' }))

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'dev' : 'combined'))
}

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true,
  legacyHeaders: false
})

app.use('/api/', limiter)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'AI Weekly Report Generator')
  next()
})

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

export default app
