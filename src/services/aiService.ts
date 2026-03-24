import axios from 'axios'
import type { AIProvider, ChatMessage, ChatResponse } from '../types'

class AIService {
  private providers: Map<string, AIProvider>

  constructor() {
    this.providers = new Map()
    this.initializeProviders()
  }

  private initializeProviders() {
    const qwenApiKey = process.env.QWEN_API_KEY
    const qwenApiUrl = process.env.QWEN_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1'

    const zhipuApiKey = process.env.ZHIPU_API_KEY
    const zhipuApiUrl = process.env.ZHIPU_API_URL || 'https://open.bigmodel.cn/api/paas/v4'

    const deepseekApiKey = process.env.DEEPSEEK_API_KEY
    const deepseekApiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1'

    if (qwenApiKey) {
      this.providers.set('qwen', {
        name: '通义千问',
        apiKey: qwenApiKey,
        apiUrl: qwenApiUrl,
        model: 'qwen-turbo'
      })
    }

    if (zhipuApiKey) {
      this.providers.set('zhipu', {
        name: '智谱AI',
        apiKey: zhipuApiKey,
        apiUrl: zhipuApiUrl,
        model: 'glm-4-flash'
      })
    }

    if (deepseekApiKey) {
      this.providers.set('deepseek', {
        name: 'DeepSeek',
        apiKey: deepseekApiKey,
        apiUrl: deepseekApiUrl,
        model: 'deepseek-chat'
      })
    }
  }

  private getProvider(providerName?: string): AIProvider {
    const defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'qwen'
    const providerNameToUse = providerName || defaultProvider

    const provider = this.providers.get(providerNameToUse)

    if (!provider) {
      throw new Error(`AI provider ${providerNameToUse} not configured. Please check your environment variables.`)
    }

    return provider
  }

  async generateChat(messages: ChatMessage[], providerName?: string): Promise<string> {
    const provider = this.getProvider(providerName)

    try {
      const response = await axios.post<ChatResponse>(
        `${provider.apiUrl}/chat/completions`,
        {
          model: provider.model,
          messages,
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${provider.apiKey}`
          },
          timeout: 30000
        }
      )

      const content = response.data.choices[0]?.message?.content || ''

      if (!content) {
        throw new Error('AI returned empty response')
      }

      return content
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message || error.message
        throw new Error(`AI API error: ${errorMessage}`)
      }
      throw error
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  isProviderAvailable(providerName: string): boolean {
    return this.providers.has(providerName)
  }
}

export const aiService = new AIService()
