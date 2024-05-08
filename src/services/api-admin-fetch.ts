import api from '@/services/api'
import { Pagination } from '@/interfaces/common.interface'

interface ChatMessageResponse extends Pagination {
  chatMessages: any[]
}

export async function fetchGetChatMessageList(
  condition = {},
  opts = {},
): Promise<ChatMessageResponse> {
  const { data: response } = await api.post(`/chat-message/list`, {
    condition,
    opts,
  })
  return response
}
