import { Item, ItemTypeKind, Weapon } from '@/interfaces/item.interface'
import { getItemByType } from '@/services/util'

export const getTotalFlatDamage = (weapon: Weapon) => {
  return (
    weapon.damageOfPhysical +
    weapon.damageOfLightning +
    weapon.damageOfCold +
    weapon.damageOfFire
  )
}

const totalMiscPrice = (items: Item[]) => {
  return items.reduce((prev, next) => {
    const { iType, baseMisc, stack } = getItemByType(next)
    if (iType === ItemTypeKind.Misc) {
      return prev + baseMisc.gold * stack
    }
    return prev + getItemByType(next).gold
  }, 0)
}
