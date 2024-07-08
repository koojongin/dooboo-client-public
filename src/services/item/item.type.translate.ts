import { DefenceGearType, ItemTypeKind } from '@/interfaces/item.interface'

export const itemTypeTranslate = (text: string) => {
  if (text === 'axe') return '도끼'
  if (text === 'sword') return '검'
  if (text === 'dagger') return '단검'
  if (text === 'bow') return '활'
  if (text === 'blunt') return '둔기'
  if (text === 'spear') return '창'
  if (text === 'gun') return '권총'
  if (text === 'cannon') return '대포'
  if (text === 'claw') return '아대'

  if (text === DefenceGearType.BodyArmor) return '갑옷'
  if (text === DefenceGearType.Greave) return '다리보호구'
  if (text === DefenceGearType.Belt) return '허리띠'
  if (text === DefenceGearType.Helmet) return '투구'
  if (text === DefenceGearType.Ring) return '반지'
  if (text === DefenceGearType.Amulet) return '목걸이'

  if (text === 'iCategory:etc') return '기타'
  if (text === 'iCategory:consume') return '소비'
  if (text === `iType:${ItemTypeKind.Weapon}`) return '무기'
  if (text === `iType:${ItemTypeKind.Misc}`) return '기타'
  if (text === `iType:${ItemTypeKind.DefenceGear}`) return '방어구'

  return text
}
