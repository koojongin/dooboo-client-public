import _ from 'lodash'
import Swal from 'sweetalert2'
import createKey from '@/services/key-generator'
import { DefenceGear } from '@/interfaces/item.interface'
import { ago, toColorByGrade, toMMDDHHMMSS, translate } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import { Auction } from '@/interfaces/auction.interface'
import {
  fetchPurchaseAuctionItem,
  fetchRetrieveAuctionItem,
} from '@/services/api/api.auction'

export function DefenceGearBoxStaticComponent({
  auction,
  defenceGear,
  isOwn,
  refresh,
}: {
  auction: Auction
  defenceGear: DefenceGear
  isOwn: boolean
  refresh: () => void
}) {
  const isExistAdditionalAttributes =
    Object.keys(defenceGear.additionalAttributes || {}).length > 0

  const purchaseAuctionItem = async (auctionId: string) => {
    const { isConfirmed } = await Swal.fire({
      title: '정말로 구매하시겠습니까?',
      text: '',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const result = await fetchPurchaseAuctionItem(auctionId)
      await Swal.fire({
        title: '구매 성공!',
        icon: 'success',
        denyButtonText: `닫기`,
      })
      // loadWeapons(lastSearchOptions?.condition, lastSearchOptions?.opts)
      refresh()
    }
  }

  const retrieveAuctionItem = async (auctionId: string) => {
    const { isConfirmed } = await Swal.fire({
      title: '정말로 회수하시겠습니까?',
      text: '',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const result = await fetchRetrieveAuctionItem(auctionId)
      await Swal.fire({
        title: '회수되었습니다.',
        icon: 'success',
        denyButtonText: `닫기`,
      })
      refresh()
    }
  }

  return (
    <div
      key={createKey()}
      className="relative text-[14px] p-[4px] flex flex-col min-w-[300px] text-white bg-[#555d62ed] rounded shadow-gray-400 shadow-xl border-2 group"
      style={{
        borderColor: toColorByGrade(defenceGear.iGrade),
      }}
    >
      <div className="gap-[4px] flex flex-col absolute z-100 bg-gray-400 bg-opacity-55 overflow-hidden w-full h-full left-0 top-0 items-center justify-center invisible group-hover:visible">
        <div className="flex flex-row gap-[2px] items-center w-full bg-yellow-700 justify-center py-[5px]">
          <img src="/images/icon_currency.png" className="w-[24px]" />
          <div className="text-[20px] ff-wavve ">
            {auction.gold.toLocaleString()}
          </div>
        </div>
        {!isOwn && (
          <div
            className="flex items-center justify-center bg-green-400 text-white cursor-pointer text-[20px] px-[12px] py-[4px] ff-wavve rounded"
            onClick={() => purchaseAuctionItem(auction._id!)}
          >
            구매하기
          </div>
        )}
        {isOwn && (
          <div
            className="flex items-center justify-center bg-red-500 text-white cursor-pointer text-[20px] px-[12px] py-[4px] ff-wavve rounded"
            onClick={() => retrieveAuctionItem(auction._id!)}
          >
            회수하기
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-[2px] items-center">
          <img src="/images/icon_currency.png" className="w-[24px]" />
          <div>{auction.gold.toLocaleString()}</div>
        </div>
        <div>
          <div />
          <div>{auction.owner.nickname}</div>
        </div>
      </div>
      <div className="text-[16px] flex items-stretch">
        <div
          className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] border-2 p-[2px] flex items-center justify-center border-r-0 bg-blue-gray-500"
          style={{
            borderColor: toColorByGrade(defenceGear.iGrade),
          }}
        >
          <img
            className="w-full h-full rounded overflow-hidden"
            src={toAPIHostURL(defenceGear.thumbnail)}
          />
        </div>
        <div
          className={`w-full border-2 border-l-0 flex items-center pl-[4px] ff-wavve text-[20px] ${defenceGear.iGrade === 'normal' ? 'text-dark-blue' : ''}`}
          style={{
            borderColor: toColorByGrade(defenceGear.iGrade),
            background: toColorByGrade(defenceGear.iGrade),
          }}
        >
          {defenceGear.name}
          {defenceGear.starForce > 0 ? ` [+${defenceGear.starForce}]` : ''}
        </div>
      </div>
      <div className="bg-gray-800/20 p-[2px] flex justify-center items-center gap-[5px]">
        <div
          className="bg-contain bg-no-repeat bg-center w-[20px] h-[20px]"
          style={{
            backgroundImage: `url('/images/black-smith/scroll.png')`,
          }}
        />
        <div className="ff-wavve">+{defenceGear.enhancedValue}</div>
      </div>

      <div className="mt-[4px]">
        <div className="flex items-center flex-wrap gap-[1px]">
          {new Array(defenceGear.maxStarForce)
            .fill(1)
            .map((value: any, index: number) => {
              const isOnStarForce = defenceGear.starForce > index
              return (
                <div className="w-[16px] h-[16px]" key={createKey()}>
                  <img
                    className="w-full h-full"
                    src={`/images/star_${isOnStarForce ? 'on' : 'off'}.png`}
                  />
                </div>
              )
            })}
        </div>
      </div>

      <div className="mt-[5px] flex items-center w-full gap-[2px] flex-wrap">
        <div className="flex items-center justify-center px-[4px] py-[1px] bg-white text-gray-800 ff-ba font-bold border-dotted border">
          {translate(defenceGear.gearType)}
        </div>
        <div
          className={`flex items-center justify-center px-[4px] py-[1px] bg-white ${defenceGear.iGrade === 'normal' ? 'text-black' : 'text-white'} ff-ba font-bold border-dotted border`}
          style={{
            background: toColorByGrade(defenceGear.iGrade),
          }}
        >
          {translate(defenceGear.iGrade)}
        </div>
        <div className="flex items-center justify-center px-[4px] py-[1px] bg-white text-gray-800 ff-ba font-bold border-dotted border">
          iLv.{defenceGear.iLevel}
        </div>
      </div>

      {/* 장비 정보---------*/}
      <div>
        <div className="py-[2px] pt-[6px]">
          <div className="flex justify-between">
            <div className="">착용 레벨</div>
            <div>{defenceGear.requiredEquipmentLevel}</div>
          </div>
          {!!defenceGear.requiredEquipmentStr && (
            <div className="flex justify-between">
              <div className="">착용 힘</div>
              <div>{defenceGear.requiredEquipmentStr}</div>
            </div>
          )}
          {!!defenceGear.requiredEquipmentDex && (
            <div className="flex justify-between">
              <div className="">착용 민첩</div>
              <div>{defenceGear.requiredEquipmentDex}</div>
            </div>
          )}
          {!!defenceGear.requiredEquipmentLuk && (
            <div className="flex justify-between">
              <div className="">착용 행운</div>
              <div>{defenceGear.requiredEquipmentLuk}</div>
            </div>
          )}
        </div>
        <div className="border-b border-b-gray-400 border-dotted" />
        <div className="pt-[2px] text-[14px]">
          <div className="mt-[6px]">기본 속성</div>
          <div className="border-b border-b-gray-400" />
        </div>
        <div className="">
          {['str', 'dex', 'luk', 'hp', 'mp']
            .filter((key) => !!(defenceGear as any)[key])
            .map((attributeName) => {
              const data = (defenceGear as any)[attributeName]
              return (
                <div key={createKey()} className="flex justify-between">
                  <div className="">{translate(attributeName)}</div>
                  <div>{data}</div>
                </div>
              )
            })}

          {!!defenceGear.armor && (
            <div className="flex justify-between">
              <div className="">방어력</div>
              <div>{defenceGear.armor}</div>
            </div>
          )}
          {!!defenceGear.evasion && (
            <div className="flex justify-between">
              <div className="">회피</div>
              <div>{defenceGear.evasion}</div>
            </div>
          )}
          {!!defenceGear.energyShield && (
            <div className="flex justify-between">
              <div className="">에너지 실드</div>
              <div>{defenceGear.energyShield}</div>
            </div>
          )}
        </div>
        <>
          {isExistAdditionalAttributes && (
            <div>
              <div className="border-b border-b-gray-400 border-dotted" />
              <div className="mt-[6px] text-[#ffea00]">추가 속성</div>
            </div>
          )}
          {isExistAdditionalAttributes && (
            <div className="">
              <div className="border-b border-b-gray-400" />
              {_.sortBy(
                Object.keys(defenceGear.additionalAttributes || {}),
                (k) => k,
              ).map((key: string) => {
                const attributeValue = (defenceGear.additionalAttributes || {})[
                  key
                ]
                const isEnchanted =
                  defenceGear.enchants?.fixedAttributeName === key
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
      </div>

      <div className="w-full bg-gray-800 text-white p-[4px] py-[2px] mt-auto">
        <div className="flex justify-between">
          <div className="ff-wavve">{ago(auction.createdAt!)}</div>
          <div className="ff-wavve text-gray-300">
            {toMMDDHHMMSS(auction.createdAt!)}
          </div>
        </div>
      </div>
    </div>
  )
}
