export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: number
  updatedAt: number
  usageCount: number
  lastResetDate: number
  plan: 'free' | 'monthly' | 'yearly' | 'enterprise'
  planExpireAt?: number
}

export interface RegisterInput {
  email: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  token: string
}

export interface UsageStats {
  count: number
  limit: number
  remaining: number
  resetTime: number
}

export interface PaymentPlan {
  id: string
  name: string
  price: number
  duration: number
  features: string[]
  isPopular?: boolean
}

export interface PaymentOrder {
  id: string
  userId: string
  planId: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  createdAt: number
  paidAt?: number
  paymentMethod: 'alipay' | 'wechat'
  paymentUrl?: string
}
