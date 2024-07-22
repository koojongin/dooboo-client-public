import { GetMapResponse } from '@/interfaces/map.interface'
import api from '@/services/api'

export async function fetchGetMapByRaidId(id: string): Promise<GetMapResponse> {
  const { data: response } = await api.get(`/map/raid/${id}`)
  return response
}
