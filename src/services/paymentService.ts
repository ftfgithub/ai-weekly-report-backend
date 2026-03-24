import type { PaymentPlan, PaymentOrder } from '../types/user'

class PaymentService {
  private orders: Map<string, PaymentOrder> = new Map()
  private plans: PaymentPlan[] = []

  constructor() {
    this.initializePlans()
  }

  private initializePlans() {
    this.plans = [
      {
        id: 'monthly',
        name: '月度会员',
        price: 9.9,
        duration: 30,
        features: [
          '无限次生成周报',
          '优先客服支持',
          '导出 PDF/Word',
          '历史记录保存'
        ],
        isPopular: true
      },
      {
        id: 'yearly',
        name: '年度会员',
        price: 99,
        duration: 365,
        features: [
          '无限次生成周报',
          '优先客服支持',
          '导出 PDF/Word/Excel',
          '历史记录保存',
          '团队协作功能',
          '自定义模板'
        ]
      },
      {
        id: 'enterprise',
        name: '企业版',
        price: 999,
        duration: 365,
        features: [
          '无限次生成周报',
          '专属客服支持',
          '导出 PDF/Word/Excel',
          '历史记录保存',
          '团队协作功能',
          '自定义模板',
          'API 接口访问',
          '数据分析报表',
          '私有化部署支持'
        ]
      }
    ]
  }

  private generateOrderId(): string {
    return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  getPlans(): PaymentPlan[] {
    return this.plans
  }

  getPlanById(planId: string): PaymentPlan | undefined {
    return this.plans.find(plan => plan.id === planId)
  }

  async createOrder(userId: string, planId: string, paymentMethod: 'alipay' | 'wechat'): Promise<PaymentOrder> {
    const plan = this.getPlanById(planId)

    if (!plan) {
      throw new Error('套餐不存在')
    }

    const orderId = this.generateOrderId()

    const order: PaymentOrder = {
      id: orderId,
      userId,
      planId,
      amount: plan.price,
      status: 'pending',
      createdAt: Date.now(),
      paymentMethod
    }

    this.orders.set(orderId, order)

    const paymentUrl = await this.generatePaymentUrl(order, paymentMethod)

    order.paymentUrl = paymentUrl

    return order
  }

  private async generatePaymentUrl(order: PaymentOrder, paymentMethod: 'alipay' | 'wechat'): Promise<string> {
    if (paymentMethod === 'alipay') {
      return this.generateAlipayUrl(order)
    } else {
      return this.generateWechatUrl(order)
    }
  }

  private async generateAlipayUrl(order: PaymentOrder): Promise<string> {
    const plan = this.getPlanById(order.planId)

    if (!plan) {
      throw new Error('套餐不存在')
    }

    const params = new URLSearchParams({
      out_trade_no: order.id,
      total_amount: order.amount.toString(),
      subject: `AI周报生成器 - ${plan.name}`,
      body: `购买${plan.name}`,
      product_code: 'FAST_INSTANT_TRADE_PAY'
    })

    const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`
    const apiUrl = `${process.env.API_URL || 'http://localhost:3001'}/api/payment/notify/alipay`

    params.append('return_url', returnUrl)
    params.append('notify_url', apiUrl)

    const sign = await this.signAlipayParams(params)
    params.append('sign', sign)

    return `https://openapi.alipay.com/gateway.do?${params.toString()}`
  }

  private async generateWechatUrl(order: PaymentOrder): Promise<string> {
    const plan = this.getPlanById(order.planId)

    if (!plan) {
      throw new Error('套餐不存在')
    }

    const params = {
      out_trade_no: order.id,
      total_fee: order.amount,
      body: `AI周报生成器 - ${plan.name}`,
      trade_type: 'NATIVE',
      notify_url: `${process.env.API_URL || 'http://localhost:3001'}/api/payment/notify/wechat`
    }

    return `https://api.mch.weixin.qq.com/pay/unifiedorder?${JSON.stringify(params)}`
  }

  private async signAlipayParams(_params: URLSearchParams): Promise<string> {
    return 'mock-signature'
  }

  async handlePaymentNotify(orderId: string, _paymentMethod: 'alipay' | 'wechat'): Promise<boolean> {
    const order = this.orders.get(orderId)

    if (!order) {
      throw new Error('订单不存在')
    }

    if (order.status === 'paid') {
      return true
    }

    order.status = 'paid'
    order.paidAt = Date.now()

    this.orders.set(orderId, order)

    return true
  }

  getOrder(orderId: string): PaymentOrder | undefined {
    return this.orders.get(orderId)
  }

  getUserOrders(userId: string): PaymentOrder[] {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }
}

export const paymentService = new PaymentService()
