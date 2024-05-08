'use client'

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Tooltip } from '@material-tailwind/react'
import { InnItem } from '@/interfaces/item.interface'
import { toColorByGrade } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import WeaponBoxDetailComponent from './weapon-box-detail.component'
import { InventoryActionKind } from '@/components/item/item.interface'

export default function ItemBoxComponent({
  className = '',
  item,
  actions,
  onShowTotalDamage = false,
  equippedItems,
  actionCallback = () => {},
  onSelect = () => {},
  setLastOpenedItemId,
  lastOpenedItemId,
}: {
  item: InnItem | any
  className: string
  setLastOpenedItemId?: Dispatch<SetStateAction<string | undefined>>
  lastOpenedItemId?: string
  equippedItems?: any[]
  actions?: string[]
  onShowTotalDamage?: boolean
  actionCallback?: () => void
  onSelect?: (param: InnItem, ...rest: any) => void
}) {
  const [open, setOpen] = useState(false)
  const [equippedWeapon] = (equippedItems || []).filter(
    (i) => i.iType === 'weapon',
  )

  const selectedItem = item.weapon
  const totalFlatDamage =
    (selectedItem?.damageOfPhysical || 0) +
    (selectedItem?.damageOfLightning || 0) +
    (selectedItem?.damageOfCold || 0) +
    (selectedItem?.damageOfFire || 0)

  const onClickItem = useCallback(
    (event: React.MouseEvent) => {
      onSelect(item, event)
    },
    [item, onSelect],
  )

  const handler = useCallback((isOpened: boolean) => {
    if (setLastOpenedItemId) {
      setLastOpenedItemId(isOpened ? item._id : '')
    }
    setOpen(isOpened)
  }, [])

  const itemBoxActionCallback = (type: string | any) => {
    if (type === InventoryActionKind.AddToAuction) {
      if (setLastOpenedItemId) setLastOpenedItemId(undefined)
      setOpen(false)
    }
    if (actionCallback) actionCallback()
  }

  useEffect(() => {
    if (lastOpenedItemId === item._id) {
      handler(true)
    }
  }, [handler, item._id, lastOpenedItemId])

  return (
    <>
      {item.iType === 'weapon' && (
        <div
          className={`overflow-hidden relative cursor-pointer min-w-[40px] w-[40px] h-[40px] max-w-[40px] max-h-[40px] ${className}`}
          style={{
            borderColor: toColorByGrade(selectedItem.iGrade),
            borderWidth: '2px',
            borderRadius: '4px',
          }}
          onClick={(e) => onClickItem(e)}
        >
          <Tooltip
            className="rounded-none bg-transparent"
            interactive
            handler={(e: any) => handler(e)}
            open={open}
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
            <div className="relative max-w-full max-h-full w-[40px] h-[40px]">
              <div className="absolute text-[12px] border rounded px-[2px] ff-ba ff-skew bg-[#424242a6] text-white">
                {totalFlatDamage}
              </div>
              <img
                className="max-w-full max-h-full w-[40px] h-[40px]"
                src={`${toAPIHostURL(selectedItem?.thumbnail)}`}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </>
  )
}
