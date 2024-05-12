import api from '@/services/api'

export async function fetchGetCharacterProfile(id: string): Promise<any> {
  const { data: response } = await api.get(`/character/profile/${id}`)
  return response
}
