import { aiService } from './aiService'
import type { WeeklyReportInput, WeeklyReportOutput, ChatMessage } from '../types'

class WeeklyReportService {
  private generatePrompt(input: WeeklyReportInput): string {
    const styleMap = {
      professional: '专业正式',
      concise: '简洁明了',
      detailed: '详细全面'
    }

    return `请根据以下信息生成一份${styleMap[input.reportStyle]}的周报：

姓名：${input.userName}
部门：${input.department}
周期：${input.weekRange}

本周完成工作：
${input.completedTasks}

进行中工作：
${input.ongoingTasks || '无'}

下周计划：
${input.plans}

遇到的问题：
${input.issues || '无'}

要求：
1. 格式清晰，分段合理
2. 语言专业，用词准确
3. 突出重点和成果
4. 体现工作价值
5. 使用markdown格式
6. 包含工作总结和亮点

请直接输出周报内容，不要包含其他说明。`
  }

  async generateReport(input: WeeklyReportInput, provider?: string): Promise<WeeklyReportOutput> {
    const prompt = this.generatePrompt(input)

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一位专业的周报写作助手，擅长将工作内容整理成结构清晰、语言专业的周报。生成的周报应该突出工作成果和价值，使用markdown格式。'
      },
      {
        role: 'user',
        content: prompt
      }
    ]

    try {
      const content = await aiService.generateChat(messages, provider)

      return {
        title: `${input.userName} - ${input.weekRange} 周报`,
        content,
        timestamp: Date.now(),
        model: provider || process.env.DEFAULT_AI_PROVIDER || 'qwen'
      }
    } catch (error) {
      throw new Error(`生成周报失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  validateInput(input: WeeklyReportInput): { valid: boolean; error?: string } {
    if (!input.userName?.trim()) {
      return { valid: false, error: '姓名不能为空' }
    }

    if (!input.department?.trim()) {
      return { valid: false, error: '部门不能为空' }
    }

    if (!input.weekRange?.trim()) {
      return { valid: false, error: '周期不能为空' }
    }

    if (!input.completedTasks?.trim()) {
      return { valid: false, error: '本周完成工作不能为空' }
    }

    if (!input.plans?.trim()) {
      return { valid: false, error: '下周计划不能为空' }
    }

    return { valid: true }
  }
}

export const weeklyReportService = new WeeklyReportService()
