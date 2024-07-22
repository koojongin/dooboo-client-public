import { EnhanceOption } from '@/services/craft/enhance.enum'

export const enhanceOptionsTranslate = (text: string) => {
  if (text === EnhanceOption.AddStr) return '힘 추가'
  if (text === EnhanceOption.AddDex) return '민첩 추가'
  if (text === EnhanceOption.AddLuk) return '행운 추가'
  if (text === EnhanceOption.AddArmor) return '방어 추가'
  if (text === EnhanceOption.AddHp) return 'HP 추가'
  if (text === EnhanceOption.AddMp) return 'MP 추가'

  return text
}
