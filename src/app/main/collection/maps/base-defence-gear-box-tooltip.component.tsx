import { DropTableItem } from '@/interfaces/drop-table.interface'
import { translate } from '@/services/util'
import { BaseDefenceGear, BaseWeapon } from '@/interfaces/item.interface'

export function BaseDefenceGearBoxTooltipComponent({
  item,
}: {
  item: DropTableItem
}) {
  const selectedItem = item.item
  return <BaseDefenceGearBoxComponent baseDefenceGear={selectedItem} />
}

export function BaseDefenceGearBoxComponent({
  baseDefenceGear,
}: {
  baseDefenceGear: BaseDefenceGear
}) {
  const selectedItem = baseDefenceGear
  const isExistRangedAttribute = (range: number[]) => {
    return range[0] + range[1] > 0
  }
  return (
    <div className="flex flex-col gap-[2px] bg-white rounded p-[12px] border border-gray-300 text-[#34343a] min-w-[300px] shadow-md drop-shadow-lg">
      <div className="text-[20px]">{selectedItem?.name}</div>
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {translate(selectedItem.gearType)}(ilv:{selectedItem.iLevel})
        </div>
        <div className="flex items-center justify-center">
          <img
            className="mb-[4px] w-[16px] h-[16px]"
            src="/images/star_on.png"
          />
          <div className="ff-gs flex items-center">
            x{selectedItem.maxStarForce}
          </div>
        </div>
      </div>
      {!!selectedItem.requiredEquipmentLevel && (
        <div className="flex items-center">
          착용 레벨:{selectedItem.requiredEquipmentLevel}
        </div>
      )}
      {!!selectedItem.requiredEquipmentStr && (
        <div className="flex items-center">
          착용 힘:{selectedItem.requiredEquipmentStr}
        </div>
      )}
      {!!selectedItem.requiredEquipmentDex && (
        <div className="flex items-center">
          착용 민첩:{selectedItem.requiredEquipmentDex}
        </div>
      )}
      {!!selectedItem.requiredEquipmentLuk && (
        <div className="flex items-center">
          착용 행운:{selectedItem.requiredEquipmentLuk}
        </div>
      )}
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex flex-col gap-[1px]">
        {isExistRangedAttribute(selectedItem.armor) && (
          <div className="flex justify-between">
            <div>방어력</div>
            <div>
              {selectedItem.armor[0]} ~ {selectedItem.armor[1]}
            </div>
          </div>
        )}

        {isExistRangedAttribute(selectedItem.evasion) && (
          <div className="flex justify-between">
            <div>회피</div>
            <div>
              {selectedItem.evasion[0]} ~ {selectedItem.evasion[1]}
            </div>
          </div>
        )}

        {isExistRangedAttribute(selectedItem.energyShield) && (
          <div className="flex justify-between">
            <div>에너지 실드</div>
            <div>
              {selectedItem.energyShield[0]} ~ {selectedItem.energyShield[1]}
            </div>
          </div>
        )}

        <div className="border-b border-dashed border-dark-blue" />
        <div className="flex justify-between">
          <div>판매 금액</div>
          <div>{selectedItem.gold.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
