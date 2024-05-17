import api from '@/services/api'
import { ShopItem } from '@/interfaces/shop.interface'

export async function fetchGetShopList(): Promise<{ shopItems: ShopItem[] }> {
  const { data: response } = await api.post(`/shop/list`)
  return response
}

export async function fetchGetShopOne(
  shopItemId: string,
): Promise<{ shopItem: ShopItem }> {
  const { data: response } = await api.post(`/shop/${shopItemId}`)
  return response
}

export async function fetchPurchaseShopItem(shopItemId: string) {
  const { data: response } = await api.post(`/shop/purchase/${shopItemId}`)
  return response
}
