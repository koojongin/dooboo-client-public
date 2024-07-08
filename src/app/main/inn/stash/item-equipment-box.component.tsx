import { Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { Item, ItemTypeKind } from '@/interfaces/item.interface'
import WeaponBoxDetailComponent from '@/components/item/item-box/weapon-box-detail.component'
import { InventoryActionKind } from '@/components/item/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { MeResponse } from '@/interfaces/user.interface'
import { fetchUnequipItem } from '@/services/api-fetch'
import DefenceGearBoxDetailComponent from '@/components/item/item-box/defence-gear-box-detail.component'
import { toColorByGrade } from '@/services/util'

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
    <div className="">
      <div>장비</div>
      <div className="flex flex-col gap-[4px]">
        {[ItemTypeKind.Weapon, ItemTypeKind.DefenceGear].map(
          (iType: ItemTypeKind) => {
            const item = equippedItems.find(
              (eItem: any) => eItem.iType === iType,
            )
            return (
              <div
                key={`${iType}_slot`}
                className="flex justify-start items-center gap-[4px]"
              >
                {!readonly && (
                  <>
                    {item && (
                      <div
                        className="ff-score font-bold w-[33px] h-[33px] border border-red-300 rounded flex justify-center items-center bg-red-300 text-white cursor-pointer"
                        onClick={() => unequipItem(item!)}
                      >
                        <i className="fa-solid fa-slash" />
                      </div>
                    )}
                    {!item && (
                      <div className="ff-score font-bold w-[33px] h-[33px] border border-gray-300 rounded flex justify-center items-center bg-gray-300 text-white cursor-pointer">
                        <i className="fa-solid fa-expand" />
                      </div>
                    )}
                  </>
                )}
                <div className="flex items-stretch text-[16px] ff-score-all font-bold">
                  {iType === ItemTypeKind.Weapon && (
                    <>
                      {item && <EquippedWeaponBox item={item} />}
                      {!item && (
                        <div className="min-h-[33px] rounded min-w-[192px] bg-gray-300 text-gray-600 flex items-center justify-center">
                          무기 슬롯
                        </div>
                      )}
                    </>
                  )}
                  {iType === ItemTypeKind.DefenceGear && (
                    <>
                      {item && <EquippedDefenceGearBox item={item} />}
                      {!item && (
                        <div className="min-h-[33px] rounded min-w-[192px] bg-gray-300 text-gray-600 flex items-center justify-center">
                          갑옷 슬롯
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          },
        )}
      </div>
    </div>
  )
}

export function EquippedDefenceGearBox({ item }: { item: Item }) {
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
      <div className="ff-score w-full min-h-[30px] rounded flex items-stretch cursor-pointer">
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
          className="text-[16px] ff-score font-bold px-[10px] border-2 rounded-r justify-center min-w-[150px] flex items-center"
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
export function EquippedWeaponBox({ item }: { item: Item }) {
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
      <div className="ff-score w-full min-h-[30px] flex items-stretch cursor-pointer">
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
          className="text-[16px] ff-score font-bold px-[10px] border-2 rounded-r justify-center min-w-[150px] flex items-center"
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
