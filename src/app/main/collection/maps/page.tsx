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
    setSelectedMap({
      ...rMap,
      monsters: _.sortBy(rMonsters, 'weight').reverse(),
      totalWeight: rMonsters.reduce((prev, next) => prev + next.weight, 0),
    })
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
          <div className="flex flex-col gap-[1px] mt-[10px]">
            <div className="flex bg-indigo-400 text-white py-[8px]">
              <div className="min-w-[200px] pl-[5px]">
                <div>등장 몬스터</div>
                <div className="text-[14px]">- 등장 확률</div>
                <div className="text-[14px]">- 획득 보상</div>
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
export function BaseWeaponBoxTooltipComponent({
  item,
}: {
  item: DropTableItem
}) {
  const selectedItem = item.item
  return (
    <div className="bg-white rounded p-[12px] border border-gray-300 text-[#34343a] min-w-[300px] shadow-md drop-shadow-lg">
      <div className="border-b border-dashed border-dark-blue mb-[2px] text-[20px]">
        {selectedItem?.name}
      </div>
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
        <div className="flex justify-between">
          <div>판매 금액</div>
          <div>{selectedItem.gold.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
