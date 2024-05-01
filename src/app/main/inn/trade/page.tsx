'use client'

import { Card, Checkbox } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  fetchGetAuctions,
  fetchPurchaseAuctionItem,
} from '@/services/api-fetch'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { ago, toColorByGrade, toMMDDHHMMSS, translate } from '@/services/util'
import { Auction } from '@/interfaces/auction.interface'

export default function TradePage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>()
  const [selectedWeapons, setSelectedWeapons] = useState<
    { name: string; isSelected: boolean }[]
  >(
    ['axe', 'sword', 'dagger', 'bow', 'blunt', 'spear'].map((w) => ({
      name: w,
      isSelected: true,
    })),
  )
  const [pagenation, setPagenation] = useState<any>()
  const [lastSearchOptions, setLastSearchOptions] = useState<any>()
  const router = useRouter()

  const onClickWeaponType = (weaponType: string) => {}

  const loadWeapons = async (_condition?: object, _opts?: any) => {
    // const result = await fetchGetMyInventory()
    // setItems(result.items)

    const opts = { ..._opts }
    let condition = { ..._condition }
    if (!opts.page) {
      opts.page = 1
    }

    const selectedWeaponTypes = selectedWeapons
      .filter((w) => w.isSelected)
      .map((w) => w.name)

    if (selectedWeaponTypes.length > 0) {
      condition = {
        ...condition,
        'snapshot.weaponType': { $in: selectedWeaponTypes },
      }
    }
    if (searchKeyword) {
      condition = { ...condition, 'snapshot.name': { $regex: searchKeyword } }
    }
    const result = await fetchGetAuctions(condition, opts)
    setAuctions(result.auctions)
    setPagenation({
      page: result.page,
      totalPages: result.totalPages,
      total: result.total,
    })

    setLastSearchOptions({ condition, opts })
  }

  const onChangeWeaponType = (e: any, index: number) => {
    const newSelected = [...selectedWeapons]
    newSelected[index].isSelected = e.target.checked
    setSelectedWeapons(newSelected)
    loadWeapons()
  }

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
      loadWeapons()
    }
  }

  const goToAddItemPage = () => {
    router.push('/main/inn/trade/create')
  }
  useEffect(() => {
    loadWeapons()
  }, [])
  return (
    <div>
      <Card className="rounded p-[8px] ff-ba flex flex-col gap-[4px]">
        <div>거래소 아이템 리스트</div>
        <div className="flex flex-col gap-[2px]">
          <div className="flex gap-[2px]">
            <input
              className="border border-gray-600 focus-visible:outline-0 ff-wavve"
              onBlur={(e) => setSearchKeyword(e.target.value)}
            />
            <div
              className="cursor-pointer bg-ruliweb text-white px-[4px] py-[1px]"
              onClick={() => {
                loadWeapons({}, { sort: { createdAt: -1 } })
              }}
            >
              등록순
            </div>
            <div
              className="cursor-pointer bg-ruliweb text-white px-[4px] py-[1px]"
              onClick={() => {
                loadWeapons({}, { sort: { gold: 1 } })
              }}
            >
              가격순
            </div>
            <div
              className="cursor-pointer bg-ruliweb text-white px-[4px] py-[1px]"
              onClick={() => {
                loadWeapons({}, { sort: { 'snapshot.iGrade': -1 } })
              }}
            >
              희귀도순
            </div>
            <div
              className="cursor-pointer bg-ruliweb text-white px-[4px] py-[1px]"
              onClick={() => {
                loadWeapons({}, { sort: { 'snapshot.iLevel': -1 } })
              }}
            >
              아이템레벨순
            </div>
          </div>
          <div>
            <div className="flex items-center gap-[8px]">
              {selectedWeapons.map((weaponType, index) => {
                return (
                  <label
                    className="flex items-center cursor-pointer"
                    key={createKey()}
                    onClick={() => onClickWeaponType(weaponType.name)}
                  >
                    <input
                      type="checkbox"
                      checked={weaponType.isSelected}
                      onChange={(e) => onChangeWeaponType(e, index)}
                    />
                    {translate(weaponType.name)}
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          {auctions.length === 0 && <div>검색결과가 없습니다</div>}
          {pagenation && (
            <div>
              {pagenation.total}개의 검색 결과 [{pagenation.page}/
              {pagenation.totalPages} 페이지]
            </div>
          )}
          <div className="flex flex-wrap gap-[4px]">
            {auctions.map((auction) => {
              const { weapon } = auction
              if (!weapon) return
              return (
                <div
                  key={createKey()}
                  className="flex flex-col relative bg-[#555d62ed] text-[14px] border-2 border-gray-400 w-[300px] text-white rounded shadow-md group"
                  style={{ borderColor: toColorByGrade(weapon.iGrade) }}
                >
                  <div className="p-[4px]">
                    <div className="gap-[4px] flex flex-col absolute z-100 bg-gray-400 bg-opacity-55 overflow-hidden w-full h-full left-0 top-0 items-center justify-center invisible group-hover:visible">
                      <div className="flex flex-row gap-[2px] items-center w-full bg-yellow-700 justify-center py-[5px]">
                        <img
                          src="/images/icon_currency.png"
                          className="w-[24px]"
                        />
                        <div className="text-[20px] ff-wavve ">
                          {auction.gold.toLocaleString()}
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-center bg-green-400 text-white cursor-pointer text-[20px] px-[12px] py-[4px] ff-wavve rounded"
                        onClick={() => purchaseAuctionItem(auction._id!)}
                      >
                        구매하기
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-row gap-[2px] items-center">
                        <img
                          src="/images/icon_currency.png"
                          className="w-[24px]"
                        />
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
                        style={{ borderColor: toColorByGrade(weapon.iGrade) }}
                      >
                        <img
                          className="w-full h-full rounded overflow-hidden"
                          src={toAPIHostURL(weapon.thumbnail)}
                        />
                      </div>
                      <div
                        className={`w-full border-2 border-l-0 flex items-center pl-[4px] ff-wavve text-[20px] ${weapon.iGrade === 'normal' ? 'text-dark-blue' : ''}`}
                        style={{
                          borderColor: toColorByGrade(weapon.iGrade),
                          background: toColorByGrade(weapon.iGrade),
                        }}
                      >
                        {weapon.name}
                        {weapon.starForce > 0 ? ` [+${weapon.starForce}]` : ''}
                      </div>
                    </div>
                    <div className="mt-[4px]">
                      <div className="flex items-center flex-wrap gap-[1px]">
                        {new Array(weapon.maxStarForce)
                          .fill(1)
                          .map((value: any, index: number) => {
                            const isOnStarForce = weapon.starForce > index
                            return (
                              <div
                                className="w-[16px] h-[16px]"
                                key={createKey()}
                              >
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
                        {translate(weapon.weaponType) || '무기종류없음'}
                      </div>
                      <div
                        className={`flex items-center justify-center px-[4px] py-[1px] bg-white ${weapon.iGrade === 'normal' ? 'text-black' : 'text-white'} ff-ba font-bold border-dotted border`}
                        style={{
                          background: toColorByGrade(weapon.iGrade),
                        }}
                      >
                        {translate(weapon.iGrade)}
                      </div>
                      <div className="flex items-center justify-center px-[4px] py-[1px] bg-white text-gray-800 ff-ba font-bold border-dotted border">
                        iLv.{weapon.iLevel}
                      </div>
                    </div>
                    <div className="mt-[5px]">
                      <div className="border-b border-b-gray-400">
                        기본 속성
                      </div>
                      {weapon.damageOfPhysical > 0 && (
                        <div className="flex justify-between">
                          <div>물리 피해</div>
                          <div>{weapon.damageOfPhysical}</div>
                        </div>
                      )}

                      {weapon.damageOfFire > 0 && (
                        <div className="flex justify-between">
                          <div>화염 피해</div>
                          <div>{weapon.damageOfFire}</div>
                        </div>
                      )}
                      {weapon.damageOfLightning > 0 && (
                        <div className="flex justify-between">
                          <div>번개 피해</div>
                          <div>{weapon.damageOfLightning}</div>
                        </div>
                      )}
                      {weapon.damageOfCold > 0 && (
                        <div className="flex justify-between">
                          <div>냉기 피해</div>
                          <div>{weapon.damageOfCold}</div>
                        </div>
                      )}
                      {weapon.criticalRate > 0 && (
                        <div className="flex justify-between">
                          <div>치명타 확률</div>
                          <div>{weapon.criticalRate}</div>
                        </div>
                      )}
                      {weapon.criticalMultiplier > 0 && (
                        <div className="flex justify-between">
                          <div>치명타 배율</div>
                          <div>{weapon.criticalMultiplier}</div>
                        </div>
                      )}
                    </div>
                    {Object.keys(weapon.additionalAttributes || {}).length >
                      0 && (
                      <div className="mt-[5px]">
                        <div className="text-[#ffea00] border-b border-b-gray-200">
                          추가 속성
                        </div>
                        {Object.keys(weapon.additionalAttributes!).map(
                          (key: string) => {
                            if (!weapon.additionalAttributes) return
                            const value = weapon.additionalAttributes[key]
                            return (
                              <div
                                key={createKey()}
                                className="flex justify-between"
                              >
                                <div>{translate(key)}</div>
                                <div>{value}</div>
                              </div>
                            )
                          },
                        )}
                      </div>
                    )}
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
            })}
          </div>

          {/* Pagination Start */}
          {pagenation && (
            <div className="mt-3 flex justify-center">
              <div className="flex gap-[2px]">
                {new Array(pagenation.totalPages)
                  .fill(1)
                  .map((value, index) => {
                    return (
                      <div
                        onClick={() =>
                          loadWeapons(
                            { ...lastSearchOptions.condition },
                            { ...lastSearchOptions.opts, page: index + 1 },
                          )
                        }
                        className={`flex justify-center items-center w-[24px] h-[24px] text-[12px] font-bold ${index + 1 === pagenation.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                        key={createKey()}
                      >
                        {index + 1}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
          {/* Pagination End */}
        </div>
      </Card>
    </div>
  )
}
