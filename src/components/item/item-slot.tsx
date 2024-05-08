import ItemBoxComponent from './item-box'
import { InventoryActionKind } from './item.interface'

export default function ItemSlot({
  items,
  indexInParent,
  maxItemSlots,
  onClickItem,
}: {
  items: any[]
  indexInParent: number
  maxItemSlots: number
  onClickItem: (param: number) => void
}) {
  const item = items[indexInParent]
  const disableSlotClass = 'bg-gray-800'
  const isOveredSlot = indexInParent >= maxItemSlots
  return (
    <div
      className={`relative bg-white relative flex border-[1px] border-r rounded-md w-[40px] h-[40px] ${isOveredSlot ? disableSlotClass : ''}`}
      style={{
        borderColor: `${item?.isSelected ? 'transparent' : ''}`,
      }}
      onClick={() => onClickItem(indexInParent)}
      // onClick={() => onSelectItem(item)}
    >
      {item?.isSelected && (
        <div className="w-full h-full absolute left-0 top-0 bg-red-500" />
      )}
      {isOveredSlot && (
        <div className="absolute z-10 bg-gray-800 bg-opacity-60 w-[40px] h-[40px] rounded" />
      )}
      {item && (
        <ItemBoxComponent
          className="p-[2px]"
          item={item}
          actions={[
            InventoryActionKind.Share,
            InventoryActionKind.AddToAuction,
          ]}
          onShowTotalDamage
          actionCallback={() => {}}
        />
      )}
    </div>
  )
}
