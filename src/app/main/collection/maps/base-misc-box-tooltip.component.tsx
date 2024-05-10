import { DropTableItem } from '@/interfaces/drop-table.interface'
import { translate } from '@/services/util'

export function BaseMiscBoxTooltipComponent({ item }: { item: DropTableItem }) {
  const selectedItem = item.item
  return (
    <div className="flex flex-col gap-[2px] bg-white rounded p-[12px] border border-gray-300 text-[#34343a] min-w-[300px] shadow-md drop-shadow-lg">
      <div className="text-[20px]">{selectedItem?.name}</div>
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex items-center justify-between">
        <div>아이템 레벨</div>
        <div>{selectedItem.iLevel}</div>
      </div>
      <div className="flex items-center justify-between">
        <div>카테고리</div>
        <div>{selectedItem.category}</div>
      </div>
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex justify-between items-center">
        <div className="flex items-center">{selectedItem.desc}</div>
      </div>
      <div className="flex flex-col gap-[1px]">
        <div className="border-b border-dashed border-dark-blue" />
        <div className="flex justify-between">
          <div>판매 금액</div>
          <div>{selectedItem.gold.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
