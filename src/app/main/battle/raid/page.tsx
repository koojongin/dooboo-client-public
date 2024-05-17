'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'
import { fetchRaidList } from '@/services/api/api.raid'
import { Raid } from '@/interfaces/raid.interface'
import { formatNumber } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import { getLeftTime } from '@/services/yg-util'

export default function BattleRaidPage() {
  const router = useRouter()
  const [raids, setRaids] = useState<Raid[]>([])
  const loadRaids = useCallback(async () => {
    const result = await fetchRaidList()
    setRaids(result.raids)
  }, [])

  const goToRaidDetail = (raid: Raid) => {
    router.push(`./raid/${raid._id}`)
  }

  useEffect(() => {
    loadRaids()
  }, [loadRaids])
  return (
    <div className="flex flex-col gap-[10px]">
      <Card className="p-[10px] rounded">
        <div className="flex justify-start items-center gap-[10px]">
          <Tooltip content="새로고침 하여 레이드 리스트 갱신">
            <div
              className="text-[40px] bg-sky-700 text-white p-[10px] rounded flex items-center justify-center cursor-pointer"
              onClick={() => loadRaids()}
            >
              <i className="fa-solid fa-arrows-rotate" />
            </div>
          </Tooltip>
          <div className="text-[16px] ff-score-all font-bold">
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>협동 전투(레이드)는 5분에 한번 참여 할 수 있습니다.</div>
            </div>
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>
                전투에 참여하면 모든 레이드에 5분간 참여가 불가능합니다.
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>레이드 보스는 마지막 등장후 1시간 마다 초기화됩니다.</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-[10px]">
        {raids.map((raid) => {
          const raidMonster = raid.monsters[0]
          const { monster } = raidMonster!
          return (
            <Card key={createKey()} className="rounded p-[10px]">
              <div className="flex items-center gap-[10px]">
                <div className="p-[1px] border border-gray-600 rounded">
                  <img
                    className="border border-gray-600 rounded min-w-[80px] w-[80px] h-[80px]"
                    src={toAPIHostURL(monster?.thumbnail)}
                  />
                </div>
                <div className="w-[300px]">
                  <div className="flex items-center justify-between">
                    <div className="min-w-[100px] text-[24px]">{raid.name}</div>
                    <div>도주까지 {getLeftTime(raid.expiredAt)}</div>
                  </div>
                  <div>
                    {formatNumber(raidMonster.currentHp)} /{' '}
                    {formatNumber(monster?.hp || 0)}
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className="bg-green-500 text-white w-[80px] h-[30px] flex items-center justify-center cursor-pointer"
                    onClick={() => goToRaidDetail(raid)}
                  >
                    입장
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
