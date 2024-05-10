'use client'

import Swal from 'sweetalert2'
import _ from 'lodash'
import { Weapon } from '@/interfaces/item.interface'
import { fetchEquipItem, fetchPostAddToAuction } from '@/services/api-fetch'
import { socket } from '@/services/socket'
import { EMIT_SHARE_ITEM_EVENT } from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import { toColorByGrade, toMMDDHHMMSS, translate } from '@/services/util'
import { InventoryActionKind } from './item.interface'

export default function MiscBoxDetailComponent({
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
  const selectedItem = item.misc

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
    const { isConfirmed, value } = await Swal.fire({
      title: `판매 가격을 설정하세요`,
      input: 'number',
      html: `<div><div>${item.weapon.name}</div><div>판매 수수료는 10%입니다.</div><div>등록은 무료이며, 수수료는 판매되는 순간 정산됩니다.</div></div>`,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: '등록하기',
      cancelButtonText: '취소',
      showLoaderOnConfirm: true,
      preConfirm: async (goldString: string) => {
        const gold = parseInt(goldString, 10)
        const minGold = 1
        const maxGold = 100000000
        if (gold < minGold) {
          return Swal.showValidationMessage(
            `최소 설정 금액 제한
            ${minGold.toLocaleString()}`,
          )
        }
        if (gold > maxGold) {
          return Swal.showValidationMessage(
            `최대 설정 금액 한도 초과
            ${maxGold.toLocaleString()}`,
          )
        }
        try {
          return await fetchPostAddToAuction(item._id, { gold })
        } catch (error) {
          Swal.showValidationMessage(`
        Request failed: ${error}
      `)
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })

    if (isConfirmed) {
      await Swal.fire({
        title: '등록되었습니다',
      })
      if (actionCallback) actionCallback()
    }
  }

  return (
    <>
      {selectedItem && (
        <div
          key={createKey()}
          className="flex flex-col min-w-[300px] text-white bg-[#555d62ed] rounded shadow-gray-400 shadow-xl border-2 "
          style={{
            borderColor: toColorByGrade(selectedItem?.baseMisc?.iGrade),
          }}
        >
          <div className="text-center text-[24px] py-[4px] bg-[#9bb5c44f] ff-wavve">
            {selectedItem.baseMisc.name}
          </div>
          <div className="px-[10px] py-[2px] pt-[6px]">
            <div className="flex justify-between">
              <div className="">카테고리</div>
              <div>{translate(selectedItem.baseMisc.category)}</div>
            </div>
            <div className="flex justify-between">
              <div className="">아이템 레벨</div>
              <div>{selectedItem.baseMisc.iLevel}</div>
            </div>
            <div className="flex justify-between">
              <div className="">등급</div>
              <div
                style={{ color: toColorByGrade(selectedItem.baseMisc.iGrade) }}
              >
                {translate(selectedItem.baseMisc.iGrade) || '없음'}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="">개수</div>
              <div>
                {selectedItem.stack}/{selectedItem.baseMisc?.maxStack}
              </div>
            </div>
          </div>
          <div className="flex justify-between bg-gray-300 text-blue-gray-600 min-h-[30px] p-[10px]">
            {selectedItem.baseMisc.desc}
          </div>
          <div className="border-b border-b-gray-400 border-dotted" />
          <div className="px-[10px] py-[2px]">
            <div className="flex justify-between items-center">
              <div className="">판매가</div>
              <div className="flex items-center gap-[2px]">
                <img src="/images/icon_currency.png" className="w-[24px]" />
                <div>{selectedItem.baseMisc.gold.toLocaleString()}</div>
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
                {actions && actions.includes(InventoryActionKind.Share) && (
                  <div
                    className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                    onClick={() => shareItem(item)}
                  >
                    공유
                  </div>
                )}
                {/* {actions && actions.includes(InventoryActionKind.AddToAuction) && (
              <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => addToAuction()}
              >
                거래소 등록
              </div>
            )} */}
              </div>
            </div>
          </>
        </div>
      )}
      {!selectedItem && <div>-</div>}
    </>
  )
}
