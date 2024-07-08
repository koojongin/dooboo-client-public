import api from '@/services/api'
import { Character } from '@/interfaces/user.interface'

export async function fetchApplyEarnedData(
  data: any,
  option?: { version: number },
): Promise<any> {
  const { data: response } = await api.post(`/game/apply-earned-data`, {
    ...data,
    version: option?.version,
  })
  return response
}

export async function fetchGameLogin(
  withoutGameKey: boolean,
): Promise<{ character: Character }> {
  const { data: response } = await api.post(`/game/login`, { withoutGameKey })
  return response
}
