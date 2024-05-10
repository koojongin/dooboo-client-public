import { Item, ItemTypeKind } from '@/interfaces/item.interface'
import { toColorByGrade } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'

export default function ShareItemBoxComponent({ item }: { item: Item }) {
  const getBorderColor = (iType: ItemTypeKind) => {
    if (iType === ItemTypeKind.Weapon)
      return toColorByGrade(item[ItemTypeKind.Weapon].iGrade)
    if (iType === ItemTypeKind.Misc)
      return toColorByGrade(item[ItemTypeKind.Misc].baseMisc.iGrade)
    return ''
  }

  return (
    <div className="flex items-center gap-[2px]">
      <div
        className="relative"
        style={{
          borderColor: getBorderColor(item.iType as ItemTypeKind),
          borderWidth: '2px',
          borderRadius: '2px',
        }}
      >
        {item.iType === ItemTypeKind.Weapon && <FlatDamageBox item={item} />}
        <ItemThumbnailBox item={item} />
        {item.iType === ItemTypeKind.Misc && (
          <MiscStackChip stack={item.misc.stack} />
        )}
      </div>
      <ItemNameBox item={item} />
    </div>
  )
}

export function MiscStackChip({ stack }: { stack: number }) {
  return (
    <div className="absolute right-0 bottom-0 text-[12px] border rounded px-[2px] ff-ba ff-skew bg-[#424242a6] text-white">
      {stack}
    </div>
  )
}

function ItemNameBox({ item }: any) {
  return (
    <>
      {item.iType === ItemTypeKind.Weapon && (
        <span>
          [{item.weapon.name}
          {item.weapon.starForce > 0 ? `+${item.weapon.starForce}` : ''}]
        </span>
      )}
      {item.iType === ItemTypeKind.Misc && (
        <span>[{item[item.iType].baseMisc.name}]</span>
      )}
    </>
  )
}

function ItemThumbnailBox({ item }: any) {
  return (
    <>
      {item.iType === ItemTypeKind.Weapon && (
        <img
          src={toAPIHostURL(item[ItemTypeKind.Weapon].thumbnail)}
          className="w-[40px] h-[40px] border rounded p-[1px] bg-white"
        />
      )}

      {item.iType === ItemTypeKind.Misc && (
        <img
          src={toAPIHostURL(item[ItemTypeKind.Misc].baseMisc.thumbnail)}
          className="w-[40px] h-[40px] border rounded p-[1px] bg-white"
        />
      )}
    </>
  )
}

function FlatDamageBox({ item }: any) {
  const getTotalFlatDamage = (weapon: any) => {
    const selectedItem = weapon
    const totalFlatDamage =
      selectedItem.damageOfPhysical +
      selectedItem.damageOfLightning +
      selectedItem.damageOfCold +
      selectedItem.damageOfFire
    return totalFlatDamage
  }
  return (
    <div className="absolute z-10 text-[12px] border rounded px-[2px] bg-[#424242a6] text-white ff-ba ff-skew">
      {getTotalFlatDamage(item.weapon)}
    </div>
  )
}
