'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@material-tailwind/react'
import _ from 'lodash'
import { fetchRaidAttack, fetchRaidDetail } from '@/services/api/api.raid'
import { MergedRaidLog, Raid, RaidLog } from '@/interfaces/raid.interface'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import {
  ago,
  formatNumber,
  toHHMM,
  toHHMMSS,
  toMMDDHHMMSSvDot,
} from '@/services/util'
import { getLeftTime } from '@/services/yg-util'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'

export default function RaidDetailPage({
  params,
}: {
  params: { raidId: string }
}) {
  const [raid, setRaid] = useState<Raid>()

  const loadRaid = useCallback(async (raidId: string) => {
    const result = await fetchRaidDetail(raidId)
    setRaid(result.raid)
  }, [])

  const getHp = () => {
    return {}
  }

  const attackRaid = useCallback(
    async (raidId: string) => {
      await fetchRaidAttack(raidId)
      await loadRaid(raidId)
    },
    [loadRaid],
  )

  useEffect(() => {
    loadRaid(params.raidId)
  }, [loadRaid, params.raidId])

  return (
    <div className="w-full">
      <Card className="p-[10px] rounded w-full">
        {!raid && <div>Loading...</div>}
        {raid && (
          <div className="ff-score-all font-bold">
            <div className="">
              <div key={createKey()} className="flex items-center gap-[10px]">
                <img
                  className="w-[80px]"
                  src={toAPIHostURL(raid.monsters[0]?.monster?.thumbnail)}
                />
                <div className="flex flex-col">
                  <div className="text-[24px]">{raid.name}</div>
                  <div className="p-[2px] bg-red-200">
                    <div className="w-[300px] bg-red-300 p-[5px] text-white ff-score font-bold flex items-center justify-center">
                      {formatNumber(raid.monsters[0].currentHp)} /{' '}
                      {formatNumber(raid.monsters[0].monster?.hp || 0)}
                    </div>
                  </div>
                  <div>도주까지 {getLeftTime(raid.expiredAt)}</div>
                </div>
              </div>
            </div>

            <div className="mt-[10px]">
              <div
                className="w-full flex items-center justify-center bg-green-800 text-white h-[30px] cursor-pointer"
                onClick={() => attackRaid(raid._id!)}
              >
                공격하기
              </div>
            </div>

            <div className="mt-[10px]">
              <div className="text-[20px] mb-[4px]">공격 로그</div>
              <RaidLogListComponent raidLogs={raid.raidLogs!} />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

function RaidLogListComponent({ raidLogs }: { raidLogs: RaidLog[] }) {
  const sortedRaidLog = _.sortBy(raidLogs, 'totalDamage').reverse()
  const groupedRaidLog = _.groupBy(raidLogs, 'owner.nickname')

  const mergedRaidLogs: Array<MergedRaidLog> = _.chain(groupedRaidLog)
    .mapValues((mRaidLogs) => {
      const totalDamage = mRaidLogs.reduce(
        (prev, next) => prev + next.totalDamage,
        0,
      )

      return {
        totalDamage,
        owner: mRaidLogs[0].owner,
        lastBattledAt: _.sortBy(mRaidLogs, 'createdAt').reverse()[0].createdAt!,
        raidLogs: mRaidLogs,
      }
    })
    .values()
    .sortBy('totalDamage')
    .reverse()
    .value()

  const [openData, setOpenData] = useState<boolean[]>(
    new Array(mergedRaidLogs.length).fill(false),
  )

  return (
    <div className="flex flex-col gap-[4px]">
      {mergedRaidLogs.map((mergedRaidLog, index) => {
        const { owner } = mergedRaidLog
        const onClick = (oIndex: number) => {
          const newOpenData = [...openData]
          newOpenData[oIndex] = !newOpenData[oIndex]
          setOpenData(newOpenData)
        }
        return (
          <div
            key={`raid-log-owner-${owner._id}`}
            className="flex flex-col cursor-pointer"
            onClick={() => onClick(index)}
          >
            <div className="flex items-center justify-start gap-[10px] hover:bg-gray-100">
              <div className="min-w-[20px] bg-[#245a7e] text-white text-center">
                {index + 1}
              </div>
              <img
                className="w-[40px] h-[40px]"
                src={toAPIHostURL(owner.thumbnail) || DEFAULT_THUMBNAIL_URL}
              />
              <div className="min-w-[120px]">{owner.nickname}</div>
              <div className="min-w-[100px]">
                {formatNumber(mergedRaidLog.totalDamage)}
              </div>
              <div className="flex items-center">
                <div className="min-w-[60px] text-center">
                  {ago(mergedRaidLog.lastBattledAt!)}
                </div>
                <div>({toHHMMSS(mergedRaidLog.lastBattledAt!)})</div>
              </div>
              <div>{mergedRaidLog.raidLogs.length.toLocaleString()}회 공격</div>
            </div>
            <div
              className="relative mt-[2px] pl-[30px] flex flex-col gap-[2px] overflow-y-scroll max-h-[200px]"
              style={{ display: openData[index] ? 'flex' : 'none' }}
            >
              <div className="flex items-center gap-[2px] sticky top-0 bg-gray-100">
                <div className="min-w-[30px] bg-gray-800 text-white text-center">
                  .
                </div>
                <div className="min-w-[100px]">데미지</div>
                <div className="min-w-[100px]">전투일시</div>
              </div>
              {_.sortBy(mergedRaidLog.raidLogs, 'createdAt')
                .reverse()
                .map((raidLog, rIndex) => {
                  return (
                    <div
                      key={createKey()}
                      className="flex items-center gap-[2px]"
                    >
                      <div className="min-w-[30px] bg-gray-800 text-white text-center">
                        {rIndex + 1}
                      </div>
                      <div className="min-w-[100px]">
                        {formatNumber(raidLog.totalDamage)}
                      </div>
                      <div className="flex justify-start items-center">
                        <div className="min-w-[90px]">
                          {ago(raidLog.createdAt!)}
                        </div>
                        <div>({toHHMMSS(raidLog.createdAt!)})</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
