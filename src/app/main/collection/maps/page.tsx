'use client'

import { useEffect, useState } from 'react'
import { Card, Tooltip } from '@material-tailwind/react'
import _ from 'lodash'
import { fetchGetMap, fetchGetMapsName } from '@/services/api-fetch'
import { DbMap } from '@/interfaces/map.interface'
import toAPIHostURL from '@/services/image-name-parser'
import createKey from '@/services/key-generator'
import { DropTableItem } from '@/interfaces/drop-table.interface'
import { Monster } from '@/interfaces/monster.interface'
import { translate } from '@/services/util'
import { BaseItemTypeKind, ItemTypeKind } from '@/interfaces/item.interface'
import { BaseMiscBoxTooltipComponent } from './base-misc-box-tooltip.component'
import { BaseWeaponBoxTooltipComponent } from './base-weapon-box-tooltip.component'

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

    const sorted = {
      ...rMap,
      monsters: _.sortBy(
        rMonsters.map((monster) => {
          if (!monster.drop) return monster
          if ((monster.drop?.items?.length || 0) > 0) {
            const newMonster = { ...monster }
            newMonster.drop!.items = _.sortBy(newMonster.drop!.items, 'roll')
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
            <div className="bg-gradient-to-r from-blue-gray-600/90 to-blue-gray-100/0 w-[800px] text-white px-[10px] py-[10px] text-[30px] flex items-center ff-gs-all">
              <div className="">
                {selectedMap.name}({selectedMap.level})
              </div>
            </div>
            {/* <div className="flex bg-indigo-400 text-white py-[8px]"> */}
            <div className="mt-[10px] flex bg-gradient-to-r from-indigo-600/90 to-blue-gray-100/0 w-[800px] text-white px-[10px] py-[0px] ff-gs-all">
              <div className="min-w-[200px]">
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
                  <div className="flex gap-[1px] flex-col justify-center items-start w-[200px]">
                    <div className="flex gap-[10px] justify-center items-center">
                      <img
                        src={toAPIHostURL(monster.thumbnail)}
                        className="w-[80px] h-[80px]"
                      />
                      <div className="min-w-[100px]">
                        <div>{monster.name}</div>
                        <div className="text-[10px]">
                          {(
                            (monster.weight / selectedMap.totalWeight) *
                            100
                          ).toFixed(2)}
                          %({monster.weight})
                        </div>
                        <div className="text-[10px] text-green-400">
                          +{monster.experience.toLocaleString()}exp, +
                          {monster.gold.toLocaleString()}g
                        </div>
                        <div className="text-[10px] text-red-300">
                          {monster.hp.toLocaleString()}hp
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* MonsterDiv End */}

                  {/* ItemList Start */}
                  <div className="flex gap-[5px] items-center">
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
                                <img
                                  className="border-b bg-gray-200 p-[4px] w-[42px] h-[42px]"
                                  src={toAPIHostURL(item.thumbnail)}
                                />
                                <div className="mt-[2px] flex flex-col gap-[2px]">
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
                                <img
                                  className="border-b bg-gray-200 p-[4px] w-[42px] h-[42px]"
                                  src={toAPIHostURL(item.thumbnail)}
                                />
                                <div className="mt-[2px] flex flex-col gap-[2px] min-h-[51px]">
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
