'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tooltip } from '@material-tailwind/react'
import {
  fetchGetRankByDamageList,
  fetchGetRankList,
} from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import {
  ago,
  formatNumber,
  getItemByType,
  getJobIconBgColor,
  getJobIconUrl,
  toColorByGrade,
  toMMDDHHMM,
  toMMDDHHMMSS,
  toYYYYMMDDHHMMSS,
  translate,
} from '@/services/util'
import createKey from '@/services/key-generator'
import { RankLog } from '@/interfaces/user.interface'
import WeaponBoxDetailComponent from '@/components/item/weapon-box-detail.component'

export default function CommunityPage() {
  const router = useRouter()
  const [characters, setCharacters] = useState<any[]>([])
  const [rankLogs, setRankLogs] = useState<RankLog[]>([])

  const tableClass = [
    'min-w-[50px] text-center',
    'min-w-[50px] text-center',
    'min-w-[50px] w-[100px] truncate overflow-ellipsis cursor-pointer',
  ]

  const loadRanks = useCallback(async () => {
    const { characters: rCharacters } = await fetchGetRankList()
    setCharacters(rCharacters)
  }, [])

  const loadRankByDamages = useCallback(async () => {
    const { ranks } = await fetchGetRankByDamageList()
    const newRanks = ranks.map((rank) => {
      const newRank: any = { ...rank }
      newRank.snapshot?.items?.forEach((item: any) => {
        if (item.iType === 'weapon') {
          newRank.snapshot.weapon = item
          newRank.snapshot.weapon.totalFlatDamage =
            item.weapon.damageOfPhysical +
            item.weapon.damageOfCold +
            item.weapon.damageOfLightning +
            item.weapon.damageOfFire
        }
      })
      return newRank
    })
    setRankLogs(newRanks)
  }, [])

  // 클릭하면 넘어가기
  const goToProfile = (characterId: string) => {
    router.push(`/main/profile/${characterId}`)
  }

  useEffect(() => {
    loadRanks()
    loadRankByDamages()
  }, [loadRanks, loadRankByDamages])

  return (
    <div className="flex flex-wrap gap-[10px]">
      <div className="w-[500px]">
        <div className="bg-blue-gray-500 text-white py-[4px] px-[10px] ff-gs text-[20px]">
          레벨 랭크
        </div>
        <div className="flex gap-1 px-[1px] py-[1px] bg-blue-gray-200 bg-dark-blue text-white">
          <div className={tableClass[0]}>랭크</div>
          <div className={tableClass[1]}>레벨</div>
          <div className={tableClass[2]}>캐릭터명</div>
          <div className="">장비</div>
        </div>
        {characters &&
          characters.map((character, index) => {
            const { user } = character
            let totalFlatDamage = 0
            let selectedItem = null
            if (character.equip) {
              selectedItem = getItemByType(character.equip)
              totalFlatDamage =
                selectedItem.damageOfPhysical +
                selectedItem.damageOfLightning +
                selectedItem.damageOfCold +
                selectedItem.damageOfFire
            }

            return (
              <div
                key={createKey()}
                className="flex gap-1 px-[1px] py-[1px] items-center min-h-[30px] border-blue-gray-50 border-b"
              >
                <div className={tableClass[0]}>{index + 1}</div>
                <div className={tableClass[1]}>{character.level}</div>
                <div
                  onClick={() => {
                    goToProfile(character._id)
                  }}
                  className={tableClass[2]}
                >
                  <Tooltip
                    content={`[${translate(`job:${character.job ? character.job : 'novice'}`)}]${
                      character.nickname
                    }`}
                  >
                    <div className="flex items-center gap-[2px]">
                      <div
                        className="w-[20px] h-[20px] min-w-[20px] min-h-[20px]"
                        style={{
                          background: getJobIconBgColor(character.job),
                        }}
                      >
                        <img
                          src={getJobIconUrl(character.job)}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="ff-score font-bold leading-[100%] overflow-ellipsis truncate">
                        {character.nickname}
                      </div>
                    </div>
                  </Tooltip>
                </div>
                {character.equip && (
                  <div className="flex items-center gap-[2px]">
                    <Tooltip
                      className="rounded-none bg-transparent"
                      interactive
                      content={
                        <WeaponBoxDetailComponent item={character.equip} />
                      }
                    >
                      <div
                        className="border-2 rounded border-gray-800"
                        style={{
                          borderColor: toColorByGrade(
                            character.equip.weapon.iGrade,
                          ),
                        }}
                      >
                        <div className="absolute m-[1px] px-[2px] text-[12px] border rounded px-[2px] bg-[#424242a6] text-white ff-ba ff-skew">
                          {totalFlatDamage}
                        </div>
                        <img
                          className="w-[40px] h-[40px] p-[2px] border rounded"
                          src={toAPIHostURL(selectedItem?.thumbnail || '')}
                        />
                      </div>
                    </Tooltip>
                    <div>
                      [{character.equip.weapon.name}
                      {character.equip.weapon.starForce > 0
                        ? `+${character.equip.weapon.starForce}`
                        : ''}
                      ]
                    </div>
                  </div>
                )}
                <Tooltip content={toYYYYMMDDHHMMSS(character.lastBattledAt!)}>
                  <div className="ml-auto">
                    {character.lastBattledAt
                      ? ago(new Date(character.lastBattledAt))
                      : ''}
                  </div>
                </Tooltip>
              </div>
            )
          })}
      </div>
      <div className="w-[600px]">
        <div className="bg-blue-gray-500 text-white py-[4px] px-[10px] ff-gs text-[20px]">
          데미지 랭크
          <span className="text-[16px] text-red-100">
            (*전투지역의 허수아비를 공격시 갱신됩니다)
          </span>
        </div>
        <div className="flex gap-1 px-[1px] py-[1px] bg-blue-gray-200 bg-dark-blue text-white">
          <div className="w-[40px] text-center">랭크</div>
          <div className="w-[40px] text-center">레벨</div>
          <div className="w-[120px] text-left">캐릭터명</div>
          <div className="w-[100px] text-left">총 데미지</div>
          <div className="w-[100px] text-left">평균 데미지</div>
          <div className="w-[100px] ml-auto" />
        </div>
        <div>
          {rankLogs &&
            rankLogs.map((rankLog, index) => {
              return (
                <div
                  key={createKey()}
                  className="flex gap-1 px-[1px] py-[1px] items-center min-h-[30px] border-blue-gray-50 border-b"
                >
                  <div className="w-[40px] text-center">{index + 1}</div>
                  <div className="w-[40px] text-center">
                    {rankLog.owner.level}
                  </div>
                  <Tooltip
                    content={`[${translate(`job:${rankLog.owner.job ? rankLog.owner.job : 'novice'}`)}]${
                      rankLog.owner.nickname
                    }`}
                  >
                    <div className="w-[120px] text-left flex items-center gap-[2px] cursor-pointer">
                      <div
                        className="w-[20px] h-[20px] min-w-[20px] min-h-[20px]"
                        style={{
                          background: getJobIconBgColor(rankLog.owner.job),
                        }}
                      >
                        <img
                          src={getJobIconUrl(rankLog.owner.job)}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="text-left ff-score font-bold leading-[100%] overflow-ellipsis truncate">
                        {rankLog.owner.nickname}
                      </div>
                    </div>
                  </Tooltip>
                  <div className="w-[100px] text-left">
                    {formatNumber(rankLog.snapshot.totalDamage)}
                  </div>
                  <div className="w-[100px] text-left">
                    {rankLog.snapshot.averageDamage.toFixed(1)}
                  </div>
                  <div>
                    {rankLog.snapshot.weapon && (
                      <Tooltip
                        className="rounded-none bg-transparent"
                        interactive
                        content={
                          <WeaponBoxDetailComponent
                            item={rankLog.snapshot.weapon}
                          />
                        }
                      >
                        <div
                          className="border-2 rounded border-gray-800"
                          style={{
                            borderColor: toColorByGrade(
                              rankLog.snapshot.weapon.weapon.iGrade,
                            ),
                          }}
                        >
                          <div className="absolute m-[1px] px-[2px] text-[12px] border rounded px-[2px] bg-[#424242a6] text-white ff-ba ff-skew">
                            {rankLog.snapshot.weapon.totalFlatDamage}
                          </div>
                          <img
                            className="w-[40px] h-[40px] p-[2px] border rounded"
                            src={toAPIHostURL(
                              rankLog.snapshot.weapon.weapon?.thumbnail || '',
                            )}
                          />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <Tooltip content={toYYYYMMDDHHMMSS(rankLog.updatedAt!)}>
                    <div className="w-[100px] ml-auto text-right">
                      {ago(rankLog.updatedAt!)}
                    </div>
                  </Tooltip>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
