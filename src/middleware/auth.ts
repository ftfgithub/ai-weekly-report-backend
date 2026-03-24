import { Request, Response, NextFunction } from 'express'
import { userService } from '../services/userService'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json({
        success: false,
        error: '未提供认证令牌'
      })
      return
    }

    const decoded = userService.verifyToken(token)
    const user = userService.getUserById(decoded.userId)

    if (!user) {
      res.status(401).json({
        success: false,
        error: '用户不存在'
      })
      return
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

export const checkUsageLimit = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '未认证'
      })
      return
    }

    const canUse = userService.canUseService(req.user)

    if (!canUse) {
      const limit = userService.getUsageLimit(req.user)
      res.status(429).json({
        success: false,
        error: '今日使用次数已达上限',
        data: {
          usageCount: req.user.usageCount,
          limit,
          resetTime: new Date(req.user.lastResetDate + 24 * 60 * 60 * 1000).toISOString()
        }
      })
      return
    }

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '检查使用限制失败'
    })
  }
}

export const trackUsage = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
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
