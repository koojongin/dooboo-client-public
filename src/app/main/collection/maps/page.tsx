'use client'

import { useEffect, useState } from 'react'
import { Card, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'
import { fetchGetMapsName } from '@/services/api-fetch'
import { DbMap } from '@/interfaces/map.interface'
import toAPIHostURL from '@/services/image-name-parser'
import createKey from '@/services/key-generator'
import { Monster } from '@/interfaces/monster.interface'
import { translate } from '@/services/util'
import { BaseItemTypeKind, ItemTypeKind } from '@/interfaces/item.interface'
import { BaseMiscBoxTooltipComponent } from './base-misc-box-tooltip.component'
import { BaseWeaponBoxTooltipComponent } from './base-weapon-box-tooltip.component'
import { fetchGetMap } from '@/services/api-admin-fetch'
import { BaseDefenceGearBoxTooltipComponent } from '@/app/main/collection/maps/base-defence-gear-box-tooltip.component'

type SelectableDbMap = DbMap & { isSelected?: boolean }
type MixedDbMap = DbMap & { monsters: Monster[]; totalWeight: number }
export default function CollectionMapsPage() {
  const [maps, setMaps] = useState<SelectableDbMap[]>([])
  const [selectedMap, setSelectedMap] = useState<MixedDbMap>()
  const getMapNames = async () => {
    const result = await fetchGetMapsName()
    setMaps(result.maps)
  }

  const selectMap = async (map: DbMap, index: number) => {
    const newMaps = maps.map((oMap, oMapIdx) => {
      const newMap = { ...oMap }
      newMap.isSelected = oMapIdx === index
      return newMap
    })
    setMaps(newMaps)

    const { map: rMap, monsters: rMonsters } = await fetchGetMap(map._id!)

    const order = [
      BaseItemTypeKind.BaseMisc,
      BaseItemTypeKind.BaseWeapon,
      BaseItemTypeKind.BaseDefenceGear,
    ]
    const sorted = {
      ...rMap,
      monsters: _.sortBy(
        rMonsters.map((monster) => {
          if (!monster.drop) return monster
          if ((monster.drop?.items?.length || 0) > 0) {
            const newMonster = { ...monster }
            newMonster.drop!.items = _.orderBy(
              newMonster.drop!.items,
              [(item) => order.indexOf(item.iType as any)],
              ['asc'],
            )
            return newMonster
          }
          return monster
        }),
        'weight',
      ).reverse(),
      totalWeight: rMonsters.reduce((prev, next) => prev + next.weight, 0),
    }

    setSelectedMap(sorted)
  }

  useEffect(() => {
    getMapNames()
  }, [])

  return (
    <div className=" w-full">
      <Card className="rounded p-[10px]">
        <div className="text-[16px] text-red-300">
          * 아래에 지역 중 하나를 선택시 해당 지역의 드랍 테이블을 조회합니다.
        </div>
        <div className="flex flex-wrap gap-[4px]">
          {maps.map((map, index) => {
            return (
              <div
                key={map._id}
                className={`flex flex-row border rounded px-[4px] py-[2px] cursor-pointer ${map?.isSelected ? 'bg-green-300 text-white' : 'bg-gray-200 text-dark-blue'}`}
                onClick={() => selectMap(map, index)}
              >
                <div className="flex">{map.name}</div>
              </div>
            )
          })}
        </div>
        {selectedMap && (
          <div className="flex flex-col mt-[10px]">
            <div className="bg-gradient-to-r from-blue-gray-600/90 to-blue-gray-100/0 min-w-[800px] text-white px-[10px] py-[10px] text-[30px] flex items-center ff-gs-all">
              <div className="">
                {selectedMap.name}({selectedMap.level})
              </div>
            </div>
            {/* <div className="flex bg-indigo-400 text-white py-[8px]"> */}
            <div className="mt-[10px] flex bg-gradient-to-r from-indigo-600/90 to-blue-gray-100/0 text-white px-[10px] py-[0px] ff-gs-all">
              <div className="min-w-[250px]">
                <div>등장 몬스터</div>
              </div>
              <div>드랍 일람</div>
            </div>
            {selectedMap.monsters.map((monster) => {
              return (
                <div
                  key={`${selectedMap._id}_${monster._id}`}
                  className="flex border-b border-blue-gray-50 py-[6px]"
                >
                  {/* MonsterDiv Start */}
                  <div className="flex gap-[1px] flex-col justify-start items-start flex items-center ff-score-all font-bold">
                    <div className="flex gap-[10px] justify-center items-start min-w-[250px]">
                      <div
                        className="w-[80px] h-[80px] min-w-[80px] bg-cover bg-center border border-blue-950 rounded p-[4px] bg-clip-content shadow"
                        style={{
                          backgroundImage: `url('${toAPIHostURL(monster.thumbnail)}')`,
                        }}
                      />
                      <div className="text-[14px] w-full">
                        <div className="text-[20px]">{monster.name}</div>
                        <div className="">
                          {(
                            (monster.weight / selectedMap.totalWeight) *
                            100
                          ).toFixed(2)}
                          %({monster.weight})
                        </div>
                        <div className="text-green-400">
                          +{monster.experience.toLocaleString()}exp, +
                          {monster.gold.toLocaleString()}g
                        </div>
                        <div className="text-red-300">
                          {monster.hp.toLocaleString()}hp
                        </div>
                        <div className="text-blue-900">
                          방어력:{monster.armor.toLocaleString()}
                        </div>
                        <div className="text-blue-900">
                          저항:{monster.resist.toLocaleString()}%
                        </div>
                        <div className="text-blue-900">
                          충돌 피해:{monster.collisionDamage.toLocaleString()}
                        </div>
                        <div className="text-red-900 flex items-center flex-wrap">
                          <Tooltip
                            content={
                              <div>방어력을 무시하고 피해를 입습니다.</div>
                            }
                          >
                            <div className="flex items-center cursor-pointer">
                              <div>고정 충돌 피해</div>
                              <div className="flex items-center justify-center bg-gray-800 text-white rounded-full text-[12px] w-[14px] h-[14px]">
                                <i className="fa-solid fa-question text-[10px]" />
                              </div>
                              <div>:</div>
                            </div>
                          </Tooltip>
                          {monster.collisionTrueDamage.toLocaleString()}
                        </div>
                        <div className="text-blue-500">
                          이동속도:{monster.speed}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* MonsterDiv End */}

                  {/* ItemList Start */}
                  <div className="flex flex-wrap gap-[5px] items-center justify-start">
                    {monster.drop?.items.map((itemData) => {
                      const { item } = itemData
                      return (
                        <div key={createKey()}>
                          {itemData.iType === BaseItemTypeKind.BaseWeapon && (
                            <Tooltip
                              className="rounded-none bg-transparent"
                              interactive
                              placement="right"
                              content={
                                <BaseWeaponBoxTooltipComponent
                                  item={itemData}
                                />
                              }
                            >
                              <div className="flex flex-col border border-gray-300 cursor-pointer">
                                <div className="flex items-center justify-center border-b bg-gray-200 min-w-[60px] min-h-[60px]">
                                  <img
                                    className="p-[4px] w-[42px] h-[42px]"
                                    src={toAPIHostURL(item.thumbnail)}
                                  />
                                </div>
                                <div className="mt-[2px] flex flex-col gap-[2px] min-h-[65px]">
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    {item.name}
                                  </div>
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    {translate(item.weaponType)}
                                  </div>
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    iLv{item.iLevel}
                                  </div>
                                  <div className="text-center text-[10px]">
                                    <div className="flex items-center justify-center">
                                      <img
                                        className="w-[10px] mb-[1px]"
                                        src="/images/star_on.png"
                                      />
                                      <div className="ff-ba text-[12px]">
                                        x{item.maxStarForce}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center text-[10px]">
                                    {((1 / (itemData.roll || 0)) * 100).toFixed(
                                      2,
                                    )}
                                    %
                                  </div>
                                </div>
                              </div>
                            </Tooltip>
                          )}

                          {itemData.iType === BaseItemTypeKind.BaseMisc && (
                            <Tooltip
                              className="rounded-none bg-transparent"
                              interactive
                              placement="right"
                              content={
                                <BaseMiscBoxTooltipComponent item={itemData} />
                              }
                            >
                              <div className="flex flex-col border border-gray-300 cursor-pointer">
                                <div className="flex items-center justify-center border-b bg-gray-200 min-w-[60px] min-h-[60px]">
                                  <img
                                    className="p-[4px] w-[42px] h-[42px]"
                                    src={toAPIHostURL(item.thumbnail)}
                                  />
                                </div>
                                <div className="mt-[2px] flex flex-col gap-[2px] min-h-[65px]">
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    {translate(item.category)}
                                  </div>
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    iLv{item.iLevel}
                                  </div>
                                  <div className="text-center text-[10px] mt-auto">
                                    {((1 / (itemData.roll || 0)) * 100).toFixed(
                                      2,
                                    )}
                                    %
                                  </div>
                                </div>
                              </div>
                            </Tooltip>
                          )}

                          {itemData.iType ===
                            BaseItemTypeKind.BaseDefenceGear && (
                            <Tooltip
                              className="rounded-none bg-transparent"
                              interactive
                              placement="right"
                              content={
                                <BaseDefenceGearBoxTooltipComponent
                                  item={itemData}
                                />
                              }
                            >
                              <div className="flex flex-col border border-gray-300 cursor-pointer">
                                <div className="flex items-center justify-center border-b bg-gray-200 min-w-[60px] min-h-[60px]">
                                  <img
                                    className="p-[4px] w-[42px] h-[42px]"
                                    src={toAPIHostURL(item.thumbnail)}
                                  />
                                </div>
                                <div className="mt-[2px] flex flex-col gap-[2px] min-h-[65px]">
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    {item.name}
                                  </div>
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    {translate(item.gearType)}
                                  </div>
                                  <div className="ff-ba ff-skew text-center text-[10px]">
                                    iLv{item.iLevel}
                                  </div>
                                  <div className="text-center text-[10px]">
                                    <div className="flex items-center justify-center">
                                      <img
                                        className="w-[10px] mb-[1px]"
                                        src="/images/star_on.png"
                                      />
                                      <div className="ff-ba text-[12px]">
                                        x{item.maxStarForce}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center text-[10px] mt-auto">
                                    {((1 / (itemData.roll || 0)) * 100).toFixed(
                                      2,
                                    )}
                                    %
                                  </div>
                                </div>
                              </div>
                            </Tooltip>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {/* ItemList End */}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
