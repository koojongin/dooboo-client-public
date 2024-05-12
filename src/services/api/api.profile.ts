import api from '@/services/api'

export async function fetchWriteProfileComment(
  characterId: string,
  data: { content: string },
): Promise<any> {
  const { data: response } = await api.post(
    `/comment/create/${characterId}`,
    data,
  )
  return response
}

export async function fetchGetProfileComments(
  characterId: string,
  data?: { condition: any; opts: any },
): Promise<any> {
  const { data: response } = await api.post(
    `/comment/list/${characterId}`,
    data,
  )
  return response
}
