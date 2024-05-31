'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import { fetchStatistic } from '@/services/api/api.auction'
import createKey from '@/services/key-generator'
import { ago, formatNumber } from '@/services/util'

interface StatRow {
  name: string
  count: number
  items: StatItem[]
}
interface StatItem {
  seller: string
  purchaser: string
  createdAt: Date
  price: number
}
export default function InnTradeIndexPage() {
  const [stats, setStats] = useState<Array<StatRow>>([])
  const loadStatistic = useCallback(async () => {
    const result = await fetchStatistic()
    setStats(result)
    setDetailOpts(result.map(() => ({ isHide: true })))
  }, [])

  const [detailOpts, setDetailOpts] = useState<any[]>([])

  useEffect(() => {
    loadStatistic()
  }, [loadStatistic])
  return (
    <div>
      <Card className="rounded p-[10px] ff-score-all font-bold">
        <div>
          <div className="text-[24px]">거래소 현황판</div>
          <div className="text-[16px]">
            최근 일주일간의 거래 기록 통계입니다.
          </div>
          <div className="text-red-500 text-[16px]">
            최저가와 중간 값 차이가 클 경우 주의하세요
          </div>
        </div>

        <div className="bg-gray-800/10 flex flex-col relative">
          <div className="text-[16px] flex items-center bg-gray-800 text-white sticky top-0">
            <div className="min-w-[40px]" />
            <div className="min-w-[150px]">이름</div>
            <div className="min-w-[100px]">판매량</div>
            <div className="min-w-[150px]">판매가 최소-최대</div>
            <div className="min-w-[150px]">중간값</div>
            <div className="min-w-[150px]">평균판매가</div>
          </div>
          {stats &&
            stats.map((stat, index) => {
              const orderedItem = _.orderBy(stat.items, ['price'], ['asc'])
              const [minPriceItem, ...rest] = orderedItem
              const maxPriceItem = rest[rest.length - 1]
              const totalPrice = stat.items.reduce(
                (prev, next) => prev + next.price,
                0,
              )
              return (
                <div key={createKey()} className="text-[16px]">
                  <div
                    className="flex items-center hover:bg-gray-100 border-b border-b-gray-300 py-[4px] cursor-pointer"
                    onClick={() => {
                      const changedHideValue = !detailOpts[index].isHide
                      const updatedDetailOpts = detailOpts.map(
                        (detail, dIndex) => {
                          const newDetail = { ...detail }
                          if (dIndex === index) {
                            newDetail.isHide = changedHideValue
                            return newDetail
                          }
                          newDetail.isHide = true
                          return newDetail
                        },
                      )
                      setDetailOpts(updatedDetailOpts)
                    }}
                  >
                    <div className="min-w-[40px] text-center">{index + 1}</div>
                    <div className="min-w-[150px]">{stat.name}</div>
                    <div className="min-w-[100px]">{stat.count}</div>
                    <div className="min-w-[150px]">
                      <div>{minPriceItem?.price.toLocaleString() || 0}</div>
                      <div>~ {maxPriceItem?.price.toLocaleString() || 0}</div>
                    </div>
                    <div className="min-w-[150px]">
                      {orderedItem[
                        Math.floor(orderedItem.length / 2)
                      ]?.price.toLocaleString() || 0}
                    </div>
                    <div className="min-w-[150px]">
                      {Math.floor(
                        totalPrice / stat.items.length,
                      ).toLocaleString() || 0}
                    </div>
                  </div>
                  <div
                    className={`p-[10px] bg-white max-h-[300px] overflow-y-scroll ${detailOpts[index].isHide ? 'hidden' : ''}`}
                  >
                    <div className="flex items-center gap-[4px]">
                      <div>판매자</div>
                      <i className="fa-solid fa-arrow-right" />
                      <div>구매자</div>
                      <div>/</div>
                      <div>거래가</div>
                      <div>/</div>
                      <div>거래일시</div>
                    </div>
                    {stat.items.map((item, itemIndex) => {
                      return (
                        <div key={createKey()} className="flex items-center">
                          <div className="min-w-[50px] text-center">
                            {itemIndex + 1}
                          </div>
                          <div className="flex items-center min-w-[250px] gap-[4px]">
                            <div>{item.seller}</div>
                            <i className="fa-solid fa-arrow-right" />
                            <div>{item.purchaser}</div>
                          </div>
                          <div className="min-w-[150px]">
                            {Math.floor(item.price).toLocaleString()}
                          </div>
                          <div>{ago(item.createdAt)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>
      </Card>
    </div>
  )
}
