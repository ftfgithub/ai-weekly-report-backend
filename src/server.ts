import dotenv from 'dotenv'
import app from './config/app'
import weeklyReportRoutes from './routes/weeklyReport'
import authRoutes from './routes/auth'
import paymentRoutes from './routes/payment'

dotenv.config()

const PORT = process.env.PORT || 3001

app.use('/api/weekly-report', weeklyReportRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/payment', paymentRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在'
  })
})

app.use((err: Error, req: any, res: any, next: any) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message
  })
})

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🤖 可用的 AI 提供商: ${process.env.DEFAULT_AI_PROVIDER || 'qwen'}`)
})
