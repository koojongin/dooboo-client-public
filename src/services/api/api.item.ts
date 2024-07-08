import api from '@/services/api'

export async function fetchConsumptionItem(itemId: string): Promise<any> {
  const { data: response } = await api.post(`/item/consumption/${itemId}`)
  return response
}

export async function fetchDivideItem(
  itemId: string,
  data: { amount: number; stashId?: string },
): Promise<any> {
  const { data: response } = await api.post(`/item/divide/${itemId}`, data)
  return response
}

export async function fetchPurchaseCard(cardName: string): Promise<any> {
  const { data: response } = await api.post(`/item/purchase/card`, {
    name: cardName,
  })
  return response
}
