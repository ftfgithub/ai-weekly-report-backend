import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { User, RegisterInput, LoginInput, AuthResponse } from '../types/user'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

class UserService {
  private users: Map<string, User> = new Map()

  constructor() {
    this.initializeDefaultAdmin()
  }

  private initializeDefaultAdmin() {
    const adminEmail = 'admin@example.com'
    if (!this.users.has(adminEmail)) {
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      const adminUser: User = {
        id: this.generateId(),
        email: adminEmail,
        password: hashedPassword,
        name: '管理员',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        usageCount: 0,
        lastResetDate: Date.now(),
        plan: 'free'
      }
      this.users.set(adminEmail, adminUser)
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private isSameDay(date1: number, date2: number): boolean {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    if (this.users.has(input.email)) {
      throw new Error('该邮箱已被注册')
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user: User = {
      id: this.generateId(),
      email: input.email,
      password: hashedPassword,
      name: input.name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageCount: 0,
      lastResetDate: Date.now(),
      plan: 'free'
    }

    this.users.set(input.email, user)

    const token = this.generateToken(user)

    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token
    }
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = this.users.get(input.email)

    if (!user) {
      throw new Error('邮箱或密码错误')
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password)

    if (!isValidPassword) {
      throw new Error('邮箱或密码错误')
    }

    const token = this.generateToken(user)

    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token
    }
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      plan: user.plan
    }

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      throw new Error('无效的令牌')
    }
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.get(email)
  }

  getUserById(id: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user
      }
    }
    return undefined
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const user = this.getUserById(userId)

    if (!user) {
      throw new Error('用户不存在')
    }

    const updatedUser = { ...user, ...updates, updatedAt: Date.now() }
    this.users.set(user.email, updatedUser)

    return updatedUser
  }

  async incrementUsage(userId: string): Promise<User> {
    const user = this.getUserById(userId)

    if (!user) {
      throw new Error('用户不存在')
    }

    const now = Date.now()

    if (!this.isSameDay(now, user.lastResetDate)) {
      user.usageCount = 0
      user.lastResetDate = now
    }

    user.usageCount += 1
    user.updatedAt = now

    this.users.set(user.email, user)

    return user
  }

  getUsageLimit(user: User): number {
    const limits = {
      free: 3,
      monthly: Infinity,
      yearly: Infinity,
      enterprise: Infinity
    }
    return limits[user.plan] || 3
  }

  canUseService(user: User): boolean {
    const now = Date.now()

    if (!this.isSameDay(now, user.lastResetDate)) {
      return true
    }

    return user.usageCount < this.getUsageLimit(user)
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }
}

export const userService = new UserService()
