'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
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
import { DropTableItem } from '@/interfaces/drop-table.interface'
import { BaseMisc, Misc } from '@/interfaces/item.interface'

export default function RaidDetailPage({
  params,
}: {
  params: { raidId: string }
}) {
  const router = useRouter()
  const [raid, setRaid] = useState<Raid>()
  const [dropItems, setDropItems] = useState<DropTableItem[]>([])

  const loadRaid = useCallback(async (raidId: string) => {
    const result = await fetchRaidDetail(raidId)
    const [raidMonster] = result.raid.monsters
    const { monster } = raidMonster || {}
    setDropItems(monster?.drop?.items || [])
    setRaid(result.raid)
  }, [])

  const attackRaid = useCallback(
    async (raidId: string) => {
      // await fetchRaidAttack(raidId)
      // await loadRaid(raidId)
      // return Swal.fire({
      //   title: '준비중',
      //   icon: 'info',
      //   confirmButtonText: '확인',
      // })
      router.push(`/main/battle/raid/${raidId}/attack`)
    },
    [router],
  )

  useEffect(() => {
    loadRaid(params.raidId)
  }, [loadRaid, params.raidId])

  return (
    <div className="w-full">
      <Card className="p-[10px] rounded w-full ff-score-all font-bold">
        {!raid && <div>Loading...</div>}
        {raid && (
          <div className="ff-score-all font-bold">
            <div className="">
              <div key={createKey()} className="flex items-center gap-[10px]">
                <div className="p-[1px] border border-blueGray-400 rounded shadow-md">
                  <div
                    className="w-[100px] h-[100px] bg-cover border border-blue-950 rounded"
                    style={{
                      backgroundImage: `url(${toAPIHostURL(raid.monsters[0]?.monster?.thumbnail)})`,
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[24px]">{raid.name}</div>
                  <div className="p-[2px] bg-red-200">
                    <div className="w-[300px] bg-red-300 p-[5px] text-white ff-score font-bold flex items-center justify-center">
                      {formatNumber(raid.monsters[0].currentHp)} /{' '}
                      {formatNumber(raid.monsters[0].monster?.hp || 0)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>저항</div>
                    <div>{raid.monsters[0].monster!.resist}%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>이동 속도</div>
                    <div>{raid.monsters[0].monster!.speed}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>충돌 피해</div>
                    <div>
                      {formatNumber(raid.monsters[0].monster!.collisionDamage)}
                    </div>
                  </div>
                  <div>도주까지 {getLeftTime(raid.expiredAt)}</div>
                </div>
              </div>
            </div>
            <div>
              * 레이드 몬스터에게 입힐 수 있는 최대 피해량은 레이드 몬스터 최대
              체력의 20%입니다.
            </div>
            <div>
              * 기록 전투 갱신을 위한 공격은 도주가 1분이내로 남았을때는
              불가능합니다.
            </div>
            <div className="mt-[10px]">
              <div
                className="w-full flex items-center justify-center bg-green-800 text-white h-[30px] cursor-pointer"
                onClick={() => attackRaid(raid._id!)}
              >
                공격하기(기록 전투 갱신)
              </div>
            </div>

            <div className="my-[10px]">
              <div className="text-[20px] mb-[4px]">토벌 보상</div>
              <div className="flex items-start flex-col gap-[5px] [&>div>div:first-child]:min-w-[60px] [&>div>div:first-child]:text-center">
                <div
                  className="flex items-center shadow shadow-gray-600 rounded bg-contain gap-[20px] border-2 border-white"
                  style={{
                    backgroundImage: `url("/images/pickup/background.png")`,
                  }}
                >
                  <div className="w-[100px] text-[20px] ff-score">1 ~ 5위</div>
                  <div className="p-[5px] border-dotted min-w-[300px] flex gap-[4px]">
                    {dropItems.map((dropItem) => {
                      return (
                        <DropItemBox
                          key={createKey()}
                          dropItem={dropItem}
                          isTopRank
                        />
                      )
                    })}
                  </div>
                </div>
                <div
                  className="flex items-center shadow shadow-gray-600 rounded bg-contain gap-[20px] border-2 border-white"
                  style={{
                    backgroundImage: `url("/images/pickup/background.png")`,
                  }}
                >
                  <div className="w-[100px] text-[20px]">6위 ~</div>
                  <div className="p-[5px] border-dotted min-w-[300px] flex gap-[4px]">
                    {dropItems
                      .filter((dropItem) => !dropItem.isTopRankReward)
                      .map((dropItem) => {
                        return (
                          <DropItemBox key={createKey()} dropItem={dropItem} />
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-b-gray-500 border-dashed" />

            <div className="mt-[10px]">
              <div className="text-[20px] mb-[4px] flex items-center gap-[5px]">
                <div>공격 로그</div>
                <div className="text-[16px]">
                  ({raid.raidLogs!.length}회 참여됨)
                </div>
              </div>
              <RaidLogListComponent raidLogs={raid.raidLogs!} />

              <div className="text-[20px] mb-[4px] flex items-center gap-[5px]">
                <div className="flex items-center gap-[10px]">
                  <i className="text-[4px] fa-solid fa-circle" />
                  <div>
                    동일한 데미지 일 경우, 먼저 공격한 사람이 우선순위로
                    집계됩니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export function DropItemBox({
  dropItem,
  isTopRank,
  isDarkMode,
}: {
  isTopRank?: boolean
  isDarkMode?: boolean
  dropItem: DropTableItem
}) {
  const { item, amount: originAmount } = dropItem
  const amount = originAmount

  if (dropItem.isTopRankReward && !isTopRank) return <></>
  return (
    <div
      className={`${isDarkMode ? 'bg-white' : ''} relative flex items-center skew-x-[-10deg] border border-gray-400 rounded-md bg-top bg-no-repeat bg-cover w-[50px] h-[50px] justify-center`}
      style={{
        backgroundImage: `url('/images/pickup/card-bg.png')`,
        boxShadow: isDarkMode
          ? '#ccc 0px 2px 1px 0px'
          : 'rgb(114 115 142) 0px 2px 1px 0px',
      }}
    >
      <Tooltip
        className="bg-transparent shadow-none"
        content={
          <div className="flex items-center bg-gray-800/90 px-[10px] py-[5px] rounded ff-score-all text-[16px] font-bold">
            <div>[{item.name}]</div>
            <div>x{formatNumber(amount)}</div>
          </div>
        }
      >
        <div className="cursor-pointer">
          <div className="w-[40px] h-[40px] rounded">
            <img
              className="w-full h-full skew-x-[10deg]"
              src={toAPIHostURL(item.thumbnail)}
            />
          </div>
          <div
            className={`${isDarkMode ? 'text-blue-gray-800 bg-white' : 'bg-white/70'} absolute z-[5] right-0 bottom-0 px-[4px] text-[12px] flex items-start ff-ba rounded`}
          >
            x{formatNumber(amount)}
          </div>
        </div>
      </Tooltip>
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
    .orderBy(['totalDamage'], ['desc'])
    .value()

  const test = _.chain(groupedRaidLog)
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
              <div className="min-w-[30px] bg-[#245a7e] text-white text-center">
                {index + 1}
              </div>
              <div
                className="w-[50px] h-[50px] bg-cover bg-center border border-gray-300 p-[2px] rounded"
                style={{
                  backgroundImage: `url('${owner.thumbnail || DEFAULT_THUMBNAIL_URL}')`,
                }}
              />
              <div className="min-w-[120px]">{owner.nickname}</div>
              <div className="min-w-[100px]">
                {formatNumber(mergedRaidLog.totalDamage)}
              </div>
              <div className="min-w-[100px]">
                {mergedRaidLog.raidLogs.length.toLocaleString()}회
              </div>
              <div className="flex items-center">
                <Tooltip content={toHHMMSS(mergedRaidLog.lastBattledAt!)}>
                  <div className="min-w-[100px] text-start">
                    {ago(mergedRaidLog.lastBattledAt!)}
                  </div>
                </Tooltip>
              </div>
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
