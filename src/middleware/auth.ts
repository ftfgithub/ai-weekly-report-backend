import { Request, Response, NextFunction } from 'express'
import { userService } from '../services/userService'

interface AuthRequest extends Request {
  user?: any
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        error: '未提供认证令牌'
      })
    }

    const decoded = userService.verifyToken(token)
    const user = userService.getUserById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户不存在'
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: '认证失败'
    })
  }
}

export const checkUsageLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '未认证'
      })
    }

    const canUse = userService.canUseService(req.user)

    if (!canUse) {
      const limit = userService.getUsageLimit(req.user)
      return res.status(429).json({
        success: false,
        error: '今日使用次数已达上限',
        data: {
          usageCount: req.user.usageCount,
          limit,
          resetTime: new Date(req.user.lastResetDate + 24 * 60 * 60 * 1000).toISOString()
        }
      })
    }

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '检查使用限制失败'
    })
  }
}

export const trackUsage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await userService.incrementUsage(req.user.id)
    }
    next()
  } catch (error) {
    console.error('跟踪使用次数失败:', error)
    next()
  }
}
