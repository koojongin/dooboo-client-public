import moment from 'moment'
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

export const getLeftTime = (time: Date) => {
  const distance = moment.duration(moment(time).diff(new Date()))
  return `${`${distance.hours()}`.padStart(2, '0')}:${`${distance.minutes()}`.padStart(2, '0')}:${`${distance.seconds()}`.padStart(2, '0')}`
}
