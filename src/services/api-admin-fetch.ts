import api from '@/services/api'
import { Pagination } from '@/interfaces/common.interface'
import { BaseMisc, BaseMiscListResponseDto } from '@/interfaces/item.interface'
import { GetMapResponse } from '@/interfaces/map.interface'
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
