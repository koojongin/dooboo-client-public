'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Tooltip } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame'
import { MainMenu } from '@/game/scenes/MainMenu'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import {
  fetchGetMapsName,
  fetchGetMyInventory,
  fetchMe,
} from '@/services/api-fetch'
import {
  BaseItemTypeKind,
  InventoryResponse,
} from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import { InventoryActionKind } from '@/components/item/item.interface'
import ItemBoxComponent from '@/components/item/item-box'
import { EventBus } from '@/game/EventBus'
import { DbMap, GetMapResponse } from '@/interfaces/map.interface'
import { MapSelectPopoverComponent } from '@/components/battle/map-select-popover.component'
import { fetchGetMap } from '@/services/api-admin-fetch'
import { DropTableItem } from '@/interfaces/drop-table.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { BaseWeaponBoxTooltipComponent } from '@/app/main/collection/maps/base-weapon-box-tooltip.component'
import { BaseMiscBoxTooltipComponent } from '@/app/main/collection/maps/base-misc-box-tooltip.component'
import { DataQueue } from '@/game/scenes/objects/GamePlayer'
import { GameConfig, GameEvent } from '@/game/scenes/enums/enum'
import { formatNumber } from '@/services/util'
import { PendingEarnedBox } from '@/app/main/battle/v2/pending-data.component'
import { MeResponse } from '@/interfaces/user.interface'

export default function GameSceneComponent() {
  const router = useRouter()
  const [canMoveSprite, setCanMoveSprite] = useState(true)
  const [scene, setScene] = useState<Phaser.Scene | FightScene>()

  const phaserRef = useRef<IRefPhaserGame | null>(null)
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 })

  const [inventoryRes, setInventoryRes] = useState<InventoryResponse>()
  const [maps, setMaps] = useState<DbMap[]>([])
  const [selectedMapName, setSelectedMapName] = useState<string>()
  const [selectedMap, setSelectedMap] = useState<DbMap>()
  const [resultOfMap, setResultOfMap] = useState<GetMapResponse>()
  const [meResponse, setMeResponse] = useState<MeResponse>()
  const [pendingData, setPendingData] = useState<
    DataQueue & { damaged: number }
  >()

  const changeScene = () => {
    if (phaserRef.current) {
      const currentScene = phaserRef.current.scene as MainMenu

      if (currentScene) {
        currentScene.changeScene()
      }
    }
  }

  const loadInventory = useCallback(async () => {
    const [result] = await Promise.all([fetchGetMyInventory()])
    setInventoryRes(result)

    if (scene?.scene.key === 'Game') {
      const fightScene = scene as FightScene
      fightScene.isFulledInventory = result.isFulled
    }
  }, [scene])

  const loadMaps = useCallback(async () => {
    const { maps: rMaps } = await fetchGetMapsName()
    setMaps(rMaps.filter((map) => map.name !== '허수아비'))
  }, [])

  const currentScene = (_scene: Phaser.Scene) => {
    setCanMoveSprite(_scene?.scene?.key !== 'MainMenu')
  }

  const injectMapToScene = useCallback(
    async (mapId: string) => {
      const result = await fetchGetMap(mapId)
      if (!scene) return

      const customScene = scene as FightScene
      customScene.resultOfMap = result
      setResultOfMap(result)
      if (scene.scene.key === 'Game') {
        customScene.loadMapResource()
      }
    },
    [scene],
  )

  const goToRoute = (path: string) => {
    router.push(path)
  }

  const loadMe = useCallback(async () => {
    const result = await fetchMe()
    setMeResponse(result)
  }, [])

  useEffect(() => {
    if (scene?.scene.key === 'Game') {
      loadInventory()
    }
  }, [loadInventory, scene])

  useEffect(() => {
    loadMaps()
    loadMe()
  }, [loadMaps, loadMe])

  useEffect(() => {
    EventBus.on('event', (data: any) => {
      const { eventName } = data
      if (eventName === 'refresh') {
        loadInventory()
      }
    })
    return () => {
      EventBus.removeListener('event')
    }
  }, [loadInventory])

  useEffect(() => {
    EventBus.on(GameEvent.MonsterDead, (data: any) => {
      setPendingData(undefined)
      setTimeout(() => {
        setPendingData({ ...(scene as FightScene).player.queue })
      }, 1)
    })

    EventBus.on(GameEvent.OnDamagedMonster, (data: any) => {
      setPendingData(undefined)
      setTimeout(() => {
        setPendingData({ ...(scene as FightScene).player.queue })
      }, 1)
    })

    EventBus.on(GameEvent.PlayerDead, (data: any) => {
      setPendingData(undefined)
      setTimeout(() => {
        setPendingData({ ...(scene as FightScene).player.queue })
      }, 1)
    })

    return () => {
      EventBus.removeListener(GameEvent.MonsterDead)
      EventBus.removeListener(GameEvent.OnDamagedMonster)
      EventBus.removeListener(GameEvent.PlayerDead)
    }
  }, [pendingData, scene])

  useEffect(() => {
    if (!selectedMapName) return
    const map = maps.find((_map: any) => _map.name === selectedMapName)
    if (map) {
      injectMapToScene(map._id!)
      setSelectedMap(map)
    }
  }, [injectMapToScene, maps, selectedMapName])

  return (
    <div className="flex flex-col gap-[4px]">
      <Card className="p-[10px]">
        {meResponse && (
          <div>
            {!meResponse.stat.characterSkill && (
              <div className="text-red-500 text-[20px] ff-score ">
                <div>
                  선택된 캐릭터 스킬이 없습니다. 전직을 먼저 진행해주세요
                </div>
                <div
                  className="inline-flex ff-score font-bold bg-green-500 text-white cursor-pointer rounded p-[10px]"
                  onClick={() => goToRoute('/main/skill')}
                >
                  전직 페이지로 이동하기
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="w-[200px] bg-white">
            {scene?.scene?.key !== 'Game' &&
              !!meResponse?.stat.characterSkill && (
                <MapSelectPopoverComponent
                  maps={maps}
                  selectedMap={selectedMapName}
                  setSelectedMap={setSelectedMapName}
                />
              )}
            {selectedMap && (
              <div className="flex items-center gap-[4px]">
                <div>{selectedMap.name}</div>
                <div>지역 레벨 : {selectedMap.level}</div>
              </div>
            )}
          </div>
          <Link
            target="_blank"
            href="/main/community/detail/6683e307c9638e8b6885783c"
          >
            <div className="bg-blue-800 p-[4px] cursor-pointer ff-score font-bold text-white">
              윈도우 클라이언트 다운로드
            </div>
          </Link>
        </div>
      </Card>
      <div className="flex">
        <PhaserGame
          ref={phaserRef}
          currentActiveScene={currentScene}
          setScene={setScene}
        />
        <div>
          {scene?.scene.key === 'Game' && (
            <PendingEarnedBox
              pendingData={pendingData}
              scene={scene as FightScene}
              inventoryRes={inventoryRes}
            />
          )}
        </div>
      </div>
      <Card className="p-[10px] rounded">
        <div className="ff-score font-bold">
          <div>인벤토리</div>
          {inventoryRes && inventoryRes.isFulled && (
            <div className="text-red-400 text-[14px]">
              * 인벤토리가 가득 찼습니다. 아이템을 더이상 획득할 수 없습니다.{' '}
              <span
                className="underline text-[20px] cursor-pointer"
                onClick={() => goToRoute('/main/inn/stash')}
              >
                여관
              </span>
              으로 이동해 아이템을 정리하세요
            </div>
          )}
        </div>
        <div className="flex gap-[2px]">
          {inventoryRes &&
            new Array(20).fill(1).map((value, index) => {
              const item = inventoryRes.items[index]
              return (
                <div
                  key={`main_inventory_${item?._id || createKey()}`}
                  className="relative flex border border-r rounded-md w-[50px] h-[50px]"
                >
                  {item && (
                    <ItemBoxComponent
                      actionCallback={loadInventory}
                      className="p-[2px]"
                      item={item}
                      key={`shop_inventory_${item?._id || createKey()}_box`}
                      actions={[
                        InventoryActionKind.Consume,
                        InventoryActionKind.AddToAuction,
                        InventoryActionKind.Share,
                      ]}
                    />
                  )}
                </div>
              )
            })}
        </div>
      </Card>
    </div>
  )
}
