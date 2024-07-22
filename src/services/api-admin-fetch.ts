import api from '@/services/api'
import { Pagination } from '@/interfaces/common.interface'
import {
  BaseDefenceGear,
  BaseDefenceGearListResponseDto,
  BaseMisc,
  BaseMiscListResponseDto,
} from '@/interfaces/item.interface'
import { GetMapResponse, GetMapsResponse } from '@/interfaces/map.interface'
import { GatchaCard } from '@/interfaces/gatcha.interface'
import { ShopItem } from '@/interfaces/shop.interface'

interface ChatMessageResponse extends Pagination {
  chatMessages: any[]
}

export async function fetchGetMap(id: string): Promise<GetMapResponse> {
  const { data: response } = await api.get(`/map/${id}`)
  return response
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

export async function fetchGetCharacterList(condition = {}, opts = {}) {
  const { data: response } = await api.post(`/admin/character/list`, {
    condition,
    opts,
  })
  return response
}

export async function fetchGetStashList(condition = {}, opts = {}) {
  const { data: response } = await api.post(`/admin/stash/list`, {
    condition,
    opts,
  })
  return response
}

export async function fetchGetBaseMiscList(
  condition = {},
  opts = {},
): Promise<BaseMiscListResponseDto> {
  const { data: response } = await api.post('/base-misc/list', {
    condition,
    opts,
  })
  return response
}

export async function fetchGetBaseMiscOne(
  id: string,
): Promise<{ baseMisc: BaseMisc }> {
  const { data: response } = await api.get(`/base-misc/${id}`)
  return response
}

export async function fetchPostBaseMisc(misc: BaseMisc): Promise<any> {
  const { data: response } = await api.post(`/base-misc/`, misc)
  return response
}

export async function fetchPutBaseMisc(misc: BaseMisc): Promise<any> {
  const { data: response } = await api.put(`/base-misc/`, misc)
  return response
}

export async function fetchGetBaseDefenceGearList(
  condition = {},
  opts = {},
): Promise<BaseDefenceGearListResponseDto> {
  const { data: response } = await api.post('/base-defence-gear/list', {
    condition,
    opts,
  })
  return response
}

export async function fetchGetBaseDefenceGearOne(
  id: string,
): Promise<{ baseDefenceGear: BaseDefenceGear }> {
  const { data: response } = await api.get(`/base-defence-gear/${id}`)
  return response
}

export async function fetchPostBaseDefenceGear(
  defenceGear: BaseDefenceGear,
): Promise<any> {
  const { data: response } = await api.post(`/base-defence-gear/`, defenceGear)
  return response
}

export async function fetchPutBaseDefenceGear(
  defenceGear: BaseDefenceGear,
): Promise<any> {
  const { data: response } = await api.put(`/base-defence-gear/`, defenceGear)
  return response
}

export async function fetchCreateShopItem(
  shopItem: ShopItem,
): Promise<{ shopItem: ShopItem }> {
  const { data: response } = await api.post(`/shop/create`, { shopItem })
  return response
}

export async function fetchPutShopItem(
  shopItem: ShopItem,
): Promise<{ shopItem: ShopItem }> {
  const { data: response } = await api.put(`/shop/update`, { shopItem })
  return response
}

export async function fetchGetMonsters(condition = {}, opts = {}) {
  const { data } = await api.post('/monster/list', { condition, opts })
  return data
}

export async function fetchGetMonstersByMap(condition = {}, opts = {}) {
  const { data } = await api.post('/monster/map/list', { condition, opts })
  return data
}
export async function fetchRewardDamageRank() {
  const { data } = await api.post('/rank/reward-damage-rank')
  return data
}

export async function fetchAdminGetMaps(
  condition?: { [key: string]: any },
  opts?: { [key: string]: any },
): Promise<GetMapsResponse> {
  const { data: response } = await api.post('/map/admin/list', {
    condition,
    opts,
  })
  return response
}

export async function fetchAdminPutMap(data: any) {
  const { data: response } = await api.put(`/map/update`, data)
  return response
}
