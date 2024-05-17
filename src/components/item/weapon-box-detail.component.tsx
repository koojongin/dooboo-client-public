'use client'

import Swal from 'sweetalert2'
import _ from 'lodash'
import { Weapon } from '@/interfaces/item.interface'
import { fetchEquipItem } from '@/services/api-fetch'
import { socket } from '@/services/socket'
import { EMIT_SHARE_ITEM_EVENT } from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import { toColorByGrade, toMMDDHHMMSS, translate } from '@/services/util'
import { InventoryActionKind } from './item.interface'
import { confirmSaleSetting } from '@/components/auction/add-to-auction-confirm'

export default function WeaponBoxDetailComponent({
  item,
  actionCallback,
  onShowTotalDamage = false,
  actions,
  parent,
}: {
  item: Weapon | any
  parent?: any
  actions?: string[]
  onShowTotalDamage?: boolean
  actionCallback?: (type?: string) => void
}) {
  const selectedItem = item.weapon
  if (!selectedItem.totalFlatDamage) {
    selectedItem.totalFlatDamage =
      selectedItem.damageOfPhysical +
      selectedItem.damageOfFire +
      selectedItem.damageOfCold +
      selectedItem.damageOfLightning
  }
  const equipItem = async (eItem: Weapon | any) => {
    await fetchEquipItem(eItem._id)
    if (actionCallback) actionCallback(InventoryActionKind.Equip)
  }

  const isExistAdditionalAttributes =
    Object.keys(selectedItem.additionalAttributes || {}).length > 0
  const shareItem = async (eItem: Weapon | any) => {
    socket.emit(EMIT_SHARE_ITEM_EVENT, { itemId: eItem._id })
  }

  const sellItem = async (eItem: Weapon | any) => {
    await Swal.fire({
      title: '미지원',
      text: '미지원',
      icon: 'info',
      confirmButtonText: '확인',
    })
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
      <div className="text-center text-2xl bg-[#9bb5c44f] ff-wavve">
        {selectedItem.name}
      </div>
      <div className="px-[10px] py-[2px] pt-[6px]">
        <div className="flex justify-between">
          <div className="">장비 분류</div>
          <div>{translate(selectedItem.weaponType) || '없음'}</div>
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
      </div>
      <div className="border-b border-b-gray-400 border-dotted" />
      <div className="px-[10px] pt-[2px] text-[14px]">
        <div className="mt-[6px]">
          기본 속성({selectedItem.totalFlatDamage?.toLocaleString()})
        </div>
        <div className="border-b border-b-gray-400" />
      </div>
      <div className="px-[10px]">
        {selectedItem.damageOfPhysical > 0 && (
          <div className="flex justify-between">
            <div className="">물리 피해</div>
            <div>{selectedItem.damageOfPhysical}</div>
          </div>
        )}
        {selectedItem.damageOfCold > 0 && (
          <div className="flex justify-between">
            <div className="">냉기 피해</div>
            <div>{selectedItem.damageOfCold}</div>
          </div>
        )}
        {selectedItem.damageOfFire > 0 && (
          <div className="flex justify-between">
            <div className="">화염 피해</div>
            <div>{selectedItem.damageOfFire}</div>
          </div>
        )}
        {selectedItem.damageOfLightning > 0 && (
          <div className="flex justify-between">
            <div className="">번개 피해</div>
            <div>{selectedItem.damageOfLightning}</div>
          </div>
        )}
        {selectedItem.criticalRate > 0 && (
          <div className="flex justify-between">
            <div className="">치명타 확률</div>
            <div>{selectedItem.criticalRate}</div>
          </div>
        )}
        {selectedItem.criticalMultiplier > 0 && (
          <div className="flex justify-between">
            <div className="">치명타 배율</div>
            <div>{selectedItem.criticalMultiplier}</div>
          </div>
        )}
      </div>
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
            const attributeValue = selectedItem.additionalAttributes[key]
            return (
              <div key={createKey()}>
                <div className="flex justify-between">
                  <div>{translate(key)}</div>
                  <div>{attributeValue}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
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
      {
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
              {actions &&
                actions.includes(InventoryActionKind.AddToAuction) && (
                  <div
                    className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                    onClick={() => addToAuction()}
                  >
                    거래소 등록
                  </div>
                )}
              {/*     <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => sellItem(item)}
              >
                판매
              </div> */}
            </div>
          </div>
        </>
      }
    </div>
  )
}
