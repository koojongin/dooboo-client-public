import { Tooltip } from '@material-tailwind/react'
import { toColorByGrade } from '@/services/util'
import WeaponBoxDetailComponent from '@/components/item/item-box/weapon-box-detail.component'
import toAPIHostURL from '@/services/image-name-parser'
import { InnItem, ItemTypeKind } from '@/interfaces/item.interface'
import DefenceGearBoxDetailComponent from '@/components/item/item-box/defence-gear-box-detail.component'

export function DefenceGearBoxComponent({
  item,
  onClickItem,
  className,
  actions,
  itemBoxActionCallback,
  equippedItems,
}: {
  item: InnItem | any
  onClickItem: (event: React.MouseEvent) => void
  className?: string
  actions?: string[]
  itemBoxActionCallback: (type: string | any) => void
  equippedItems?: any[]
}) {
  const selectedItem = item.defenceGear
  const [equippedWeapon] = (equippedItems || []).filter(
    (i) => i.iType === 'weapon',
  )
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
        content={
          <div className="flex gap-[4px] items-start">
            <div>
              {equippedWeapon && (
                <div>
                  <div className="bg-gradient-to-r from-[#555d62ed] to-blue-gray-100/50 rounded-t flex p-[4px]">
                    선택된 아이템
                  </div>
                </div>
              )}
              <DefenceGearBoxDetailComponent
                item={item}
                actions={actions}
                actionCallback={itemBoxActionCallback}
              />
            </div>
          </div>
        }
      >
        <div className="relative max-w-full max-h-full w-[50px] h-[50px]">
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
