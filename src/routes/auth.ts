import { Router, Request, Response } from 'express'
import { userService } from '../services/userService'
import type { RegisterInput, LoginInput } from '../types/user'

const router = Router()

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const input: RegisterInput = req.body

    if (!input.email || !input.password || !input.name) {
      res.status(400).json({
        success: false,
        error: '请填写完整信息'
      })
      return
    }

    if (!input.email.includes('@')) {
      res.status(400).json({
        success: false,
        error: '邮箱格式不正确'
      })
      return
    }

    if (input.password.length < 6) {
      res.status(400).json({
        success: false,
        error: '密码长度至少为6位'
      })
      return
    }

    const result = await userService.register(input)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '注册失败'
    })
  }
})

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const input: LoginInput = req.body

    if (!input.email || !input.password) {
      res.status(400).json({
        success: false,
        error: '请填写邮箱和密码'
      })
      return
    }

    const result = await userService.login(input)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : '登录失败'
    })
  }
})

export default router
