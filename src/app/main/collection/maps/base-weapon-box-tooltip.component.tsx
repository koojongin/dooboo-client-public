import { DropTableItem } from '@/interfaces/drop-table.interface'
import { translate } from '@/services/util'

export function BaseWeaponBoxTooltipComponent({
  item,
}: {
  item: DropTableItem
}) {
  const selectedItem = item.item
  return (
    <div className="flex flex-col gap-[2px] bg-white rounded p-[12px] border border-gray-300 text-[#34343a] min-w-[300px] shadow-md drop-shadow-lg">
      <div className="text-[20px]">{selectedItem?.name}</div>
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {translate(selectedItem.weaponType)}(ilv:{selectedItem.iLevel})
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
      <div className="flex items-center">
        착용레벨:{selectedItem.requiredEquipmentLevel}
      </div>
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex flex-col gap-[1px]">
        <div className="flex justify-between">
          <div>물리 피해</div>
          <div>
            {selectedItem.damageOfPhysical[0]} ~{' '}
            {selectedItem.damageOfPhysical[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>냉기 피해</div>
          <div>
            {selectedItem.damageOfCold[0]} ~ {selectedItem.damageOfCold[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>번개 피해</div>
          <div>
            {selectedItem.damageOfLightning[0]} ~{' '}
            {selectedItem.damageOfLightning[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>화염 피해</div>
          <div>
            {selectedItem.damageOfFire[0]} ~ {selectedItem.damageOfFire[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>치명타 확률</div>
          <div>
            {selectedItem.criticalRate[0]} ~ {selectedItem.criticalRate[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>치명타 배율</div>
          <div>
            {selectedItem.criticalMultiplier[0]} ~{' '}
            {selectedItem.criticalMultiplier[1]}
          </div>
        </div>
        <div className="border-b border-dashed border-dark-blue" />
        <div className="flex justify-between">
          <div>판매 금액</div>
          <div>{selectedItem.gold.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
