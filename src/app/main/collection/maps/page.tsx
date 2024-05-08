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
                  <div className="flex gap-[1px] items-center">
                    {monster.drop?.items.map((itemData) => {
                      const { item } = itemData
                      return (
                        <div key={createKey()}>
                          <Tooltip
                            className="rounded-none bg-transparent"
                            interactive
                            placement="right"
                            content={
                              <BaseWeaponBoxTooltipComponent item={itemData} />
                            }
                          >
                            <div className="flex flex-col">
                              <img
                                className="border p-[1px] w-[40px] h-[40px]"
                                src={toAPIHostURL(item.thumbnail)}
                              />
                              <div className="text-center text-[10px]">
                                {((1 / (itemData.roll || 0)) * 100).toFixed(2)}%
                              </div>
                            </div>
                          </Tooltip>
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
function BaseWeaponBoxTooltipComponent({ item }: { item: DropTableItem }) {
  const selectedItem = item.item
  return (
    <div className="flex flex-col gap-[2px] bg-white rounded p-[12px] border border-gray-300 text-[#34343a] min-w-[300px] shadow-md drop-shadow-lg">
      <div className="text-[20px]">{selectedItem?.name}</div>
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {translate(selectedItem.weaponType)}(ilv:{selectedItem.iLevel})
        </div>
        <div className="flex items-center justify-center">
          <img
            className="mb-[4px] w-[16px] h-[16px]"
            src="/images/star_on.png"
          />
          <div className="ff-gs flex items-center">
            x{selectedItem.maxStarForce}
          </div>
        </div>
      </div>
      <div className="border-b border-dashed border-dark-blue" />
      <div className="flex flex-col gap-[1px]">
        <div className="flex justify-between">
          <div>물리 피해</div>
          <div>
            {selectedItem.damageOfPhysical[0]} ~{' '}
            {selectedItem.damageOfPhysical[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>냉기 피해</div>
          <div>
            {selectedItem.damageOfCold[0]} ~ {selectedItem.damageOfCold[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>번개 피해</div>
          <div>
            {selectedItem.damageOfLightning[0]} ~{' '}
            {selectedItem.damageOfLightning[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>화염 피해</div>
          <div>
            {selectedItem.damageOfFire[0]} ~ {selectedItem.damageOfFire[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>치명타 확률</div>
          <div>
            {selectedItem.criticalRate[0]} ~ {selectedItem.criticalRate[1]}
          </div>
        </div>
        <div className="flex justify-between">
          <div>치명타 배율</div>
          <div>
            {selectedItem.criticalMultiplier[0]} ~{' '}
            {selectedItem.criticalMultiplier[1]}
          </div>
        </div>
        <div className="border-b border-dashed border-dark-blue" />
        <div className="flex justify-between">
          <div>판매 금액</div>
          <div>{selectedItem.gold.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
