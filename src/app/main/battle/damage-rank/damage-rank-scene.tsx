'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import {
  fetchAttackByLastDailyRankLog,
  fetchGetDailyRankLog,
  fetchGetMapsName,
  fetchUpdateRankData,
} from '@/services/api-fetch'
import { DbMap, GetMapResponse } from '@/interfaces/map.interface'
import { fetchGetMap } from '@/services/api-admin-fetch'
import { PendingTotalDamageBox } from '@/app/main/battle/v2/pending-data.component'
import { EventBus } from '@/game/EventBus'
import { GameConfig, GameEvent } from '@/game/scenes/enums/enum'
import { formatNumber } from '@/services/util'
import { createRankDataPacket } from '@/game/util'

export default function GameSceneComponent() {
  const router = useRouter()
  const [canMoveSprite, setCanMoveSprite] = useState(true)
  const [scene, setScene] = useState<Phaser.Scene | FightScene>()

  const phaserRef = useRef<IRefPhaserGame | null>(null)
  const [maps, setMaps] = useState<DbMap[]>([])
  const [selectedMapName, setSelectedMapName] = useState<string>()
  const [selectedMap, setSelectedMap] = useState<DbMap>()
  const [resultOfMap, setResultOfMap] = useState<GetMapResponse>()
  const [totalResult, setTotalResult] = useState<{
    damaged: number
    elapsed: number
  }>()

  const [dailyRankLog, setDailyRankLog] = useState<any>()

  const [damaged, setDamaged] = useState(0)

  const loadMaps = useCallback(async () => {
    const result = await fetchGetMapsName()
    const map = result.maps.find((_map: any) => _map.name === '허수아비')
    if (map) {
      setSelectedMapName(map.name)
    }
    setMaps(result.maps)
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

  const updateRankData = useCallback(async () => {
    if (!totalResult) return
    const fightScene = scene as FightScene
    await fetchUpdateRankData(
      createRankDataPacket({
        ...totalResult,
        activeSkill: fightScene.resultOfMe.stat.characterSkill.activeSkill,
      }),
    )
  }, [scene, totalResult])

  const loadDailyRankLogs = useCallback(async () => {
    const result = await fetchGetDailyRankLog()
    setDailyRankLog(result.dailyRankLog)
  }, [])

  const attackByLastDailyLog = useCallback(async () => {
    await fetchAttackByLastDailyRankLog()
    await Swal.fire({
      text: '정상적으로 공격했습니다.',
      icon: 'success',
      confirmButtonText: '확인',
    })
  }, [])

  useEffect(() => {
    loadMaps()
  }, [loadMaps])

  useEffect(() => {
    if (!selectedMapName) return
    const map = maps.find((_map: any) => _map.name === '허수아비')
    if (map) {
      injectMapToScene(map._id!)
      setSelectedMap(map)
    }
  }, [injectMapToScene, maps, selectedMapName])

  useEffect(() => {
    updateRankData()
  }, [totalResult, updateRankData])

  useEffect(() => {
    EventBus.on(GameEvent.MonsterDead, (data: any) => {
      setDamaged(0)
      setTimeout(() => {
        setDamaged((scene as FightScene).player.queue.damaged)
      }, 1)
    })

    EventBus.on(GameEvent.OnDamagedMonster, (data: any) => {
      setDamaged(0)
      setTimeout(() => {
        setDamaged((scene as FightScene).player.queue.damaged)
      }, 1)
    })

    EventBus.on(GameEvent.PlayerDead, (data: any) => {
      setDamaged(0)
      setTimeout(() => {
        setDamaged((scene as FightScene).player.queue.damaged)
      }, 1)
    })

    EventBus.on(GameEvent.OnGameStop, (data: any) => {
      setDamaged((scene as FightScene).player.queue.damaged)
      setTotalResult({
        damaged: (scene as FightScene).player.queue.damaged,
        elapsed: GameConfig.CROW_PRESERVE_TIME,
      })
    })

    return () => {
      EventBus.removeListener(GameEvent.MonsterDead)
      EventBus.removeListener(GameEvent.OnDamagedMonster)
      EventBus.removeListener(GameEvent.PlayerDead)
      EventBus.removeListener(GameEvent.OnGameStop)
    }
  }, [damaged, scene, updateRankData])

  useEffect(() => {
    loadDailyRankLogs()
  }, [loadDailyRankLogs])

  return (
    <div className="flex flex-col gap-[4px]">
      <Card className="p-[10px] gap-[4px] ff-score-all font-bold">
        <div className="flex items-center justify-start gap-[4px]">
          <div className="text-white border bg-gray-800 p-[4px] rounded">
            허수아비
          </div>
          <div>{selectedMap && <div>지역 레벨 : {selectedMap.level}</div>}</div>
        </div>
        <div className="flex items-center gap-[4px]">
          <i className="fa-solid fa-circle text-[3px]" />
          해당 전투는 {GameConfig.CROW_PRESERVE_TIME / 1000}초 동안의 피해량의
          평균값을 이용하여 통계처리 합니다.
        </div>
        <div className="flex items-center gap-[4px]">
          <i className="fa-solid fa-circle text-[3px]" />
          하루 한번 참여하면 전투 내역을 저장하고, 바로 허수아비 타격이
          가능합니다.
        </div>
        <div className="flex items-center gap-[4px]">
          <i className="fa-solid fa-circle text-[3px]" />
          새로고침 시 재도전을 제한없이 시도할 수 있습니다.
        </div>
        <div className="flex flex-col items-start justify-center gap-[4px]">
          <div className="border border-blue-950 flex justify-start p-[4px] items-center ff-score font-bold">
            데일리 허수아비 공격 로그 (매일 오후 11:59에 초기화 됩니다.)
          </div>
          {!dailyRankLog && (
            <div>
              오늘의 허수아비 공격 기록이 없습니다. / 하루에 최소 1번이라도
              도전할 경우 기록이 생성되어 기록 공격이 가능해집니다.
            </div>
          )}
          {dailyRankLog && (
            <div className="flex items-stretch justify-start gap-[4px]">
              <div className="border bg-green-600 text-white p-[4px] ff-score font-bold">
                저장된 피해량 :{' '}
                {formatNumber(dailyRankLog.snapshot.totalDamage)}
              </div>
              <div
                className="flex items-center bg-gray-800 text-white p-[4px] cursor-pointer"
                onClick={() => attackByLastDailyLog()}
              >
                기존 기록으로 공격하기
              </div>
            </div>
          )}
        </div>
      </Card>
      <div className="flex">
        <PhaserGame
          ref={phaserRef}
          currentActiveScene={currentScene}
          setScene={setScene}
        />
        {scene?.scene.key === 'Game' && (
          <div className="flex flex-col gap-[4px]">
            <PendingTotalDamageBox damaged={damaged} />
            {totalResult && (
              <Card className="rounded-none p-[4px]">
                <div>최종 평균 피해량</div>
                <div>
                  {formatNumber(
                    totalResult.damaged / (totalResult.elapsed / 1000),
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
