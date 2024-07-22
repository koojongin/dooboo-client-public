import { Tooltip } from '@material-tailwind/react'
import { toColorByGrade } from '@/services/util'
import WeaponBoxDetailComponent from '@/components/item/item-box/weapon-box-detail.component'
import toAPIHostURL from '@/services/image-name-parser'
import { InnItem, Item, Weapon } from '@/interfaces/item.interface'
import { ItemLockIcon } from '@/components/item/item-box/item-lock-icon'

export function WeaponBoxComponent({
  item,
  onClickItem,
  className,
  onShowTotalDamage,
  actions,
  itemBoxActionCallback,
  equippedItems,
}: {
  item: InnItem | any
  onClickItem: (event: React.MouseEvent) => void
  className?: string
  onShowTotalDamage?: boolean
  actions?: string[]
  itemBoxActionCallback: (type: string | any) => void
  equippedItems?: any[]
}) {
  const selectedItem = item[item.iType]
  const [equippedWeapon] = (equippedItems || []).filter(
    (i) => i.iType === 'weapon',
  )
  const totalFlatDamage =
    (selectedItem?.damageOfPhysical || 0) +
    (selectedItem?.damageOfLightning || 0) +
    (selectedItem?.damageOfCold || 0) +
    (selectedItem?.damageOfFire || 0)
  return (
    <div
      className={`overflow-hidden relative cursor-pointer min-w-[50px] w-[50px] h-[50px] max-w-[50px] max-h-[50px] ${className}`}
      style={{
        borderColor: toColorByGrade(selectedItem?.iGrade),
        borderWidth: '2px',
        borderRadius: '4px',
      }}
      onClick={(e) => onClickItem(e)}
    >
      <Tooltip
        className="rounded-none bg-transparent"
        interactive
        // handler={(e: any) => handler(e)}
        // open={open}
        content={
          <div className="flex gap-[4px] items-start">
            {equippedWeapon && (
              <div className="">
                <div className="bg-gradient-to-r from-[#555d62ed] to-blue-gray-100/50 rounded-t flex p-[4px]">
                  착용중 아이템
                </div>
                <WeaponBoxDetailComponent
                  item={equippedWeapon}
                  onShowTotalDamage={onShowTotalDamage}
                  actions={actions}
                  actionCallback={itemBoxActionCallback}
                />
              </div>
            )}
            <div>
              {equippedWeapon && (
                <div>
                  <div className="bg-gradient-to-r from-[#555d62ed] to-blue-gray-100/50 rounded-t flex p-[4px]">
                    선택된 아이템
                  </div>
                </div>
              )}
              <WeaponBoxDetailComponent
                item={item}
                onShowTotalDamage={onShowTotalDamage}
                actions={actions}
                actionCallback={itemBoxActionCallback}
              />
            </div>
          </div>
        }
      >
        <div className="relative max-w-full max-h-full w-[50px] h-[50px]">
          {/* {!!item?._id && <ItemLockIcon />} */}
          <div className="absolute text-[12px] border rounded px-[2px] ff-ba ff-skew bg-[#424242a6] text-white">
            {totalFlatDamage}
          </div>
          <div
            className="max-w-full max-h-full w-[50px] h-[50px] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${toAPIHostURL(selectedItem?.thumbnail)})`,
            }}
          />
        </div>
      </Tooltip>
    </div>
  )
}
