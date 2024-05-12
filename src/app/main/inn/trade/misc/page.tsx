'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { fetchGetMyCurrency } from '@/services/api-fetch'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { toColorByGrade, translate } from '@/services/util'
import { Auction } from '@/interfaces/auction.interface'
import { SimulateBattleDialogRef } from '@/interfaces/item.interface'
import useDebounce from '@/components/hooks/debounce'
import { SortingType } from '@/interfaces/common.interface'
import SimulateBattleDialog from '../simulate-battle-dialog'
import {
  fetchGetAuctionMiscs,
  fetchPurchaseAuctionItem,
  fetchRetrieveAuctionItem,
} from '@/services/api/api.auction'

const TradeSortType = {
  CREATED: 'trade-sort:created',
  PRICE: 'trade-sort:price',
  GRADE: 'trade-sort:grade',
  ITEM_LEVEL: 'trade-sort:item-level',
} as const

export default function InnTradeMiscPage() {
  const [characterId, setCharacterId] = useState<string>()
  const [currency, setCurrency] = useState<{ gold: number }>()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const debouncedKeyword = useDebounce<string>(searchKeyword, 500)
  const [showOnlyMyItem, setShowOnlyMyItem] = useState<boolean>(false)
  const simulateBattleRef = useRef<SimulateBattleDialogRef>()
  const [sortingType, setSortingType] = useState<
    (typeof SortingType)[keyof typeof SortingType]
  >(SortingType.Desc)

  const [selectedSortType, setSelectedSortType] = useState<string>(
    TradeSortType.CREATED,
  )

  const [pagenation, setPagenation] = useState<any>()
  const [lastSearchOptions, setLastSearchOptions] = useState<{
    condition: object
    opts: any
  }>()
  const router = useRouter()

  const loadWeapons = useCallback(
    async (_condition?: object, _opts?: any) => {
      const opts = { ..._opts }
      let condition: any = { ..._condition }

      if (showOnlyMyItem) {
        condition.owner = { $in: [characterId] }
      }
      if (!opts.page) {
        opts.page = 1
      }

      if (debouncedKeyword) {
        condition = {
          ...condition,
          'snapshot.name': { $regex: debouncedKeyword },
        }
      }

      switch (selectedSortType) {
        case TradeSortType.CREATED:
          opts.sort = { createdAt: SortingType.Desc === sortingType ? -1 : 1 }
          break
        case TradeSortType.PRICE:
          opts.sort = { gold: SortingType.Desc === sortingType ? 1 : -1 }
          break
        case TradeSortType.GRADE:
          opts.sort = {
            'snapshot.iGrade': SortingType.Desc === sortingType ? -1 : 1,
          }
          break
        case TradeSortType.ITEM_LEVEL:
          opts.sort = {
            'snapshot.iLevel': SortingType.Desc === sortingType ? 1 : -1,
          }
          break

        default:
          break
      }

      const result = await fetchGetAuctionMiscs(condition, opts)
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
      debouncedKeyword,
      selectedSortType,
      characterId,
      sortingType,
    ],
  )

  const simulateBattle = useCallback(async (auctionId: string) => {
    simulateBattleRef.current?.openDialog(auctionId)
  }, [])

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
      loadWeapons(lastSearchOptions?.condition, lastSearchOptions?.opts)
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
      loadWeapons(lastSearchOptions?.condition, lastSearchOptions?.opts)
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
    loadWeapons()
    loadCurrency()
  }, [loadWeapons])

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
              <select
                className="w-full border border-blue-gray-500 text-blue-gray-500 text-[16px] h-[26px]"
                // label="정렬타입"
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

          {/* Group-----------------------------*/}
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

          <div className="flex flex-col gap-[1px]">
            {auctions.map((auction) => {
              const { misc } = auction
              const { baseMisc } = misc!
              if (!misc) return
              return (
                <div
                  key={createKey()}
                  className="flex flex-col relative bg-[#555d62ed] text-[14px] border-2 border-gray-400 text-white shadow-md items-center"
                >
                  <div className="p-[4px] flex w-full gap-[0px]">
                    <div className="text-[16px] flex bg-[#ece0e0] w-full">
                      <div
                        className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] border-2 p-[2px] flex items-center justify-center border-r-0 bg-blue-gray-500"
                        style={{
                          borderColor: toColorByGrade(baseMisc.iGrade),
                        }}
                      >
                        <img
                          className="w-full h-full rounded overflow-hidden"
                          src={toAPIHostURL(baseMisc.thumbnail)}
                        />
                      </div>
                      <div className="w-full flex items-center pl-[4px] min-w-[100px] ff-wavve text-[20px] text-blueGray-800 overflow-ellipsis truncate">
                        {baseMisc.name} x{misc.stack.toLocaleString()}
                      </div>
                    </div>
                    {/* <div className="flex items-center justify-center min-w-[80px] bg-white">
                      <div className="text-gray-800">
                        {misc.stack.toLocaleString()}/
                        {baseMisc.maxStack.toLocaleString()}
                      </div>
                    </div> */}
                    <div
                      className="flex justify-between items-center min-w-[200px] bg-white px-[10px] text-blue-gray-800"
                      style={{
                        borderColor: toColorByGrade(baseMisc.iGrade),
                      }}
                    >
                      <div>
                        <div className="flex flex-row gap-[2px] items-center">
                          <img
                            src="/images/icon_currency.png"
                            className="w-[24px]"
                          />
                          <div>{auction.gold.toLocaleString()}</div>
                        </div>
                        <div className="text-[10px]">
                          개당 약
                          {` ${
                            (auction.gold / misc.stack)
                              .toLocaleString()
                              .split('.')[0]
                          }`}
                        </div>
                      </div>
                      <div>
                        <div>{auction.owner.nickname}</div>
                      </div>
                    </div>
                    <div className="min-w-[200px] bg-white flex justify-center items-center gap-[4px]">
                      {characterId !== auction.owner._id && (
                        <div
                          className="flex items-center justify-center bg-green-400 text-white cursor-pointer text-[20px] px-[12px] py-[4px] ff-wavve rounded"
                          onClick={() => purchaseAuctionItem(auction._id!)}
                        >
                          구매
                        </div>
                      )}
                      {characterId === auction.owner._id && (
                        <div
                          className="flex items-center justify-center bg-red-500 text-white cursor-pointer text-[20px] px-[12px] py-[4px] ff-wavve rounded"
                          onClick={() => retrieveAuctionItem(auction._id!)}
                        >
                          회수
                        </div>
                      )}
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
