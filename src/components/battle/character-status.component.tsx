'use client'

import { Card, CardBody, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Character,
  CharacterStat,
  MeResponse,
} from '@/interfaces/user.interface'
import { Item } from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { fetchUnequipItem } from '@/services/api-fetch'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import WeaponBoxDetailComponent from '@/components/item/weapon-box-detail.component'
import { InventoryActionKind } from '@/components/item/item.interface'
import CharacterStatusDeckListComponent from '@/components/battle/character-status-deck-list.component'
import { fetchGetAllCardSet } from '@/services/api/api.card'
import { GatchaCard } from '@/interfaces/gatcha.interface'
import { ProfilePopover } from '@/components/popover/profile-popover'

export default (function CharacterStatusComponent({
  character,
  nextExp,
  stat,
  equippedItems,
  refreshInventory,
  refreshMe,
  meResponse,
}: {
  character: Character
  nextExp: number
  equippedItems: Item[]
  stat: CharacterStat
  refreshInventory: () => Promise<void>
  refreshMe: () => Promise<void>
  meResponse: MeResponse
}) {
  const [allCardSet, setAllCardSet] = useState<GatchaCard[]>()
  const unequipItem = async (item: Item) => {
    await fetchUnequipItem(item._id!)
    await Promise.all([refreshInventory(), refreshMe()])
  }

  const loadAllCardSet = useCallback(async () => {
    const result = await fetchGetAllCardSet()
    setAllCardSet(result.cardSet)
  }, [])

  useEffect(() => {
    loadAllCardSet()
  }, [loadAllCardSet])

  const EXP_WIDTH = 250
  return (
    <Card className="rounded min-w-[460px] w-full flex flex-col justify-start items-start min-h-40">
      <CardBody className="w-full">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <ProfilePopover
              onSelect={async () => {
                await refreshMe()
              }}
              child={
                <div className="w-[80px] h-[80px] min-w-[80px] min-h-[80px] flex items-center justify-center border border-gray-300 rounded p-[2px]">
                  {/* <img className="w-full" src="/images/ako.webp" /> */}
                  {!character.thumbnail && (
                    <img className="w-full" src={DEFAULT_THUMBNAIL_URL} />
                  )}
                  {character.thumbnail && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${character.thumbnail}')`,
                      }}
                    />
                  )}
                </div>
              }
            />
            <div className="w-full flex flex-col gap-[2px]">
              <div className="flex w-full justify-between">
                <div>Lv.{character.level}</div>
                <div>{character.nickname}</div>
              </div>
              <div className="w-full flex justify-between">
                <div>골드</div>
                <div>{character.gold.toLocaleString()}</div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div>경험치</div>
                <div>
                  <Tooltip
                    interactive
                    content={`경험치 ${character.experience} / ${nextExp}`}
                  >
                    <div
                      className={`min-w-[${EXP_WIDTH}px] max-w-[${EXP_WIDTH}px] min-h-[26px] flex justify-center items-center relative rounded-md overflow-hidden border-2 border-blue-200 noselect cursor-pointer`}
                    >
                      {/* {character.experience}/{nextExp} */}
                      <div
                        className="absolute left-0 max-w-[300px] min-h-full opacity-80 z-[5]"
                        style={{
                          width: `${EXP_WIDTH * (character.experience / nextExp)}px`,
                          background:
                            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                          transition: 'width 1s',
                        }}
                      />
                      <div
                        className={`absolute min-w-[${EXP_WIDTH}px] max-w-[{EXP_WIDTH$px] min-h-full bg-blue-100`}
                      />
                      <div
                        className={`z-[5] absolute min-w-[${EXP_WIDTH}px] max-w-[{EXP_WIDTH$px] min-h-full flex items-center justify-center text-white ff-ba text-[20px] leading-[20px]`}
                      >
                        {((character.experience / nextExp) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between">
            <div>기본 물리 피해</div>
            <div>{stat.damageOfPhysical}</div>
          </div>
          <div className="w-full flex justify-between">
            <div>기본 화염 피해</div>
            <div>{stat.damageOfFire}</div>
          </div>
          <div className="w-full flex justify-between">
            <div>기본 냉기 피해</div>
            <div>{stat.damageOfCold}</div>
          </div>
          <div className="w-full flex justify-between">
            <div>기본 번개 피해</div>
            <div>{stat.damageOfLightning}</div>
          </div>

          <div className="w-full flex justify-between">
            <div>치명타 확률</div>
            <div>{stat.criticalRate.toFixed(2)}%</div>
          </div>
          <div className="w-full flex justify-between">
            <div>치명타 배율</div>
            <div>+{stat.criticalMultiplier}%</div>
          </div>
          <div className="w-full flex justify-between">
            <div>힘</div>
            <div>+{stat.str}</div>
          </div>
          <div className="w-full flex justify-between">
            <div>민첩</div>
            <div>+{stat.dex}</div>
          </div>
          <div className="w-full flex justify-between">
            <div>행운</div>
            <div>+{stat.luk}</div>
          </div>
          <hr className="mb-1" />
          <div>
            <div>착용장비</div>
            <div className="flex flex-col gap-1">
              {equippedItems?.length === 0 && (
                <div className="w-full min-h-[30px] border border-gray-300 rounded flex justify-center items-center">
                  착용된 장비가 없습니다.
                </div>
              )}

              {equippedItems?.length > 0 &&
                equippedItems.map((item: Item) => {
                  return (
                    <div key={`${item._id}_equipped`} className="flex gap-1">
                      <div
                        className="min-w-[30px] min-h-[30px] border border-gray-300 rounded flex justify-center items-center bg-red-300 text-white cursor-pointer"
                        onClick={() => unequipItem(item)}
                      >
                        x
                      </div>
                      <Tooltip
                        className="rounded-none bg-transparent"
                        interactive
                        content={
                          <WeaponBoxDetailComponent
                            item={item}
                            actions={[InventoryActionKind.Share]}
                          />
                        }
                      >
                        <div className="pl-[3px] w-full min-h-[30px] border border-gray-300 rounded flex justify-start items-center gap-1">
                          <img
                            src={toAPIHostURL(item.weapon.thumbnail)}
                            className="w-[24px] h-[24px] border rounded"
                          />
                          <div>{item.weapon.name}</div>
                        </div>
                      </Tooltip>
                    </div>
                  )
                })}
            </div>
          </div>
          <hr className="mb-1" />
          <div>
            <div>사용중인 덱</div>
            <div>
              {meResponse.deck && (
                <CharacterStatusDeckListComponent
                  deck={meResponse.deck}
                  allCardSet={allCardSet || []}
                />
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
})
