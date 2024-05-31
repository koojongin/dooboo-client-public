import { DropTableItem } from '@/interfaces/drop-table.interface'
import { translate } from '@/services/util'

export function BaseMiscBoxTooltipComponent({ item }: { item: DropTableItem }) {
  const selectedItem = item.item
  return (
    <div className="flex flex-col bg-white rounded py-[12px] border border-gray-300 text-[#34343a] min-w-[300px] shadow-md drop-shadow-lg max-w-[350px]">
      <div className="px-[12px] ff-wavve text-[20px]">{selectedItem?.name}</div>
      <div className="my-[6px] border-b border-dashed border-dark-blue" />
      <div className="px-[12px] flex items-center justify-between">
        <div>아이템 레벨</div>
        <div>{selectedItem.iLevel}</div>
      </div>
      <div className="px-[12px] flex items-center justify-between">
        <div>유형</div>
        <div>{translate(`iType:${selectedItem.iType}`)}</div>
      </div>
      <div className="px-[12px] flex items-center justify-between">
        <div>카테고리</div>
        <div>{translate(`iCategory:${selectedItem.category}`)}</div>
      </div>
      <div className="mt-[6px] border-b border-dashed border-dark-blue" />
      <div className="p-[12px] flex justify-between items-center bg-blue-gray-300 text-white">
        <div className="flex items-center">{selectedItem.desc}</div>
      </div>
      <div className="mb-[6px] border-b border-dashed border-dark-blue" />
      <div className="px-[12px] flex flex-col gap-[1px]">
        <div className="flex justify-between">
          <div>판매 금액</div>
          <div>{selectedItem.gold.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
