import api from '@/services/api'
import { GetMapResponse, GetMapsResponse } from '@/interfaces/map.interface'
import { BattleResponseDto } from '@/interfaces/battle.interface'
import { Character, MeResponse } from '@/interfaces/user.interface'
import {
  BaseWeapon,
  BaseWeaponListResponseDto,
  BaseWeaponResponseDto,
  EnhancedResult,
  Weapon,
} from '@/interfaces/item.interface'
import {
  DropTable,
  DropTableListResponseDto,
  DropTableResponseDto,
} from '@/interfaces/drop-table.interface'
import { Board, BoardListResponse } from '@/interfaces/board.interface'
import { Pagination } from '@/interfaces/common.interface'
import { AuctionListResponse } from '@/interfaces/auction.interface'

interface CreateMonsterResponse {
  monster: {
    name: string
  }
}

export async function fetchGetJwtToken(): Promise<any> {
  const { data } = await api.get('/auth/jwt')
  return data
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

export async function fetchGetMonster(id: string) {
  const { data } = await api.get(`/monster/${id}`)
  return data
}
export async function fetchGetMonsters() {
  const { data } = await api.get('/monster/list')
  return data
}

export async function fetchPostMap(data: any) {
  const { data: response } = await api.post('/map/create', data)
  return response
}

export async function fetchGetMap(id: string): Promise<GetMapResponse> {
  const { data: response } = await api.get(`/map/${id}`)
  return response
}

export async function fetchGetMaps(): Promise<GetMapsResponse> {
  const { data: response } = await api.get('/map/list')
  return response
}

export async function fetchGetMapsName(): Promise<GetMapsResponse> {
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

export async function fetchPostBaseWeapon(
  baseWeapon: BaseWeapon,
): Promise<BaseWeaponResponseDto> {
  const { data: response } = await api.post(`/item/base-weapon`, baseWeapon)
  return response
}
export async function fetchPutBaseWeapon(
  baseWeapon: BaseWeapon,
): Promise<BaseWeaponResponseDto> {
  const { data: response } = await api.put(
    `/item/base-weapon/${baseWeapon._id}`,
    baseWeapon,
  )
  return response
}

export async function fetchDeleteBaseWeapon(
  id: string,
): Promise<BaseWeaponResponseDto> {
  const { data: response } = await api.delete(`/item/base-weapon/${id}`)
  return response
}

export async function fetchGetRankList(): Promise<{ characters: Character[] }> {
  const { data: response } = await api.get(`/character/rank`)
  return response
}

export async function fetchGetMyInventory(): Promise<{
  items: Array<Weapon | any>
  slots: number
  isFulled: boolean
  gold: number
}> {
  const { data: response } = await api.get(`/character/inventory`)
  return response
}

export async function fetchGetDropTableList(): Promise<DropTableListResponseDto> {
  const { data: response } = await api.get('/item/drop/list')
  return response
}

export async function fetchGetDropTable(
  id: string,
): Promise<DropTableResponseDto> {
  const { data: response } = await api.get(`/item/drop/${id}`)
  return response
}

export async function fetchPutDropTable(
  dropTable: DropTable,
): Promise<DropTableResponseDto> {
  const { data: response } = await api.put(
    `/item/drop/${dropTable._id}`,
    dropTable,
  )
  return response
}

export async function fetchCreateDropTable(
  dropTable: DropTable,
): Promise<DropTableResponseDto> {
  const { data: response } = await api.post(`/item/drop`, dropTable)
  return response
}
export async function fetchDeleteDropTable(
  id: string,
): Promise<DropTableResponseDto> {
  const { data: response } = await api.delete(`/item/drop/${id}`)
  return response
}

export async function fetchUploadItemFile(
  formData: any,
): Promise<{ path: string }> {
  const { data: response } = await api.post(
    '/item/upload',
    {},
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [
        () => {
          return formData
        },
      ],
    },
  )
  return response
}

export async function fetchEquipItem(id: string) {
  const { data: response } = await api.post(`/item/equip/${id}`)
  return response
}

export async function fetchUnequipItem(id: string) {
  const { data: response } = await api.post(`/item/unequip/${id}`)
  return response
}

export async function fetchSellItems(
  itemIds: string[],
): Promise<DropTableResponseDto> {
  const { data: response } = await api.post(`/item/sell`, { itemIds })
  return response
}

export async function fetchGetEnhancePrice(
  id: string,
): Promise<{ price: number } & any> {
  const { data: response } = await api.get(`/item/enhance-price/${id}`)
  return response
}

export async function fetchEnhanceWeapon(
  id: string,
  data: { itemIds: string[] },
): Promise<EnhancedResult> {
  const { data: response } = await api.post(`/item/enhance/${id}`, data)
  return response
}

export async function fetchPostBoard(data: any): Promise<any> {
  const { data: response } = await api.post(`/board/create`, data)
  return response
}

export async function fetchGetBoardList(
  data: object,
  opts = { page: 1 },
): Promise<BoardListResponse> {
  const { data: response } = await api.post(`/board/list`, {
    condition: data,
    opts,
  })
  return response
}

export async function fetchGetBoardOne(id: string): Promise<{ board: Board }> {
  const { data: response } = await api.post(`/board/${id}`)
  return response
}

export async function fetchPostBoardComment(
  id: string,
  data: { content: string } & any,
): Promise<{ board: Board }> {
  const { data: response } = await api.post(`/board/comment/create/${id}`, data)
  return response
}

export async function fetchDeleteBoardOne(
  id: string,
): Promise<{ board: Board }> {
  const { data: response } = await api.delete(`/board/delete/${id}`)
  return response
}

export async function fetchPostAddToAuction(
  id: string,
  data: { gold: number },
) {
  const { data: response } = await api.post(`/item/auction/add/${id}`, data)
  return response
}

export async function fetchGetAuctions(
  condition = {},
  opts?: { page: number },
): Promise<AuctionListResponse> {
  const { data: response } = await api.post(`/item/auction/list`, {
    condition,
    opts,
  })
  return response
}

export async function fetchPurchaseAuctionItem(
  id: string,
): Promise<AuctionListResponse> {
  const { data: response } = await api.post(`/item/auction/purchase/${id}`)
  return response
}
