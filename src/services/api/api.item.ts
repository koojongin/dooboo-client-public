import api from '@/services/api'

export async function fetchConsumptionItem(itemId: string): Promise<any> {
  const { data: response } = await api.post(`/item/consumption/${itemId}`)
  return response
}
