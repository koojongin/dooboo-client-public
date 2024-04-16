import api from '@/services/api'
import { GetMapResponse } from '@/interfaces/map.interface'
import { BattleResponseDto } from '@/interfaces/battle.interface'
import { Character, MeResponse } from '@/interfaces/user.interface'
import {
  BaseWeaponListResponseDto,
  BaseWeaponResponseDto,
} from '@/interfaces/item.interface'

interface CreateMonsterResponse {
  monster: {
    name: string
  }
}

export async function fetchMe(): Promise<MeResponse> {
  const { data } = await api.get('/user/me')
  return data
}

export async function fetchBattle(name: string): Promise<BattleResponseDto> {
  const { data } = await api.get('/user/battle', { params: { name } })
  return data
}

export async function fetchPostMonster(
  data: any,
): Promise<CreateMonsterResponse> {
  const { data: response } = await api.post('/monster/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: [
      () => {
        return data
      },
    ],
  })
  return response
}

export async function fetchPutMonster(
  data: any,
): Promise<CreateMonsterResponse> {
  const { data: response } = await api.put('/monster/update', data)
  return response
}

export async function fetchGetMonsters() {
  const { data } = await api.get('/monster/list')
  return data
}

export async function fetchPostMap(data: any) {
  const { data: response } = await api.post('/map/create', data)
  return response
}

export async function fetchGetMap(): Promise<GetMapResponse> {
  const { data: response } = await api.get('/map/list')
  return response
}

export async function fetchGetMapsName(): Promise<GetMapResponse> {
  const { data: response } = await api.get('/map/list-name')
  return response
}

export async function fetchDeleteMap(id: string) {
  const { data: response } = await api.delete('/map/delete', {
    data: { _id: id },
  })
  return response
}

export async function fetchGetBaseWeaponList(): Promise<BaseWeaponListResponseDto> {
  const { data: response } = await api.get('/item/base-weapon/list')
  return response
}

export async function fetchGetBaseWeapon(
  id: string,
): Promise<BaseWeaponResponseDto> {
  const { data: response } = await api.get(`/item/base-weapon/${id}`)
  return response
}

export async function fetchGetRankList(): Promise<{ characters: Character[] }> {
  const { data: response } = await api.get(`/character/rank`)
  return response
}
