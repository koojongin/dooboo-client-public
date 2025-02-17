import {
  CharacterRaid,
  ListRaidRewardResponse,
  Raid,
} from '@/interfaces/raid.interface'
import api from '@/services/api'
import { MongooseDocument, Pagination } from '@/interfaces/common.interface'

export interface GetRaidResponse {
  raid: Raid
}
export async function fetchRaidList(): Promise<{ raids: Raid[] }> {
  const { data: response } = await api.get(`/raid/list`)
  return response
}

export async function fetchRaidDetail(
  raidId: string,
): Promise<GetRaidResponse> {
  const { data: response } = await api.get(`/raid/${raidId}`)
  return response
}

export async function fetchRaidAttack(raidId: string): Promise<{ raid: Raid }> {
  const { data: response } = await api.post(`/raid/attack/${raidId}`)
  return response
}

export async function fetchUpdateRaidAttackLog(
  raidId: string,
  data: any,
): Promise<{ raid: Raid }> {
  const { data: response } = await api.post(`/raid/update/${raidId}`, data)
  return response
}

export async function fetchRequestRaidRewardAll(): Promise<{ raid: Raid }> {
  const { data: response } = await api.post(`/raid/reward/all`)
  return response
}

export interface CharacterRaidResponse {
  characterRaid: CharacterRaid
}
export async function fetchGetCharacterRaid(): Promise<CharacterRaidResponse> {
  const { data: response } = await api.get(`/raid/character-raid`)
  return response
}

export async function fetchGetCharacterRaidById(
  characterId: string,
): Promise<CharacterRaidResponse> {
  const { data: response } = await api.get(
    `/raid/character-raid/${characterId}`,
  )
  return response
}

export async function fetchGetRaidRewardAll(
  condition = {},
  options = {},
): Promise<ListRaidRewardResponse> {
  const { data: response } = await api.post(`/raid/reward/get/list`, {
    condition,
    options,
  })
  return response
}
