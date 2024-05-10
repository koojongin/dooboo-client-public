'use client'

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Tooltip } from '@material-tailwind/react'
import { InnItem, ItemTypeKind } from '@/interfaces/item.interface'
import { toColorByGrade } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import WeaponBoxDetailComponent from './weapon-box-detail.component'
import { InventoryActionKind } from '@/components/item/item.interface'
import MiscBoxDetailComponent from '@/components/item/misc-box-detail.component'
import { MiscStackChip } from '@/components/chat/share-item-box.component'

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

  const selectedItem = item[item.iType]
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
      {item.iType === ItemTypeKind.Weapon && (
        <div
          className={`overflow-hidden relative cursor-pointer min-w-[50px] w-[50px] h-[50px] max-w-[50px] max-h-[50px] ${className}`}
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
            <div className="relative max-w-full max-h-full w-[50px] h-[50px]">
              <div className="absolute text-[12px] border rounded px-[2px] ff-ba ff-skew bg-[#424242a6] text-white">
                {totalFlatDamage}
              </div>
              <img
                className="max-w-full max-h-full w-[50px] h-[50px]"
                src={`${toAPIHostURL(selectedItem?.thumbnail)}`}
              />
            </div>
          </Tooltip>
        </div>
      )}

      {/*---------------------------------------------------------------------*/}
      {item.iType === ItemTypeKind.Misc && (
        <div
          className={`overflow-hidden relative cursor-pointer min-w-[50px] w-[50px] h-[50px] max-w-[50px] max-h-[50px] ${className}`}
          style={{
            borderColor: toColorByGrade(selectedItem?.baseMisc.iGrade),
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
              <div>
                <MiscBoxDetailComponent
                  item={item}
                  onShowTotalDamage={onShowTotalDamage}
                  actions={actions}
                  actionCallback={itemBoxActionCallback}
                />
              </div>
            }
          >
            <div className="relative max-w-full max-h-full w-[50px] h-[50px]">
              <MiscStackChip stack={selectedItem?.stack} />
              <img
                className="max-w-full max-h-full w-[50px] h-[50px]"
                src={`${toAPIHostURL(selectedItem?.baseMisc?.thumbnail)}`}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </>
  )
}
