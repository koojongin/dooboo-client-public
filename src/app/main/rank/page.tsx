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
  toYYYYMMDDHHMMSS,
  translate,
} from '@/services/util'
import createKey from '@/services/key-generator'
import { RankLog, RankOfDamageListResponse } from '@/interfaces/user.interface'
import WeaponBoxDetailComponent from '@/components/item/item-box/weapon-box-detail.component'
import { Pagination } from '@/interfaces/common.interface'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { ActiveSkill } from '@/services/skill/skill'
import { ItemTypeKind } from '@/interfaces/item.interface'
import { ProfileSearchBar } from '@/app/main/profile/profile-search-bar'

export default function CommunityPage() {
  const router = useRouter()
  const [characters, setCharacters] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [dPagination, setDPagination] = useState<Pagination>()

  const [rankLogs, setRankLogs] = useState<
    Array<RankLog & { activeSkill?: ActiveSkill }>
  >([])

  const tableClass = [
    'min-w-[50px] text-center',
    'min-w-[50px] text-center',
    'min-w-[50px] w-[150px] truncate overflow-ellipsis cursor-pointer',
  ]

  const loadRanks = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetRankList({}, { page: selectedPage })
    setCharacters(result.characters)
    setPagination(result)
  }, [])

  const loadRankByDamages = useCallback(async (selectedPage = 1) => {
    const result: RankOfDamageListResponse = await fetchGetRankByDamageList(
      {},
      { page: selectedPage },
    )
    const newRanks = result?.ranks.map((rank) => {
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
    setDPagination(result)
  }, [])

  const goToProfile = (characterId: string) => {
    router.push(`/main/profile/${characterId}`)
  }

  useEffect(() => {
    loadRanks()
    loadRankByDamages()
  }, [loadRanks, loadRankByDamages])

  return (
    <div className="flex flex-col gap-[10px]">
      <ProfileSearchBar />
      <div className="flex flex-wrap gap-[10px]">
        <div className="w-[450px]">
          <div className="bg-blue-gray-500 text-white py-[4px] px-[10px] ff-gs text-[20px]">
            레벨 랭크
          </div>
          <div className="flex gap-1 px-[1px] py-[1px] bg-dark-blue text-white">
            <div className={tableClass[0]}>랭크</div>
            <div className={tableClass[1]}>레벨</div>
            <div className={tableClass[2]}>캐릭터명</div>
            <div className="w-[60px]">장비</div>
            <div className="w-[60px]">스킬</div>
          </div>
          <div>
            {characters &&
              characters.map((character, index) => {
                const { user } = character
                let totalFlatDamage = 0
                let selectedItem = null
                if (
                  character.equip &&
                  character.equip?.iType === ItemTypeKind.Weapon
                ) {
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
                    className="flex gap-[2px] px-[1px] py-[1px] items-center min-h-[50px] border-blue-gray-50 border-b"
                  >
                    <div className={tableClass[0]}>
                      {index +
                        1 +
                        (pagination?.limit || 10) *
                          ((pagination?.page || 1) - 1)}
                    </div>
                    <div className={tableClass[1]}>{character.level}</div>
                    <div
                      onClick={() => {
                        goToProfile(character._id)
                      }}
                      className={tableClass[2]}
                    >
                      <Tooltip content="클릭 시 프로필로 이동합니다.">
                        <div className="flex items-center gap-[2px]">
                          <div
                            className="border border-gray-200 rounded overflow-hidden p-[1px] w-[30px] h-[30px] bg-center bg-cover bg-white bg-clip-content"
                            style={{
                              backgroundImage: `url('${character?.thumbnail || DEFAULT_THUMBNAIL_URL}')`,
                            }}
                          />
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
                    {character.equip?.weapon && (
                      <div className="flex items-center gap-[2px] w-[60px]">
                        <Tooltip
                          className="rounded-none bg-transparent"
                          interactive
                          content={
                            <WeaponBoxDetailComponent item={character.equip} />
                          }
                        >
                          <div
                            className="border-2 rounded border-gray-800 min-w-[44px]"
                            style={{
                              borderColor: toColorByGrade(
                                character.equip.weapon.iGrade,
                              ),
                            }}
                          >
                            <div className="absolute m-[1px] text-[12px] border rounded px-[2px] bg-[#424242a6] text-white ff-ba ff-skew">
                              {totalFlatDamage}
                            </div>
                            <img
                              className="w-[40px] h-[40px] p-[2px] border rounded"
                              src={toAPIHostURL(selectedItem?.thumbnail || '')}
                            />
                          </div>
                        </Tooltip>
                      </div>
                    )}
                    {character.activeSkill && (
                      <Tooltip
                        content={translate(
                          `skill:${character.activeSkill.name}`,
                        )}
                      >
                        <div className="w-[60px] cursor-pointer">
                          <div
                            className="bg-cover w-[42px] h-[42px]"
                            style={{
                              backgroundImage: `url('${character.activeSkill.icon}')`,
                            }}
                          />
                        </div>
                      </Tooltip>
                    )}
                    <Tooltip
                      content={
                        <div>
                          {!character.lastEarnedAt && (
                            <div>전투 기록이 없습니다.</div>
                          )}
                          {!!character.lastEarnedAt && (
                            <div className="flex items-center justify-start">
                              <div className="min-w-[70px]">최근 전투</div>
                              <div>
                                {toYYYYMMDDHHMMSS(character.lastEarnedAt!)} [
                                {ago(character.lastEarnedAt!)}]
                              </div>
                            </div>
                          )}
                        </div>
                      }
                    >
                      <div className="ml-auto min-w-[50px] w-[50px]">
                        자세히
                      </div>
                    </Tooltip>
                  </div>
                )
              })}
          </div>
          <div>
            {pagination && (
              <div className="w-full flex justify-start mt-[15px]">
                <div className="flex flex-wrap gap-[2px]">
                  {new Array(pagination.totalPages)
                    .fill(1)
                    .map((value, index) => {
                      return (
                        <div
                          className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                          onClick={() => loadRanks(index + 1)}
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
        </div>
        <div className="w-[550px]">
          <div className="bg-blue-gray-500 text-white py-[4px] px-[10px] ff-gs text-[20px]">
            데미지 랭크
            <span className="text-[16px] text-red-100">
              (*전투지역의 허수아비를 공격시 갱신됩니다)
            </span>
          </div>
          <div className="bg-blueGray-600/10 px-[10px] py-[4px]">
            <div className="text-[14px] flex flex-col gap-[4px]">
              <div className="flex items-center gap-[10px]">
                <i className="text-[4px] fa-solid fa-circle" />
                <Tooltip
                  interactive
                  className="bg-transparent"
                  content={
                    <div className="ff-score-all font-bold flex flex-col gap-[10px] bg-gray-800 p-[10px] rounded-md shadow-lg border-gray-800 border border-dashed shadow-gray-600 min-w-[250px]">
                      <div className="p-[1px] border border-gray-200 rounded bg-white text-gray-800">
                        <div className="flex flex-col items-start gap-[4px] border p-[5px] border-white rounded">
                          <div className="text-[20px] bg-green-500 text-white rounded px-[5px]">
                            랭킹 1위 ~ 5위
                          </div>
                          <div className="flex flex-wrap gap-[4px] items-center">
                            <div className="text-[20px]">보상</div>
                            <div className="flex items-center gap-[2px]">
                              {[
                                {
                                  src: '/images/black-smith/defence-scroll.png',
                                  amount: 1,
                                },
                              ].map((data) => {
                                return (
                                  <div
                                    className="border border-gray-800 bg-gray-200 p-[2px] relative rounded"
                                    key={createKey()}
                                  >
                                    <div
                                      className="bg-contain bg-center bg-no-repeat w-[40px] h-[40px]"
                                      style={{
                                        backgroundImage: `url(${data.src})`,
                                      }}
                                    />
                                    <div className="absolute bottom-0 right-0 bg-white/80 ff-wavve px-[4px] rounded text-[10px]">
                                      x{data.amount}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-[1px] border border-gray-200 rounded bg-white text-gray-800">
                        <div className="flex flex-col items-start gap-[4px] border p-[5px] border-white rounded">
                          <div className="text-[20px] bg-green-500 text-white rounded px-[5px]">
                            랭킹 1위 ~ 5위
                          </div>
                          <div className="flex flex-wrap gap-[4px] items-center">
                            <div className="text-[20px]">보상</div>
                            <div className="flex items-center gap-[2px]">
                              {[
                                {
                                  src: '/images/icon_diamond.webp',
                                  amount: 500,
                                },
                                {
                                  src: '/images/black-smith/init-star-force.png',
                                  amount: 1,
                                },
                                {
                                  src: '/images/black-smith/black-smith-scroll.png',
                                  amount: 1,
                                },
                                {
                                  src: '/images/black-smith/oblivion.png',
                                  amount: 1,
                                },
                              ].map((data) => {
                                return (
                                  <div
                                    className="border border-gray-800 bg-gray-200 p-[2px] relative rounded"
                                    key={createKey()}
                                  >
                                    <div
                                      className="bg-contain bg-center bg-no-repeat w-[40px] h-[40px]"
                                      style={{
                                        backgroundImage: `url(${data.src})`,
                                      }}
                                    />
                                    <div className="absolute bottom-0 right-0 bg-white/80 ff-wavve px-[4px] rounded text-[10px]">
                                      x{data.amount}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-[1px] border border-gray-200 rounded bg-white text-gray-800">
                        <div className="flex flex-col items-start gap-[4px] border p-[5px] border-white rounded">
                          <div className="text-[20px] bg-green-500 text-white rounded px-[5px]">
                            랭킹 6위 ~
                          </div>
                          <div className="flex flex-wrap gap-[4px] items-center">
                            <div className="text-[20px]">보상</div>
                            <div className="flex items-center gap-[2px]">
                              {[
                                {
                                  src: '/images/icon_diamond.webp',
                                  amount: 200,
                                },
                                {
                                  src: '/images/black-smith/init-star-force.png',
                                  amount: 1,
                                },
                                {
                                  src: '/images/black-smith/black-smith-scroll.png',
                                  amount: 1,
                                },
                                {
                                  src: '/images/black-smith/oblivion.png',
                                  amount: 1,
                                },
                              ].map((data) => {
                                return (
                                  <div
                                    className="border border-gray-800 bg-gray-200 p-[2px] relative rounded"
                                    key={createKey()}
                                  >
                                    <div
                                      className="bg-contain bg-center bg-no-repeat w-[40px] h-[40px]"
                                      style={{
                                        backgroundImage: `url(${data.src})`,
                                      }}
                                    />
                                    <div className="absolute bottom-0 right-0 bg-white/80 ff-wavve px-[4px] rounded text-[10px]">
                                      x{data.amount}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="cursor-pointer bg-ruliweb text-white p-[4px] rounded ff-score font-bold">
                    랭킹 보상
                  </div>
                </Tooltip>
              </div>
              <div className="flex items-center gap-[10px]">
                <i className="text-[4px] fa-solid fa-circle" />
                <div>
                  매일 2시부터 4시간 주기로 초기화됩니다. (2, 6, 10, 14, 18, 22)
                </div>
              </div>
              <div className="flex items-center gap-[10px]">
                <i className="text-[4px] fa-solid fa-circle" />
                <div>
                  최소 1번 허수아비를 공격하여 참여해야 보상을 획득할 수
                  있습니다.
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-[2px] px-[1px] py-[1px] bg-blue-gray-200 bg-dark-blue text-white">
            <div className="w-[40px] text-center">랭크</div>
            <div className="w-[40px] text-center">레벨</div>
            <div className="w-[150px] text-left">캐릭터명</div>
            <div className="w-[100px] text-left">총 데미지</div>
            <div className="w-[60px]">장비</div>
            <div className="w-[60px]">스킬</div>
          </div>
          <div>
            {rankLogs &&
              rankLogs.map((rankLog, index) => {
                return (
                  <div
                    key={createKey()}
                    className="flex gap-1 px-[1px] py-[1px] items-center min-h-[50px] border-blue-gray-50 border-b"
                  >
                    <div className="min-w-[40px] w-[40px] text-center">
                      {' '}
                      {index +
                        1 +
                        (dPagination?.limit || 10) *
                          ((dPagination?.page || 1) - 1)}
                    </div>
                    <div className="min-w-[40px] w-[40px] text-center">
                      {rankLog.owner.level}
                    </div>
                    <Tooltip content="클릭 시 프로필로 이동합니다.">
                      <div
                        className="min-w-[150px] w-[150px] text-left flex items-center gap-[2px] cursor-pointer"
                        onClick={() => {
                          goToProfile(rankLog.owner._id)
                        }}
                      >
                        <div
                          className="border border-gray-200 rounded overflow-hidden p-[1px] w-[30px] h-[30px] bg-center bg-cover bg-white bg-clip-content"
                          style={{
                            backgroundImage: `url('${rankLog.owner.thumbnail || DEFAULT_THUMBNAIL_URL}')`,
                          }}
                        />
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
                    <div className="w-[100px] min-w-[100px] text-left">
                      {formatNumber(rankLog.snapshot.totalDamage)}
                    </div>
                    <div className="min-w-[60px] w-[60px] flex">
                      <div className="">
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
                                  rankLog.snapshot.weapon.weapon?.thumbnail ||
                                    '',
                                )}
                              />
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div className="min-w-[60px] w-[60px]">
                      {rankLog.snapshot.activeSkill && (
                        <Tooltip
                          content={translate(
                            `skill:${rankLog.snapshot.activeSkill.name}`,
                          )}
                        >
                          <div className="w-[60px] cursor-pointer">
                            <div
                              className="bg-cover w-[42px] h-[42px]"
                              style={{
                                backgroundImage: `url('${rankLog.snapshot.activeSkill.icon}')`,
                              }}
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
          <div>
            {dPagination && (
              <div className="w-full flex justify-start mt-[15px]">
                <div className="flex flex-wrap gap-[2px]">
                  {new Array(dPagination.totalPages)
                    .fill(1)
                    .map((value, index) => {
                      return (
                        <div
                          className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === dPagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                          onClick={() => loadRankByDamages(index + 1)}
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
        </div>
      </div>
    </div>
  )
}
