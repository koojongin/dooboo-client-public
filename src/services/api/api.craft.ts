import api from '@/services/api'

export async function fetchGetEnchantData(
  weaponId: string,
  attributeName: string,
): Promise<any> {
  const { data: response } = await api.post(`/craft/enchant-data/${weaponId}`, {
    attributeName,
  })
  return response
}

export async function fetchEnchantWeapon(
  weaponId: string,
  attributeName: string,
): Promise<any> {
  const { data: response } = await api.post(`/craft/enchant/${weaponId}`, {
    attributeName,
  })
  return response
}
export async function fetchInjectCardWeapon(weaponId: string): Promise<any> {
  const { data: response } = await api.post(`/craft/inject-card/${weaponId}`)
  return response
}
