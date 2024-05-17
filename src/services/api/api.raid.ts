import { Raid } from '@/interfaces/raid.interface'
import api from '@/services/api'

export async function fetchRaidList(): Promise<{ raids: Raid[] }> {
  const { data: response } = await api.get(`/raid/list`)
  return response
}

export async function fetchRaidDetail(raidId: string): Promise<{ raid: Raid }> {
  const { data: response } = await api.get(`/raid/${raidId}`)
  return response
}

export async function fetchRaidAttack(raidId: string): Promise<{ raid: Raid }> {
  const { data: response } = await api.post(`/raid/attack/${raidId}`)
  return response
}
