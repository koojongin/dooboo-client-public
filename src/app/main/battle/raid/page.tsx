'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import createKey from '@/services/key-generator'
import { fetchRaidAttack, fetchRaidList } from '@/services/api/api.raid'
import { Raid } from '@/interfaces/raid.interface'
import { formatNumber } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import { getLeftTime } from '@/services/yg-util'

export default function BattleRaidPage() {
  const router = useRouter()
  const [raids, setRaids] = useState<Raid[]>([])
  const [myCharacterId, setMyCharacterId] = useState<string>()
  const loadRaids = useCallback(async () => {
    const result = await fetchRaidList()
    setRaids(result.raids)
  }, [])

  const goToRaidDetail = (raid: Raid) => {
    router.push(`./raid/${raid._id}`)
  }

  const attackRaid = useCallback(
    async (raidId: string) => {
      await fetchRaidAttack(raidId)
      await loadRaids()
      await Swal.fire({
        text: `공격되었습니다.`,
        icon: 'success',
        confirmButtonText: '확인',
      })
    },
    [loadRaids],
  )

  useEffect(() => {
    loadRaids()
    setMyCharacterId(window?.localStorage?.getItem('characterId') || '')
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
          <div
            className="w-[60px] h-[60px] flex items-center justify-center flex-col bg-sky-700/80 text-white rounded gap-[2px] text-[20px] cursor-pointer"
            onClick={() => router.push('/main/battle/raid/rewards')}
          >
            <div className="ff-ba ff-skew">보상</div>
            <div className="ff-ba ff-skew">수령</div>
          </div>
          <div className="text-[16px] ff-score-all font-bold">
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>협동 전투(레이드)는 5분에 한번 참여 할 수 있습니다.</div>
            </div>
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>
                전투에 참여하면 해당 레이드에 5분간 재참여가 불가능합니다.
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>레이드 보스는 마지막 등장후 1시간 마다 초기화됩니다.</div>
            </div>
            <div className="flex items-center gap-[10px]">
              <i className="text-[4px] fa-solid fa-circle" />
              <div>토벌된 레이드이더라도 전투에 참여할 수 있습니다.</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-[10px]">
        {raids.map((raid) => {
          const raidMonster = raid.monsters[0]
          const { monster } = raidMonster!
          const raidDamage = raid?.damage || {}
          return (
            <Card
              key={createKey()}
              className={`rounded p-[10px] border-2 ${Object.keys(raidDamage).includes(myCharacterId as any) ? 'border-green-600' : 'border-gray-300'}`}
            >
              <div className="ff-score font-bold text-[16px] flex justify-between">
                <div>
                  {Object.keys(raidDamage).length.toLocaleString()}명 전투
                  참여중
                </div>
                {Object.keys(raidDamage).includes(myCharacterId as any) && (
                  <div className="text-green-600">전투 참여됨</div>
                )}
                {!Object.keys(raidDamage).includes(myCharacterId as any) && (
                  <div className="text-gray-500">참여 대기중</div>
                )}
              </div>
              <div className="border-b border-b-gray-500 mb-[4px]" />
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
                  </div>
                  <div>
                    {formatNumber(raidMonster.currentHp)} /{' '}
                    {formatNumber(monster?.hp || 0)} (
                    {(
                      (raidMonster.currentHp * 100) /
                      (monster?.hp || 0)
                    ).toFixed(1)}
                    %)
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <div className="text-red-600">전투 요구 레벨</div>
                    <div>{raid.requiredLevel}</div>
                  </div>
                  <div>도주까지 {getLeftTime(raid.expiredAt)}</div>
                </div>
                <div className="flex items-center">
                  <div
                    className="bg-blue-gray-800 text-white w-[80px] h-[80px] flex flex-col items-center justify-center cursor-pointer text-[24px] ff-score-all font-bold ff-skew"
                    onClick={() => attackRaid(raid._id!)}
                  >
                    <div>기록</div>
                    <div>공격</div>
                  </div>
                  <div
                    className="bg-green-500 text-white w-[80px] h-[80px] flex items-center justify-center cursor-pointer text-[34px] ff-ba ff-skew"
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
