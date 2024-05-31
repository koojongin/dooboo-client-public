'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import _ from 'lodash'
import createKey from '@/services/key-generator'
import {
  fetchGetRaidRewardAll,
  fetchRequestRaidRewardAll,
} from '@/services/api/api.raid'
import { RaidReward } from '@/interfaces/raid.interface'
import { Pagination } from '@/interfaces/common.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { formatNumber, toHHMMSS, toYYYYMMDDHHMMSS } from '@/services/util'
import { DropItemBox } from '@/app/main/battle/raid/[raidId]/page'

export default function BattleRaidRewardsPage() {
  const [raidRewards, setRaidRewards] = useState<RaidReward[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const loadRaidRewards = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetRaidRewardAll({}, { page: selectedPage })
    setRaidRewards(result.raidRewards)
    setPagination({ ...result })
  }, [])

  const getAllRewards = useCallback(async () => {
    await fetchRequestRaidRewardAll()
    await Swal.fire({
      title: '보상이 지급되었습니다.',
      confirmButtonText: '확인',
    })
    loadRaidRewards()
  }, [loadRaidRewards])

  useEffect(() => {
    loadRaidRewards()
  }, [loadRaidRewards])

  return (
    <div>
      <Card className="p-[10px] rounded w-full">
        <div>종료된 레이드만 보상을 수령할 수 있습니다.</div>
        <div>
          <div
            className="bg-green-500 flex items-center justify-center w-[100px] h-[30px] text-white cursor-pointer rounded"
            onClick={() => getAllRewards()}
          >
            일괄 수령
          </div>
        </div>
        <div className="mt-[10px]">
          <div className="flex flex-col gap-[4px]">
            {raidRewards.map((raidReward, v) => {
              if (!raidReward.raid) {
                return (
                  <div className="w-full border border-gray-600 p-[30px] flex items-center justify-center text-[30px] text-gray-500 bg-gray-800/20">
                    제거된 레이드
                  </div>
                )
              }
              const [firstMonster] = raidReward.raid.monsters
              const { monster } = firstMonster
              const dropItems = monster?.drop?.items || []
              const isEnded =
                new Date().getTime() -
                  new Date(raidReward.expiredAt).getTime() >
                0
              const isDeprecated =
                new Date(raidReward.createdAt!) < new Date('2024-05-19 10:00')
              return (
                <div
                  key={createKey()}
                  className={`flex flex-col justify-center gap-[4px] border border-gray-700 p-[4px] ${isEnded ? 'bg-gray-400 text-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-[4px]">
                    <div className="w-[50px] h-[50px] border border-gray-600 rounded">
                      <img
                        className="w-full h-full"
                        src={toAPIHostURL(monster?.thumbnail)}
                      />
                    </div>
                    <div className="min-w-[100px]">{monster?.name}</div>
                    <div className="min-w-[100px]">
                      hp:{formatNumber(firstMonster.currentHp)}
                    </div>
                    <div className="min-w-[120px]">
                      {isEnded ? '종료된 레이드' : '진행중'}
                    </div>
                    {!isEnded && (
                      <div className="ml-auto min-w-[120px] text-right " />
                    )}
                    {isEnded && (
                      <div className="ml-auto min-w-[120px] text-right">
                        {firstMonster.currentHp > 0 && (
                          <div className="text-red-500">토벌 실패</div>
                        )}
                        {firstMonster.currentHp <= 0 && (
                          <div
                            className={`${raidReward.isRewarded ? '' : 'text-green-400'}`}
                          >
                            {raidReward.isRewarded ? '보상완료' : '보상 미수령'}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col items-center min-w-[200px] text-[14px]">
                      <div>{toYYYYMMDDHHMMSS(raidReward.raid.createdAt!)}</div>
                      <div className="flex items-center gap-[4px]">
                        <div>~</div>
                        <div>{toYYYYMMDDHHMMSS(raidReward.expiredAt)}</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border-b border-dashed ${isEnded ? 'border-b-gray-100' : 'border-b-gray-500'}`}
                  />
                  <div className="relative">
                    {!isEnded && (
                      <div className="absolute z-[5] w-full h-full bg-gray-800/10 flex items-center justify-center text-[30px]">
                        집계중
                      </div>
                    )}
                    {isDeprecated && isEnded && (
                      <div className="absolute z-[5] w-full h-full bg-gray-800/40 flex items-center justify-center text-[18px] flex-col">
                        <div>수정 전 과거 데이터 집계</div>
                        <div>랭커 데이터 집계없음</div>
                      </div>
                    )}
                    <div className="p-[5px] border-dotted min-w-[300px] flex gap-[4px]">
                      {_.sortBy(dropItems, 'item.name').map((dropItem) => {
                        return (
                          <DropItemBox
                            key={createKey()}
                            dropItem={dropItem}
                            isTopRank={raidReward.isTopRanked}
                            isDarkMode={isEnded}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          {pagination && (
            <div className="w-full flex justify-center mt-[15px]">
              <div className="flex gap-[4px]">
                {new Array(pagination.totalPages)
                  .fill(1)
                  .map((value, index) => {
                    return (
                      <div
                        onClick={() => loadRaidRewards(index + 1)}
                        className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                        key={createKey()}
                      >
                        {index + 1}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
