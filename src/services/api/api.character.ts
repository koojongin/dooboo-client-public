import api from '@/services/api'

export async function fetchGetCharacterProfile(id: string): Promise<any> {
  const { data: response } = await api.get(`/character/profile/${id}`)
  return response
}

export async function fetchGetCharactersByKeyword(
  keyword: string,
): Promise<any> {
  const { data: response } = await api.post(`/character/keyword`, { keyword })
  return response
}
