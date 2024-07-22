'use client'

import Swal from 'sweetalert2'
import _ from 'lodash'
import { DefenceGear, Item, Weapon } from '@/interfaces/item.interface'
import { fetchEquipDefenceGear, fetchEquipItem } from '@/services/api-fetch'
import { socket } from '@/services/socket'
import { EMIT_SHARE_ITEM_EVENT } from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import { toColorByGrade, toMMDDHHMMSS, translate } from '@/services/util'
import { InventoryActionKind } from '../item.interface'
import { confirmSaleSetting } from '@/components/auction/add-to-auction-confirm'

export default function DefenceGearBoxDetailComponent({
  item,
  actionCallback,
  actions,
}: {
  item: Item | any
  actions?: string[]
  actionCallback?: (type?: string) => void
}) {
  const selectedItem: DefenceGear = item.defenceGear
  const equipItem = async (eItem: DefenceGear | any) => {
    await fetchEquipDefenceGear(eItem._id, selectedItem.gearType)
    if (actionCallback) actionCallback(InventoryActionKind.Equip)
  }

  const isExistAdditionalAttributes =
    Object.keys(selectedItem.additionalAttributes || {}).length > 0
  const shareItem = async (eItem: Weapon | any) => {
    socket.emit(EMIT_SHARE_ITEM_EVENT, { itemId: eItem._id })
  }

  const addToAuction = async () => {
    if (actionCallback) actionCallback(InventoryActionKind.AddToAuction)
    const { isConfirmed, value } = (await confirmSaleSetting(item)) || {}

    if (isConfirmed) {
      await Swal.fire({
        title: '등록되었습니다',
      })
      if (actionCallback) actionCallback()
    }
  }

  return (
    <div
      key={createKey()}
      className="flex flex-col min-w-[300px] text-white bg-[#555d62ed] rounded shadow-gray-400 shadow-xl border-2 "
      style={{
        borderColor: toColorByGrade(selectedItem.iGrade),
      }}
    >
      <div className="flex items-center justify-center py-[6px]">
        <div className="flex items-center justify-center flex-wrap max-w-[260px]">
          {new Array(selectedItem?.maxStarForce).fill(1).map((v, index) => {
            const isOnStarForce = index < selectedItem.starForce
            return (
              <div key={createKey()} className="flex">
                {index > 3 &&
                  (index + 1) % 5 === 1 &&
                  (index + 1) % 15 !== 1 && (
                    <div className="w-[10px] h-[2px]" />
                  )}
                <img
                  className="w-[16px] h-[16px]"
                  key={createKey()}
                  src={`/images/star_${isOnStarForce ? 'on' : 'off'}.png`}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className="text-center bg-[#9bb5c44f] py-[5px]">
        <div className="ff-wavve text-[24px]">{selectedItem.name}</div>
        {selectedItem.starForce > 0 && (
          <div className="flex items-center justify-center gap-[4px]">
            <div
              className="bg-contain bg-no-repeat bg-center w-[20px] h-[20px]"
              style={{
                backgroundImage: `url('/images/black-smith/scroll.png')`,
              }}
            />
            <div className="ff-wavve">+{selectedItem.enhancedValue}</div>
          </div>
        )}
      </div>
      <div className="px-[10px] py-[2px] pt-[6px]">
        <div className="flex justify-between">
          <div className="">장비 분류</div>
          <div>{translate(selectedItem.gearType) || '없음'}</div>
        </div>
        <div className="flex justify-between">
          <div className="">아이템 레벨</div>
          <div>{selectedItem.iLevel}</div>
        </div>
        <div className="flex justify-between">
          <div className="">등급</div>
          <div style={{ color: toColorByGrade(selectedItem.iGrade) }}>
            {translate(selectedItem.iGrade) || '없음'}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="">착용 레벨</div>
          <div>{selectedItem.requiredEquipmentLevel}</div>
        </div>
        {!!selectedItem.requiredEquipmentStr && (
          <div className="flex justify-between">
            <div className="">착용 힘</div>
            <div>{selectedItem.requiredEquipmentStr}</div>
          </div>
        )}
        {!!selectedItem.requiredEquipmentDex && (
          <div className="flex justify-between">
            <div className="">착용 민첩</div>
            <div>{selectedItem.requiredEquipmentDex}</div>
          </div>
        )}
        {!!selectedItem.requiredEquipmentLuk && (
          <div className="flex justify-between">
            <div className="">착용 행운</div>
            <div>{selectedItem.requiredEquipmentLuk}</div>
          </div>
        )}
      </div>
      <div className="border-b border-b-gray-400 border-dotted" />
      <div className="px-[10px] pt-[2px] text-[14px]">
        <div className="mt-[6px]">기본 속성</div>
        <div className="border-b border-b-gray-400" />
      </div>
      <div className="px-[10px]">
        {['str', 'dex', 'luk', 'hp', 'mp']
          .filter((key) => !!(selectedItem as any)[key])
          .map((attributeName) => {
            const data = (selectedItem as any)[attributeName]
            return (
              <div key={createKey()} className="flex justify-between">
                <div className="">{translate(attributeName)}</div>
                <div>{data}</div>
              </div>
            )
          })}

        {!!selectedItem.armor && (
          <div className="flex justify-between">
            <div className="">방어력</div>
            <div>{selectedItem.armor}</div>
          </div>
        )}
        {!!selectedItem.evasion && (
          <div className="flex justify-between">
            <div className="">회피</div>
            <div>{selectedItem.evasion}</div>
          </div>
        )}
        {!!selectedItem.energyShield && (
          <div className="flex justify-between">
            <div className="">에너지 실드</div>
            <div>{selectedItem.energyShield}</div>
          </div>
        )}
      </div>
      <>
        {isExistAdditionalAttributes && (
          <div>
            <div className="border-b border-b-gray-400 border-dotted" />
            <div className="px-[10px] mt-[6px] text-[#ffea00]">추가 속성</div>
          </div>
        )}
        {isExistAdditionalAttributes && (
          <div className="px-[10px]">
            <div className="border-b border-b-gray-400" />
            {_.sortBy(
              Object.keys(selectedItem.additionalAttributes || {}),
              (k) => k,
            ).map((key: string) => {
              const attributeValue = (selectedItem.additionalAttributes || {})[
                key
              ]
              const isEnchanted =
                selectedItem.enchants?.fixedAttributeName === key
              return (
                <div
                  key={createKey()}
                  className={isEnchanted ? 'text-green-500' : ''}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-[2px]">
                      {isEnchanted && (
                        <i className="fa-solid fa-wrench text-[12px]" />
                      )}
                      <div>{translate(key)}</div>
                    </div>
                    <div>{attributeValue}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </>
      <div className="border-b border-b-gray-400 border-dotted" />
      <div className="px-[10px] py-[2px]">
        <div className="flex justify-between items-center">
          <div className="">판매가</div>
          <div className="flex items-center gap-[2px]">
            <img src="/images/icon_currency.png" className="w-[24px]" />
            <div>{selectedItem.gold.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div className="border-b border-b-gray-400 border-dotted" />
      <div className="px-[10px] py-[2px]">
        <div className="flex justify-between">
          <div>획득일시</div>
          <div>{toMMDDHHMMSS(item.createdAt)}</div>
        </div>
      </div>
      <>
        <div className="px-[10px] py-[2px] mb-[4px]">
          <div className="flex items-center gap-1">
            {actions && actions.includes(InventoryActionKind.Equip) && (
              <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => equipItem(item)}
              >
                착용
              </div>
            )}
            {actions && actions.includes(InventoryActionKind.Share) && (
              <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => shareItem(item)}
              >
                공유
              </div>
            )}
            {actions && actions.includes(InventoryActionKind.AddToAuction) && (
              <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => addToAuction()}
              >
                거래소 등록
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  )
}
