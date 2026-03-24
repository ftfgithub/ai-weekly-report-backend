import { Request } from 'express'

export interface WeeklyReportInput {
  userName: string
  department: string
  weekRange: string
  completedTasks: string
  ongoingTasks: string
  plans: string
  issues: string
  reportStyle: 'professional' | 'concise' | 'detailed'
}

export interface WeeklyReportOutput {
  title: string
  content: string
  timestamp: number
  model: string
}

export interface AuthRequest extends Request {
  user?: any
}

export interface AIProvider {
  name: string
  apiKey: string
  apiUrl: string
  model: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
