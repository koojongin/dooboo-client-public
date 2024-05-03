'use client'

import { useCallback, useEffect, useState } from 'react'
import { Tooltip } from '@material-tailwind/react'
import {
  fetchGetRankByDamageList,
  fetchGetRankList,
} from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import {
  ago,
  getItemByType,
  toColorByGrade,
  toMMDDHHMM,
  toMMDDHHMMSS,
} from '@/services/util'
import { WeaponBoxDetailComponent } from '@/app/main/inventory.component'
import createKey from '@/services/key-generator'
import { RankLog } from '@/interfaces/user.interface'

export default function CommunityPage() {
  const [characters, setCharacters] = useState<any[]>([])
  const [rankLogs, setRankLogs] = useState<RankLog[]>([])

  const tableClass = [
    'min-w-[50px] text-center',
    'min-w-[50px] text-center',
    'min-w-[100px] ',
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

  useEffect(() => {
    loadRanks()
    loadRankByDamages()
  }, [loadRanks, loadRankByDamages])
  return (
    <div className="flex flex-wrap gap-[10px]">
      <div className="w-[600px]">
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
                <div className={tableClass[2]}>{user.nickname}</div>
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
                <div className="ml-auto">
                  {character.lastBattledAt
                    ? ago(new Date(character.lastBattledAt))
                    : ''}
                </div>
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
                  <div className="w-[120px] text-left">
                    {rankLog.owner.nickname}
                  </div>
                  <div className="w-[100px] text-left">
                    {rankLog.snapshot.totalDamage.toFixed(1)}
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
                  <div className="w-[100px] ml-auto text-right">
                    {ago(rankLog.updatedAt!)}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
