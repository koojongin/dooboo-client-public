'use client'

import Swal, { SweetAlertResult } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useEffect, useState } from 'react'
import { Tooltip } from '@material-tailwind/react'
import { Item, ItemTypeKind } from '@/interfaces/item.interface'
import { toColorByGrade } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import { fetchPostAddToAuction } from '@/services/api/api.auction'

function SaleDialogContent({
  item,
  setAmount,
}: {
  item: Item
  setAmount: (value: number) => void
}) {
  const [value, setValue] = useState<number>(1)

  useEffect(() => {
    setAmount(value)
    console.log(value)
  }, [setAmount, value])
  return (
    <div>
      {item.iType === ItemTypeKind.Weapon && (
        <>
          <div className="flex items-center justify-center">
            <div className="bg-gray-400 flex items-center gap-[5px] p-[10px]">
              <img
                className="w-[40px] h-[40px] border-2 p-[2px] rounded bg-gray-200 shadow-md shadow-gray-400"
                style={{
                  borderColor: toColorByGrade(item.weapon.iGrade),
                }}
                src={toAPIHostURL(item.weapon.thumbnail)}
              />
              <div className="ff-wavve text-white min-w-[150px]">
                {item.weapon.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start text-[14px] mt-[15px]">
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>판매 수수료는 10%입니다.</div>
            </div>
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>등록은 무료이며, 수수료는 판매되는 순간 정산됩니다.</div>
            </div>
          </div>
        </>
      )}
      {item.iType === ItemTypeKind.Misc && (
        <>
          <div className="flex items-center justify-center">
            <div className="bg-gray-400 flex items-center gap-[5px] p-[10px]">
              <img
                className="w-[40px] h-[40px] border-2 p-[2px] rounded bg-gray-200 shadow-md shadow-gray-400"
                style={{
                  borderColor: toColorByGrade(item.misc.baseMisc.iGrade),
                }}
                src={toAPIHostURL(item.misc.baseMisc.thumbnail)}
              />
              <div className="ff-wavve text-white min-w-[150px]">
                {item.misc.baseMisc.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start text-[14px] mt-[15px]">
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>판매 수수료는 10%입니다.</div>
            </div>
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>등록은 무료이며, 수수료는 판매되는 순간 정산됩니다.</div>
            </div>
          </div>
          <div className="flex py-[4px]">
            <Tooltip
              content={
                <div>
                  전투 중이라면 최종적으로 획득한 수량으로 등록됩니다.
                  <br />
                  선택한 아이템의 수량만 계산하여 등록됩니다.
                </div>
              }
            >
              <div className="flex justify-start items-center gap-[8px] border border-gray-600 border-dashed p-[4px] cursor-pointer">
                <div className="flex items-center gap-[2px]">
                  <div className="ff-ba ff-skew text-[16px]">수량</div>
                  <i className="fa-regular fa-circle-question text-[14px]" />
                </div>
                <input
                  disabled
                  className="ff-ba ff-skew border border-gray-600 bg-gray-600 text-white p-[4px] py-[2px] text-[14px] w-[50px]"
                  placeholder="수량"
                  type="number"
                  value={item.misc.stack}
                  // onChange={(e) => setValue(parseInt(e.target.value, 10))}
                />
              </div>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  )
}

export async function confirmSaleSetting(item: Item) {
  if (!item?._id) return

  if (
    ![ItemTypeKind.Weapon, ItemTypeKind.Misc].includes(
      item.iType as ItemTypeKind,
    )
  ) {
    return Swal.fire({
      text: '거래소에 등록할수 없는 아이템입니다.',
      icon: 'info',
      confirmButtonText: '닫기',
    })
  }

  let amount = 0
  const setAmount = (value: number) => {
    amount = value
  }

  return withReactContent(Swal).fire({
    title: `판매 가격을 설정하세요`,
    input: 'number',
    html: <SaleDialogContent item={item} setAmount={setAmount} />,
    inputAttributes: {
      autocapitalize: 'off',
    },
    showCancelButton: true,
    confirmButtonText: '등록하기',
    cancelButtonText: '취소',
    showLoaderOnConfirm: true,
    preConfirm: async (goldString: string) => {
      const gold = parseInt(goldString, 10)
      const minGold = 100
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
        return await fetchPostAddToAuction(item._id!, { gold, amount })
      } catch (error) {
        Swal.showValidationMessage(`
        Request failed: ${error}
      `)
      }
    },
    allowOutsideClick: () => !Swal.isLoading(),
  })
}
