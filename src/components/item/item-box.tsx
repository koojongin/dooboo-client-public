'use client'

import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { InnItem, ItemTypeKind } from '@/interfaces/item.interface'
import { InventoryActionKind } from '@/components/item/item.interface'
import { WeaponBoxComponent } from '@/components/item/item-box/weapon-box.component'
import { MiscBoxComponent } from '@/components/item/item-box/misc-box-component'
import { DefenceGearBoxComponent } from '@/components/item/item-box/defence-gear-box.component'

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
  const onClickItem = useCallback(
    (event: React.MouseEvent) => {
      onSelect(item, event)
    },
    [item, onSelect],
  )

  const itemBoxActionCallback = (type: string | any) => {
    if (
      type === InventoryActionKind.AddToAuction ||
      type === InventoryActionKind.Consume
    ) {
      if (setLastOpenedItemId) setLastOpenedItemId(undefined)
      setOpen(false)
    }
    if (actionCallback) actionCallback()
  }

  return (
    <>
      {item.iType === ItemTypeKind.Weapon && (
        <WeaponBoxComponent
          item={item}
          equippedItems={equippedItems}
          onClickItem={onClickItem}
          className={className}
          onShowTotalDamage={onShowTotalDamage}
          itemBoxActionCallback={itemBoxActionCallback}
          actions={actions}
        />
      )}

      {/*---------------------------------------------------------------------*/}
      {item.iType === ItemTypeKind.Misc && (
        <MiscBoxComponent
          item={item}
          onClickItem={onClickItem}
          className={className}
          itemBoxActionCallback={itemBoxActionCallback}
          actions={actions}
        />
      )}

      {item.iType === ItemTypeKind.DefenceGear && (
        <DefenceGearBoxComponent
          item={item}
          equippedItems={equippedItems}
          onClickItem={onClickItem}
          className={className}
          itemBoxActionCallback={itemBoxActionCallback}
          actions={actions}
        />
      )}
    </>
  )
}
