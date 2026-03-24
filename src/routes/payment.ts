import { Router, Request, Response } from 'express'
import { paymentService } from '../services/paymentService'
import { authenticate } from '../middleware/auth'
import type { AuthRequest } from '../types'

const router = Router()

router.get('/plans', (_req: Request, res: Response) => {
  try {
    const plans = paymentService.getPlans()
    res.json({
      success: true,
      data: plans
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取套餐列表失败'
    })
  }
})

router.post('/create-order', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { planId, paymentMethod } = req.body

    if (!planId || !paymentMethod) {
      res.status(400).json({
        success: false,
        error: '请选择套餐和支付方式'
      })
      return
    }

    if (!['alipay', 'wechat'].includes(paymentMethod)) {
      res.status(400).json({
        success: false,
        error: '不支持的支付方式'
      })
      return
    }

    const order = await paymentService.createOrder(req.user.id, planId, paymentMethod)

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('创建订单错误:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '创建订单失败'
    })
  }
})

router.get('/order/:orderId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params
    const order = paymentService.getOrder(orderId)

    if (!order) {
      res.status(404).json({
        success: false,
        error: '订单不存在'
      })
      return
    }

    if (order.userId !== req.user.id) {
      res.status(403).json({
        success: false,
        error: '无权访问该订单'
      })
      return
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取订单失败'
    })
  }
})

router.get('/orders', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = paymentService.getUserOrders(req.user.id)
    res.json({
      success: true,
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取订单列表失败'
    })
  }
})

router.post('/notify/alipay', async (req: Request, res: Response): Promise<void> => {
  try {
    const { out_trade_no } = req.body

    if (!out_trade_no) {
      res.status(400).json({ success: false })
      return
    }

    await paymentService.handlePaymentNotify(out_trade_no, 'alipay')

    res.json({ success: true })
  } catch (error) {
    console.error('支付宝回调错误:', error)
    res.status(500).json({ success: false })
  }
})

router.post('/notify/wechat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { out_trade_no } = req.body

    if (!out_trade_no) {
      res.status(400).json({ success: false })
      return
    }

    await paymentService.handlePaymentNotify(out_trade_no, 'wechat')

    res.json({ success: true })
  } catch (error) {
    console.error('微信支付回调错误:', error)
    res.status(500).json({ success: false })
  }
})

export default router
