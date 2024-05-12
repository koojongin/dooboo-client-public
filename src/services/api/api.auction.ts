import api from '@/services/api'
import { AuctionListResponse } from '@/interfaces/auction.interface'

export async function fetchPostAddToAuction(
  id: string,
  data: { gold: number; amount: number },
) {
  const { data: response } = await api.post(`/auction/add/${id}`, data)
  return response
}

export async function fetchGetAuctionWeapons(
  condition = {},
  opts?: { page: number },
): Promise<AuctionListResponse> {
  const { data: response } = await api.post(`/auction/list/weapon`, {
    condition,
    opts,
  })
  return response
}

export async function fetchGetAuctionMiscs(
  condition = {},
  opts?: { page: number },
): Promise<AuctionListResponse> {
  const { data: response } = await api.post(`/auction/list/misc`, {
    condition,
    opts,
  })
  return response
}

export async function fetchPurchaseAuctionItem(
  id: string,
): Promise<AuctionListResponse> {
  const { data: response } = await api.post(`/auction/purchase/${id}`)
  return response
}

export async function fetchRetrieveAuctionItem(
  id: string,
): Promise<AuctionListResponse> {
  const { data: response } = await api.post(`/auction/retrieve/${id}`)
  return response
}
