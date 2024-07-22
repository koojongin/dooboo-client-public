import api from '@/services/api'

export async function fetchGetEnhanceRecoveryPrice(
  itemId: string,
): Promise<{ price: number }> {
  const { data: response } = await api.post(
    `/craft/get-enhance-recovery-price`,
    {
      itemId,
    },
  )
  return response
}
export async function fetchEnhanceRecovery(
  itemId: string,
): Promise<{ isSuccess: boolean }> {
  const { data: response } = await api.post(`/craft/enhance-recovery`, {
    itemId,
  })
  return response
}
