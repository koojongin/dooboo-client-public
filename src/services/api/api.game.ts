import api from '@/services/api'
import { Character } from '@/interfaces/user.interface'

export async function fetchApplyEarnedData(data: any): Promise<any> {
  const { data: response } = await api.post(`/game/apply-earned-data`, data)
  return response
}

export async function fetchGameLogin(): Promise<{ character: Character }> {
  const { data: response } = await api.post(`/game/login`)
  return response
}
