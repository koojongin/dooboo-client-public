'use client'

import Swal from 'sweetalert2'
import _ from 'lodash'
import { ReactNode } from 'react'
import { Weapon } from '@/interfaces/item.interface'
import { fetchEquipItem } from '@/services/api-fetch'
import { socket } from '@/services/socket'
import { EMIT_SHARE_ITEM_EVENT } from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import {
  AttributeColor,
  getAttributeColor,
  toColorByGrade,
  toColorTextByGrade,
  toMMDDHHMMSS,
  translate,
} from '@/services/util'
import { InventoryActionKind } from '../item.interface'
import { confirmSaleSetting } from '@/components/auction/add-to-auction-confirm'
import { BA_COLOR } from '@/constants/constant'

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

  const lockItem = async () => {
    if (actionCallback) actionCallback()
    await Swal.fire({
      title: '준비중',
    })
    if (actionCallback) actionCallback()
  }

  return (
    <div
      key={createKey()}
      className="flex flex-col min-w-[300px] text-white bg-[#152e3ee6] rounded shadow-gray-400 shadow-xl border-2 ff-score-all font-bold"
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
        <div className="ff-wavve font-normal text-[24px] flex flex-wrap gap-[2px] items-center justify-center">
          {Object.keys(selectedItem.imprinting || {}).length > 0 && (
            <div
              className="w-[30px] h-[30px] bg-contain bg-center"
              style={{
                backgroundImage: `url('/images/black-smith/imprinting.png')`,
              }}
            />
          )}
          {selectedItem.name}
        </div>
        {selectedItem.starForce > 0 && selectedItem.iLevel > 30 && (
          <div className="flex items-center justify-center gap-[4px]">
            <div
              className="bg-contain bg-no-repeat bg-center w-[20px] h-[20px]"
              style={{
                backgroundImage: `url('/images/black-smith/scroll.png')`,
              }}
            />
            <div className="ff-wavve">+{selectedItem.enhancedValue}</div>
            {selectedItem.failedEnhancementCount > 0 && (
              <div className="ml-[4px] flex items-center justify-center gap-[4px] border-2 border-red-500 border-dashed p-[2px] bg-red-400">
                <div
                  className="bg-contain bg-no-repeat bg-center w-[20px] h-[20px]"
                  style={{
                    backgroundImage: `url('/images/black-smith/enhance-failed.png')`,
                  }}
                />
                <div className="ff-wavve px-[4px]">
                  -{selectedItem.failedEnhancementCount}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-[10px] py-[4px] pt-[6px] flex flex-wrap gap-[2px] font-normal">
        <ItemOptionLabel
          content={<div>{translate(selectedItem.weaponType) || '없음'}</div>}
        />
        <ItemOptionLabel content={<div>iLv:{selectedItem.iLevel}</div>} />
        <ItemOptionLabel
          style={{
            backgroundColor: toColorByGrade(selectedItem.iGrade),
            color: toColorTextByGrade(selectedItem.iGrade),
          }}
          content={<div>{translate(selectedItem.iGrade) || '없음'}</div>}
        />

        <ItemOptionLabel
          content={<div>착용 레벨 {selectedItem.requiredEquipmentLevel}</div>}
        />
      </div>
      <div className="border-b border-b-gray-400 border-dotted" />
      {Object.keys(selectedItem.imprinting || {}).length > 0 && (
        <>
          <div className="px-[10px] pt-[2px] text-[14px] my-[4px]">
            <div className="flex items-center gap-[2px]">
              <div
                className="w-[14px] h-[14px] bg-contain bg-center"
                style={{
                  backgroundImage: `url('/images/black-smith/imprinting.png')`,
                }}
              />
              <div>명품화 속성</div>
            </div>
            <div className="border-b border-b-gray-400 my-[2px]" />
            {Object.keys(selectedItem.imprinting).map((imprintingKey) => {
              const imprintingData = selectedItem.imprinting[imprintingKey]
              const { value } = imprintingData
              return (
                <div
                  className="flex items-center justify-between"
                  key={createKey()}
                >
                  <div>{translate(`imprinting:${imprintingKey}`)}</div>
                  <div>{value}</div>
                </div>
              )
            })}
          </div>
        </>
      )}
      <div className="px-[10px] pt-[2px] text-[14px]">
        <div className="mt-[6px]">
          기본 속성({selectedItem.totalFlatDamage?.toLocaleString()})
        </div>
        <div className="border-b border-b-gray-400" />
      </div>
      <div className="px-[10px] py-[5px] flex flex-wrap gap-[2px] max-w-[300px] font-normal">
        <ItemOptionLabel
          content={<div>초당 공격속도 {selectedItem.attackSpeed}</div>}
        />
        {selectedItem.damageOfPhysical > 0 && (
          <ItemOptionLabel
            content={<div>물리 피해 {selectedItem.damageOfPhysical}</div>}
          />
        )}
        {selectedItem.damageOfCold > 0 && (
          <ItemOptionLabel
            style={{
              backgroundColor: AttributeColor.Cold,
            }}
            content={<div>냉기 피해 {selectedItem.damageOfCold}</div>}
          />
        )}
        {selectedItem.damageOfFire > 0 && (
          <ItemOptionLabel
            style={{
              backgroundColor: AttributeColor.Fire,
            }}
            content={<div>화염 피해 {selectedItem.damageOfFire}</div>}
          />
        )}
        {selectedItem.damageOfLightning > 0 && (
          <ItemOptionLabel
            style={{
              backgroundColor: AttributeColor.Lightning,
            }}
            content={<div>번개 피해 {selectedItem.damageOfLightning}</div>}
          />
        )}
        {selectedItem.criticalRate > 0 && (
          <ItemOptionLabel
            content={<div>치명타 확률 {selectedItem.criticalRate}%</div>}
          />
        )}
        {selectedItem.criticalMultiplier > 0 && (
          <ItemOptionLabel
            content={<div>치명타 배율 {selectedItem.criticalMultiplier}%</div>}
          />
        )}
        {selectedItem?.injectedCard && (
          <div
            className={`p-[4px] flex items-center justify-center text-[14px] bg-contain m-0 
          text-[${BA_COLOR}]`}
            style={{
              backgroundImage: `url('/images/pickup/background.png')`,
            }}
          >
            <div className="ff-wavve flex flex-wrap items-center">
              {selectedItem.card && (
                <>
                  <div className="flex items-center justify-center ff-ba">
                    {new Array(selectedItem.card.starForce).fill(1).map(() => (
                      <img
                        key={createKey()}
                        className="w-[12px] h-[12px]"
                        src="/images/star_on.png"
                      />
                    ))}
                  </div>
                </>
              )}
              {translate(`card:${selectedItem.injectedCard}`)} 효과 보유
            </div>
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
      {actions && (
        <div className="px-[10px] py-[2px]">
          <div className="flex justify-between">
            <div>획득일시</div>
            <div>{toMMDDHHMMSS(item.createdAt)}</div>
          </div>
        </div>
      )}
      {actions && (
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
              {actions &&
                actions.includes(InventoryActionKind.AddToAuction) && (
                  <div
                    className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                    onClick={() => lockItem()}
                  >
                    잠그기
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ItemOptionLabel({
  className,
  content,
  style,
}: {
  className?: string
  content: ReactNode
  style?: any
}) {
  return (
    <div
      className={`ff-ba-all ff-skew p-[2px] border bg-gray-600 text-white flex items-center justify-center ${className}`}
      style={style || {}}
    >
      {content}
    </div>
  )
}
