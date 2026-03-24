import { Router, Request, Response } from 'express'
import { weeklyReportService } from '../services/weeklyReportService'
import { aiService } from '../services/aiService'
import { authenticate, checkUsageLimit, trackUsage } from '../middleware/auth'
import type { WeeklyReportInput, AuthRequest } from '../types'

const router = Router()

router.post('/generate', authenticate, checkUsageLimit, trackUsage, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const input: WeeklyReportInput = req.body

    const validation = weeklyReportService.validateInput(input)
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        error: validation.error
      })
      return
    }

    const provider = req.body.provider || undefined
    const report = await weeklyReportService.generateReport(input, provider)

    res.json({
      success: true,
      data: report
    })
  } catch (error) {
    console.error('生成周报错误:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '生成周报失败，请稍后重试'
    })
  }
})

router.get('/providers', (_req: Request, res: Response) => {
  try {
    const providers = aiService.getAvailableProviders()
    res.json({
      success: true,
      data: providers
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取 AI 提供商列表失败'
    })
  }
})

router.post('/validate', (req: Request, res: Response) => {
  try {
    const input: WeeklyReportInput = req.body
    const validation = weeklyReportService.validateInput(input)

    res.json({
      success: true,
      data: validation
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '验证输入失败'
    })
  }
})

export default router
