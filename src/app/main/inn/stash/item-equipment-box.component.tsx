import { Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import {
  DefenceGearType,
  Item,
  ItemTypeKind,
} from '@/interfaces/item.interface'
import WeaponBoxDetailComponent from '@/components/item/item-box/weapon-box-detail.component'
import { InventoryActionKind } from '@/components/item/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { MeResponse } from '@/interfaces/user.interface'
import { fetchUnequipItem } from '@/services/api-fetch'
import DefenceGearBoxDetailComponent from '@/components/item/item-box/defence-gear-box-detail.component'
import { toColorByGrade, translate } from '@/services/util'

export function ItemEquipmentBoxComponent({
  meResponse,
  refresh,
  readonly,
}: {
  meResponse: MeResponse
  refresh: () => Promise<void>
  readonly?: boolean
}) {
  const { equippedItems } = meResponse
  const [weapon, setWeapon] = useState<Item>()
  const [defenceGear, setDefenceGear] = useState<Item>()
  const unequipItem = async (item: Item) => {
    await fetchUnequipItem(item._id!)
    await refresh()
  }

  const getItemByItemType = useCallback(
    (itemType: ItemTypeKind) => {
      if (itemType === ItemTypeKind.Weapon) return weapon
      if (itemType === ItemTypeKind.DefenceGear) return defenceGear
      throw new Error('잘못된 아이템 타입')
    },
    [defenceGear, weapon],
  )

  useEffect(() => {
    meResponse.equippedItems.forEach((item) => {
      const { iType } = item
      if (iType === ItemTypeKind.Weapon) setWeapon(item)
      if (iType === ItemTypeKind.DefenceGear) setDefenceGear(item)
    })
  }, [equippedItems, meResponse.equippedItems])

  return (
    <div className="w-full">
      <div>장비</div>
      <div className="flex flex-col gap-[4px] w-full">
        {[
          { iType: ItemTypeKind.Weapon },
          {
            iType: ItemTypeKind.DefenceGear,
            gearType: DefenceGearType.BodyArmor,
          },
          {
            iType: ItemTypeKind.DefenceGear,
            gearType: DefenceGearType.Helmet,
          },
          {
            iType: ItemTypeKind.DefenceGear,
            gearType: DefenceGearType.Greave,
          },
          {
            iType: ItemTypeKind.DefenceGear,
            gearType: DefenceGearType.Gloves,
          },
          {
            iType: ItemTypeKind.DefenceGear,
            gearType: DefenceGearType.Boots,
          },
          {
            iType: ItemTypeKind.DefenceGear,
            gearType: DefenceGearType.Belt,
          },
        ].map((itemTypeData) => {
          const { iType, gearType } = itemTypeData
          const item = equippedItems.find(
            (eItem: any) =>
              eItem.iType === iType &&
              gearType === eItem?.defenceGear?.gearType,
          )
          return (
            <div
              key={`${iType}_${gearType}_slot`}
              className="flex items-center gap-[4px] w-full"
            >
              {!readonly && (
                <div className="w-[35px] h-[35px] flex ff-score-all font-bold">
                  {item && (
                    <div
                      className="w-full h-full border-2 border-red-400 rounded flex justify-center items-center bg-red-300 text-white cursor-pointer"
                      onClick={() => unequipItem(item!)}
                    >
                      <i className="fa-solid fa-slash" />
                    </div>
                  )}
                  {!item && (
                    <div className="w-full h-full border-2 border-gray-400 rounded flex justify-center items-center bg-gray-300 text-white cursor-pointer">
                      <i className="fa-solid fa-expand" />
                    </div>
                  )}
                </div>
              )}
              <div className="text-[16px] ff-score-all font-bold w-full">
                {iType === ItemTypeKind.Weapon && (
                  <>
                    {item && (
                      <EquippedWeaponBox
                        item={item}
                        className="min-w-[200px]"
                      />
                    )}
                    {!item && (
                      <div className="min-h-[35px] rounded min-w-[200px] bg-gray-300 text-gray-600 flex items-center justify-center">
                        무기 슬롯
                      </div>
                    )}
                  </>
                )}
                {iType === ItemTypeKind.DefenceGear && (
                  <>
                    {item && (
                      <EquippedDefenceGearBox
                        item={item}
                        className="min-w-[200px]"
                      />
                    )}
                    {!item && (
                      <div className="min-h-[35px] rounded min-w-[200px] border-2 border-gray-400 bg-gray-300 text-gray-600 flex items-center justify-center">
                        {translate(gearType!)} 슬롯
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function EquippedDefenceGearBox({
  item,
  className,
}: {
  item: Item
  className?: string
}) {
  return (
    <Tooltip
      className="rounded-none bg-transparent"
      interactive
      content={
        <DefenceGearBoxDetailComponent
          item={item}
          actions={[InventoryActionKind.Share]}
        />
      }
    >
      <div
        className={`ff-score min-h-[30px] rounded flex items-stretch cursor-pointer ${className}`}
      >
        <div
          className="border-2 rounded p-[4px] border-r-0 rounded-r-none"
          style={{
            borderColor: toColorByGrade(item.defenceGear.iGrade),
          }}
        >
          <div
            className="w-[24px] h-[24px] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${toAPIHostURL(item.defenceGear.thumbnail)}')`,
            }}
          />
        </div>
        <div
          className="text-[16px] ff-score font-bold px-[10px] border-2 rounded-r justify-center w-full flex items-center"
          style={{
            borderColor: toColorByGrade(item.defenceGear.iGrade),
          }}
        >
          {item.defenceGear.name}
          {item.defenceGear.starForce ? `(+${item.defenceGear.starForce})` : ''}
        </div>
      </div>
    </Tooltip>
  )
}
export function EquippedWeaponBox({
  item,
  className,
}: {
  item: Item
  className?: string
}) {
  return (
    <Tooltip
      className="rounded-none bg-transparent"
      interactive
      content={
        <WeaponBoxDetailComponent
          item={item}
          actions={[InventoryActionKind.Share]}
        />
      }
    >
      <div
        className={`ff-score w-full min-h-[30px] flex items-stretch cursor-pointer ${className}`}
      >
        <div
          className="border-2 rounded p-[4px] border-r-0 rounded-r-none"
          style={{
            borderColor: toColorByGrade(item.weapon.iGrade),
          }}
        >
          <div
            className="w-[24px] h-[24px] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${toAPIHostURL(item.weapon.thumbnail)}')`,
            }}
          />
        </div>
        <div
          className="text-[16px] ff-score font-bold px-[10px] border-2 rounded-r justify-center w-full flex items-center"
          style={{
            borderColor: toColorByGrade(item.weapon.iGrade),
          }}
        >
          {item.weapon.name}
          {item.weapon.starForce ? `(+${item.weapon.starForce})` : ''}
        </div>
      </div>
    </Tooltip>
  )
}
