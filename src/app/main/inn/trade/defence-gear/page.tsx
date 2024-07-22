'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { fetchGetMyCurrency } from '@/services/api-fetch'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { ago, toColorByGrade, toMMDDHHMMSS, translate } from '@/services/util'
import { Auction } from '@/interfaces/auction.interface'
import {
  DefenceGearType,
  ItemGradeKind,
  SimulateBattleDialogRef,
  WeaponType,
} from '@/interfaces/item.interface'
import useDebounce from '@/components/hooks/debounce'
import { SortingType } from '@/interfaces/common.interface'
import { getTotalFlatDamage } from '@/services/yg-util'
import SimulateBattleDialog from '../simulate-battle-dialog'
import {
  fetchGetAuctionDefenceGears,
  fetchGetAuctionWeapons,
  fetchPurchaseAuctionItem,
  fetchRetrieveAuctionItem,
} from '@/services/api/api.auction'
import { BA_COLOR } from '@/constants/constant'
import DefenceGearBoxDetailComponent from '@/components/item/item-box/defence-gear-box-detail.component'
import { DefenceGearBoxStaticComponent } from '@/components/item/item-box/defence-gear-box-static.component'

const TradeSortType = {
  CREATED: 'trade-sort:created',
  PRICE: 'trade-sort:price',
  // GRADE: 'trade-sort:grade',
  ITEM_LEVEL: 'trade-sort:item-level',
} as const

enum ListingType {
  Normal = 'Normal',
  Simplify = 'Simplify',
}

enum EtcType {
  All = 'All',
  Exist = 'Exist',
  NotExist = 'NotExist',
}

export default function TradeDefenceGearPage() {
  const [characterId, setCharacterId] = useState<string>()
  const [currency, setCurrency] = useState<{ gold: number }>()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const debouncedKeyword = useDebounce<string>(searchKeyword, 500)
  const [showOnlyMyItem, setShowOnlyMyItem] = useState<boolean>(false)
  const simulateBattleRef = useRef<SimulateBattleDialogRef>()
  const [isAllGearTypeChecked, setIsAllGearTypeChecked] =
    useState<boolean>(true)
  const [isAllGradeChecked, setIsAllGradeChecked] = useState<boolean>(true)
  const [sortingType, setSortingType] = useState<
    (typeof SortingType)[keyof typeof SortingType]
  >(SortingType.Desc)
  const [selectedGearTypes, setSelectedGearTypes] = useState<
    { name: string; isSelected: boolean }[]
  >(
    Object.values(DefenceGearType).map((w) => ({
      name: w,
      isSelected: true,
    })),
  )

  const [detailCondition, setDetailCondition] = useState<{
    iLevelMin: number
    iLevelMax: number
    enchant: EtcType
    injectedCard: EtcType
  }>({
    iLevelMin: 0,
    iLevelMax: 0,
    enchant: EtcType.All,
    injectedCard: EtcType.All,
  })

  const [selectedGrades, setSelectedGrades] = useState<
    { name: string; isSelected: boolean }[]
  >(
    Object.values(ItemGradeKind)
      .filter(
        (v) => ![ItemGradeKind.Legendary, ItemGradeKind.Unique].includes(v),
      )
      .map((w) => ({ name: w, isSelected: true })),
  )

  const [listingType, setListingType] = useState<ListingType>(
    ListingType.Normal,
  )

  const [selectedSortType, setSelectedSortType] = useState<string>(
    TradeSortType.CREATED,
  )

  const [pagenation, setPagenation] = useState<any>()
  const [lastSearchOptions, setLastSearchOptions] = useState<{
    condition: object
    opts: any
  }>()
  const router = useRouter()

  const loadDefenceGears = useCallback(
    async (_condition?: object, _opts?: any) => {
      const opts = { ..._opts }
      let condition: any = { ..._condition }

      if (showOnlyMyItem) {
        condition.owner = { $in: [characterId] }
      }
      if (!opts.page) {
        opts.page = 1
      }

      if (selectedGearTypes.length > 0) {
        condition = {
          ...condition,
          'snapshot.gearType': {
            $in: selectedGearTypes
              .filter((i) => i.isSelected)
              .map((i) => i.name),
          },
        }
      }

      if (selectedGrades.length > 0) {
        condition = {
          ...condition,
          'snapshot.iGrade': {
            $in: selectedGrades.filter((i) => i.isSelected).map((i) => i.name),
          },
        }
      }
      if (debouncedKeyword) {
        condition = {
          ...condition,
          'snapshot.name': { $regex: debouncedKeyword },
        }
      }

      if (detailCondition.iLevelMax || detailCondition.iLevelMin) {
        const andCondition = []
        if (detailCondition.iLevelMin)
          andCondition.push({
            'snapshot.iLevel': { $gte: detailCondition.iLevelMin },
          })
        if (detailCondition.iLevelMax)
          andCondition.push({
            'snapshot.iLevel': { $lte: detailCondition.iLevelMax },
          })

        condition = {
          ...condition,
          $and: andCondition,
        }
      }

      if (detailCondition.enchant) {
        if (detailCondition.enchant === EtcType.Exist) {
          condition = {
            ...condition,
            'snapshot.enchants.fixedAttributeName': { $exists: true },
          }
        }
        if (detailCondition.enchant === EtcType.NotExist) {
          condition = {
            ...condition,
            'snapshot.enchants.count': { $in: [0, null] },
          }
        }
      }

      if (detailCondition.injectedCard) {
        if (detailCondition.injectedCard === EtcType.Exist) {
          condition = {
            ...condition,
            'snapshot.injectedCard': { $exists: true },
          }
        }
        if (detailCondition.injectedCard === EtcType.NotExist) {
          condition = {
            ...condition,
            'snapshot.injectedCard': { $in: [null] },
          }
        }
      }

      switch (selectedSortType) {
        case TradeSortType.CREATED:
          opts.sort = { createdAt: SortingType.Desc === sortingType ? -1 : 1 }
          break
        case TradeSortType.PRICE:
          opts.sort = { gold: SortingType.Desc === sortingType ? 1 : -1 }
          break
        // case TradeSortType.GRADE:
        //   opts.sort = {
        //     'snapshot.iGrade': SortingType.Desc === sortingType ? -1 : 1,
        //   }
        //   break
        case TradeSortType.ITEM_LEVEL:
          opts.sort = {
            'snapshot.iLevel': SortingType.Desc === sortingType ? 1 : -1,
          }
          break

        default:
          break
      }

      const result = await fetchGetAuctionDefenceGears(condition, opts)
      setAuctions(result.auctions)
      setPagenation({
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      })

      setLastSearchOptions({ condition, opts })
    },
    [
      showOnlyMyItem,
      selectedGearTypes,
      selectedGrades,
      debouncedKeyword,
      detailCondition.iLevelMax,
      detailCondition.iLevelMin,
      detailCondition.enchant,
      detailCondition.injectedCard,
      selectedSortType,
      characterId,
      sortingType,
    ],
  )

  const simulateBattle = useCallback(async (auctionId: string) => {
    simulateBattleRef.current?.openDialog(auctionId)
  }, [])

  const onChangeAllGearTypeCheck = () => {
    setSelectedGearTypes([
      ...selectedGearTypes.map((w) => {
        const nW = { ...w }
        nW.isSelected = !isAllGearTypeChecked
        return nW
      }),
    ])
    setIsAllGearTypeChecked(!isAllGearTypeChecked)
  }

  const onChangeAllGradeCheck = () => {
    setSelectedGrades([
      ...selectedGrades.map((w) => {
        const nW = { ...w }
        nW.isSelected = !isAllGradeChecked
        return nW
      }),
    ])
    setIsAllGradeChecked(!isAllGradeChecked)
  }

  const onChangeWeaponType = (e: any, index: number) => {
    const newSelected = [...selectedGearTypes]
    newSelected[index].isSelected = e.target.checked
    setSelectedGearTypes(newSelected)
  }

  const onChangeGrade = (e: any, index: number) => {
    const newSelected = [...selectedGrades]
    newSelected[index].isSelected = e.target.checked
    setSelectedGrades(newSelected)
  }

  const onChangeKeyword = (value: string) => {
    setSearchKeyword(value)
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
      loadDefenceGears(lastSearchOptions?.condition, lastSearchOptions?.opts)
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
      loadDefenceGears(lastSearchOptions?.condition, lastSearchOptions?.opts)
    }
  }

  const loadCurrency = useCallback(async () => {
    const result = await fetchGetMyCurrency()
    setCurrency(result)
  }, [])

  const goToAddItemPage = () => {
    router.push('/main/inn/trade/create')
  }

  useEffect(() => {
    setCharacterId(localStorage.getItem('characterId') || '')
    loadDefenceGears()
    loadCurrency()
  }, [loadDefenceGears])

  return (
    <div>
      <SimulateBattleDialog ref={simulateBattleRef} />
      <Card className="rounded p-[8px] ff-ba flex flex-col gap-[4px]">
        <div className="flex flex-col gap-[4px] mb-[10px] ff-ba-all border-dashed border-b border-b-gray-600 pb-[10px]">
          <div>
            {currency && (
              <div className="flex items-center gap-[4px]">
                <img src="/images/icon_currency.png" className="w-[30px]" />
                <div className="ff-score text-[24px]">
                  {currency.gold.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* SearchInputLine-----------------------------*/}
          <div className="flex items-center">
            <div className="w-[200px] flex items-stretch justify-center">
              <div className="flex items-stretch">
                <div
                  className="min-w-[50px] flex items-center justify-center bg-blue-gray-500 text-white cursor-pointer"
                  onClick={() => setListingType(ListingType.Normal)}
                >
                  크게
                </div>
                <div
                  className="min-w-[50px] flex items-center justify-center bg-blue-gray-500 text-white cursor-pointer"
                  onClick={() => setListingType(ListingType.Simplify)}
                >
                  작게
                </div>
              </div>
              <select
                className="w-full border border-blue-gray-500 text-blue-gray-500 text-[16px] h-[26px]"
                value={selectedSortType}
                onChange={(e: any) => {
                  setSelectedSortType(e.target.value)
                }}
              >
                {Object.values(TradeSortType).map((name) => {
                  return (
                    <option
                      key={createKey()}
                      value={name}
                      className="rounded-none"
                    >
                      {translate(name)}
                    </option>
                  )
                })}
              </select>
            </div>
            <div
              className="flex items-center bg-blue-gray-500"
              onClick={() => {
                if (sortingType === SortingType.Asc)
                  setSortingType(SortingType.Desc)
                else setSortingType(SortingType.Asc)
              }}
            >
              <div className="flex justify-center items-center rounded bg-blue-gray-500 h-[26px] w-[26px] text-white text-[16px] cursor-pointer rounded-r-none rounded-l-none">
                {sortingType === SortingType.Asc && (
                  <i className="fa-solid fa-arrow-up" />
                )}
                {sortingType === SortingType.Desc && (
                  <i className="fa-solid fa-arrow-down" />
                )}
              </div>
            </div>
            <input
              className="border border-blue-gray-500 focus-visible:outline-0 ff-gs h-[26px] rounded-l-none rounded-[2px] text-[16px] pl-[4px]"
              onChange={(e) => onChangeKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-stretch gap-[4px]">
            <div className="px-[8px] min-w-[50px] flex items-center justify-center bg-blue-gray-500 text-white cursor-pointer">
              아이템 레벨
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-[2px]">
                <div>최소</div>
                <input
                  onChange={(e) => {
                    setDetailCondition({
                      ...detailCondition,
                      iLevelMin: Math.floor(Number(e.target.value)),
                    })
                  }}
                  className="w-[50px] border border-blue-gray-500 focus-visible:outline-0 ff-gs h-[26px] rounded-l-none rounded-[2px] text-[16px] pl-[4px]"
                  type="number"
                />
              </div>
              <div>~</div>
              <div className="flex items-center gap-[2px]">
                <div>최대</div>
                <input
                  onChange={(e) => {
                    setDetailCondition({
                      ...detailCondition,
                      iLevelMax: Math.floor(Number(e.target.value)),
                    })
                  }}
                  className="w-[50px] border border-blue-gray-500 focus-visible:outline-0 ff-gs h-[26px] rounded-l-none rounded-[2px] text-[16px] pl-[4px]"
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* WeaponType Group-----------------------------*/}
          <div className="flex items-stretch gap-[4px] h-[24px]">
            <div className="px-[8px] min-w-[50px] flex items-center justify-center bg-blue-gray-500 text-white cursor-pointer">
              방어구 유형
            </div>
            {/* Item Type CheckBox Start */}
            <div className="flex items-center gap-[8px]">
              <label
                className="flex items-center cursor-pointer"
                key={createKey()}
              >
                <input
                  type="checkbox"
                  defaultChecked={isAllGearTypeChecked}
                  onChange={() => onChangeAllGearTypeCheck()}
                />
                전체
              </label>
              {selectedGearTypes.map((weaponType, index) => {
                return (
                  <label
                    className="flex items-center cursor-pointer"
                    key={createKey()}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={weaponType.isSelected}
                      onChange={(e) => onChangeWeaponType(e, index)}
                    />
                    {translate(weaponType.name)}
                  </label>
                )
              })}
            </div>
            {/* Item Type CheckBox End */}
          </div>

          {/* ItemGradeKind Group-----------------------------*/}
          <div className="flex items-stretch gap-[4px] h-[24px]">
            <div className="px-[8px] min-w-[50px] flex items-center justify-center bg-blue-gray-500 text-white cursor-pointer">
              등급
            </div>
            {/* Item Type CheckBox Start */}
            <div className="flex items-center gap-[8px]">
              <label
                className="flex items-center cursor-pointer"
                key={createKey()}
              >
                <input
                  type="checkbox"
                  defaultChecked={isAllGradeChecked}
                  onChange={() => onChangeAllGradeCheck()}
                />
                전체
              </label>
              {selectedGrades.map((gradeType, index) => {
                return (
                  <label
                    className="flex items-center cursor-pointer"
                    key={createKey()}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={gradeType.isSelected}
                      onChange={(e) => onChangeGrade(e, index)}
                    />
                    {translate(gradeType.name)}
                  </label>
                )
              })}
            </div>
            {/* Item Type CheckBox End */}
          </div>

          {/* <div className="flex items-stretch gap-[4px]">
            <div className="px-[8px] min-w-[50px] flex items-center justify-center bg-blue-gray-500 text-white cursor-pointer">
              기타
            </div>
            <div className="flex items-center">
              <div className="flex items-stretch">
                <div className="ff-wavve px-[10px] border border-blue-gray-500 flex items-center bg-blue-gray-500 text-white justify-center border-r-0">
                  마법 부여
                </div>
                <select
                  className="w-[60px] border border-blue-gray-500 text-blue-gray-500 text-[16px] h-[26px] border-l-0"
                  value={detailCondition.enchant}
                  onChange={(e) => {
                    setDetailCondition({
                      ...detailCondition,
                      enchant: e.target.value as EtcType,
                    })
                  }}
                >
                  {Object.keys(EtcType).map((key) => {
                    return (
                      <option key={createKey()} value={key}>
                        {translate(`select:${key}`)}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-stretch">
                <div className="ff-wavve px-[10px] border border-blue-gray-500 flex items-center bg-blue-gray-500 text-white justify-center border-r-0">
                  카드 주입
                </div>
                <select
                  className="w-[60px] border border-blue-gray-500 text-blue-gray-500 text-[16px] h-[26px] border-l-0"
                  value={detailCondition.injectedCard}
                  onChange={(e) => {
                    setDetailCondition({
                      ...detailCondition,
                      injectedCard: e.target.value as EtcType,
                    })
                  }}
                >
                  {Object.keys(EtcType).map((key) => {
                    return (
                      <option key={createKey()} value={key}>
                        {translate(`select:${key}`)}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div> */}
          <div>
            <label
              className="flex items-center cursor-pointer"
              key={createKey()}
            >
              <input
                type="checkbox"
                defaultChecked={showOnlyMyItem}
                onChange={(e) => {
                  setShowOnlyMyItem(e.target.checked)
                }}
              />
              <>내 아이템만 보기</>
            </label>
          </div>
        </div>

        {/* Dashed Border Line---------------------------------*/}
        <div>
          {auctions.length === 0 && <div>검색결과가 없습니다</div>}
          {pagenation && (
            <div>
              [{debouncedKeyword || '검색어 없음'}] {pagenation.total}개의 검색
              결과 [{pagenation.page}/{pagenation.totalPages} 페이지]
            </div>
          )}

          <div className="flex flex-wrap gap-[4px]">
            {auctions.map((auction) => {
              const { defenceGear } = auction
              if (!defenceGear) return
              return (
                <DefenceGearBoxStaticComponent
                  key={createKey()}
                  auction={auction}
                  defenceGear={defenceGear}
                  isOwn={characterId === auction.owner._id}
                  refresh={() => {
                    loadDefenceGears(
                      lastSearchOptions?.condition,
                      lastSearchOptions?.opts,
                    )
                  }}
                />
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
                          loadDefenceGears(
                            { ...lastSearchOptions?.condition },
                            { ...lastSearchOptions?.opts, page: index + 1 },
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
