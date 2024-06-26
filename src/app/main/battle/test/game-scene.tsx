'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, Tooltip } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame'
import { MainMenu } from '@/game/scenes/MainMenu'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import { fetchGetMapsName, fetchGetMyInventory } from '@/services/api-fetch'
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
  const [pendingData, setPendingData] = useState<DataQueue>()

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
    setMaps(rMaps)
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

  const goToInn = () => {
    router.push('/main/inn/stash')
  }

  useEffect(() => {
    if (scene?.scene.key === 'Game') {
      loadInventory()
      // setPendingData((scene as FightScene).player.queue)
    }
  }, [loadInventory, scene])

  useEffect(() => {
    loadMaps()
  }, [loadMaps])

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
        setPendingData((scene as FightScene).player.queue)
      }, 1)
    })
    return () => {
      EventBus.removeListener(GameEvent.MonsterDead)
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
        <div className="w-[200px] bg-white">
          <MapSelectPopoverComponent
            maps={maps}
            selectedMap={selectedMapName}
            setSelectedMap={setSelectedMapName}
          />
        </div>
        {selectedMap && <div>지역 레벨 : {selectedMap.level}</div>}
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
                onClick={() => goToInn()}
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

function PendingEarnedBox({
  pendingData,
  scene,
  inventoryRes,
}: {
  pendingData?: DataQueue
  scene: FightScene
  inventoryRes?: InventoryResponse
}) {
  const { gold = 0, experience = 0, items = [] } = pendingData || {}
  return (
    <Card className="p-[4px] rounded-none ff-score-all font-bold min-w-[140px]">
      <Tooltip
        content={
          <div>
            <div>
              획득 대기 목록은 {GameConfig.QueueResolveTime / 1000}초 주기로
              획득 후 갱신 됩니다.
            </div>
            <div className="text-red-500">
              (주의! 갱신되지 않았을때 페이지 이동시 모든 목록이 손실됩니다.)
            </div>
          </div>
        }
      >
        <div className="flex items-center cursor-pointer gap-[4px]">
          <div>획득 대기</div>
          <div className="flex items-center justify-center bg-gray-800 text-white rounded-full text-[12px] w-[16px] h-[16px]">
            <i className="fa-solid fa-question" />
          </div>
        </div>
      </Tooltip>
      <div>+{gold.toLocaleString()} gold</div>
      <div>+{experience.toLocaleString()} exp</div>
      <div>
        {inventoryRes?.isFulled && (
          <Tooltip content="인벤토리가 가득차면 더 이상 아이템을 획득할 수 없습니다.">
            <div className="text-red-500 flex items-center gap-[4px] cursor-pointer">
              <div>인벤토리 가득참</div>
              <div className="flex items-center justify-center bg-gray-800 text-white rounded-full text-[12px] w-[16px] h-[16px]">
                <i className="fa-solid fa-question" />
              </div>
            </div>
          </Tooltip>
        )}
        {!inventoryRes?.isFulled &&
          items.map((dropItem) => (
            <PendingItem dropItem={dropItem} key={createKey()} />
          ))}
      </div>
    </Card>
  )
}

function PendingItem({ dropItem }: { dropItem: DropTableItem }) {
  const { iType, item } = dropItem
  const { thumbnail } = item
  return (
    <div>
      {iType === BaseItemTypeKind.BaseWeapon && (
        <Tooltip
          className="rounded-none bg-transparent"
          interactive
          placement="right"
          content={<BaseWeaponBoxTooltipComponent item={dropItem} />}
        >
          <div
            className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${toAPIHostURL(thumbnail)}')` }}
          />
        </Tooltip>
      )}

      {iType === BaseItemTypeKind.BaseMisc && (
        <Tooltip
          className="rounded-none bg-transparent"
          interactive
          placement="right"
          content={<BaseMiscBoxTooltipComponent item={dropItem} />}
        >
          <div
            className="w-[40px] h-[40px] bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${toAPIHostURL(thumbnail)}')` }}
          />
        </Tooltip>
      )}
    </div>
  )
}
