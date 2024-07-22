import api from '@/services/api'
import { DefenceGearType, EnhancedResult } from '@/interfaces/item.interface'
import {
  DefenceGearEnhanceDataResponse,
  EnhanceOption,
} from '@/services/craft/enhance.enum'

export async function fetchGetEnchantData(
  itemId: string,
  attributeName: string,
): Promise<any> {
  const { data: response } = await api.post(`/craft/enchant-data/${itemId}`, {
    attributeName,
  })
  return response
}

export async function fetchEnchantWeapon(
  itemId: string,
  attributeName: string,
): Promise<any> {
  const { data: response } = await api.post(`/craft/enchant/${itemId}`, {
    attributeName,
  })
  return response
}
export async function fetchInjectCardWeapon(weaponId: string): Promise<any> {
  const { data: response } = await api.post(`/craft/inject-card/${weaponId}`)
  return response
}

export async function fetchGetEnhanceData(data: {
  iLevel: number
  gearType: DefenceGearType
}): Promise<DefenceGearEnhanceDataResponse> {
  const { data: response } = await api.post(
    `/craft/get-enhance-data/defence-gear`,
    data,
  )
  return response
}

export async function fetchEnhanceDefenceGear(data: {
  id: string
  scrollPercent: number
  isEnableBlackSmithScroll?: boolean
  enhanceOption: EnhanceOption
}): Promise<EnhancedResult> {
  const { data: response } = await api.post(`/craft/enhance/defence-gear`, data)
  return response
}

export async function fetchGetImprintingOptions(itemId: string): Promise<{
  list: {
    [key: string]: { value: [number, number] }
  }
}> {
  const { data: response } = await api.post(`/craft/imprinting/options`, {
    itemId,
  })
  return response
}

export async function fetchImprinting(itemId: string): Promise<any> {
  const { data: response } = await api.post(`/craft/imprinting`, {
    itemId,
  })
  return response
}
