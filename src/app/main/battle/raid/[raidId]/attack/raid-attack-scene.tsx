'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@material-tailwind/react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame'
import { FightScene } from '@/game/scenes/interfaces/scene.interface'
import {
  fetchAttackByLastDailyRankLog,
  fetchGetDailyRankLog,
} from '@/services/api-fetch'
import { GetMapResponse } from '@/interfaces/map.interface'
import { PendingTotalDamageBox } from '@/app/main/battle/v2/pending-data.component'
import { EventBus } from '@/game/EventBus'
import { GameConfig, GameEvent } from '@/game/scenes/enums/enum'
import { formatNumber } from '@/services/util'
import {
  fetchGetCharacterRaid,
  fetchRaidDetail,
  fetchUpdateRaidAttackLog,
} from '@/services/api/api.raid'
import {
  CharacterRaid,
  GameDamageTotalResult,
  Raid,
} from '@/interfaces/raid.interface'
import { fetchGetMapByRaidId } from '@/services/api/api.map'
import { RaidAttackResultComponent } from '@/app/main/battle/raid/[raidId]/attack/raid-attack-result.component'
import { createRankDataPacket } from '@/game/util'

export default function GameSceneComponent() {
  const router = useRouter()
  const params = useParams<{ raidId: string }>()
  const [canMoveSprite, setCanMoveSprite] = useState(true)
  const [scene, setScene] = useState<Phaser.Scene | FightScene>()

  const phaserRef = useRef<IRefPhaserGame | null>(null)
  const [resultOfMap, setResultOfMap] = useState<GetMapResponse>()
  const [totalResult, setTotalResult] = useState<GameDamageTotalResult>()
  const [raid, setRaid] = useState<Raid>()
  const [isEndedRaid, setIsEndedRaid] = useState<boolean>(false)

  const [characterRaid, setCharacterRaid] = useState<CharacterRaid>()

  const [damaged, setDamaged] = useState(0)

  const loadRaid = useCallback(async (raidId: string) => {
    const result = await fetchRaidDetail(raidId)
    const [raidMonster] = result.raid.monsters
    const { monster } = raidMonster || {}
    setRaid(result.raid)
  }, [])

  const currentScene = (_scene: Phaser.Scene) => {
    const sceneKey = _scene?.scene?.key
    setCanMoveSprite(_scene?.scene?.key !== 'MainMenu')
  }

  const injectMapToScene = useCallback(
    async (mapId: string) => {
      if (!raid) return
      if (!scene) return
      const result = await fetchGetMapByRaidId(mapId)
      const customScene = scene as Phaser.Scene & any
      customScene.resultOfMap = result
      customScene.resultOfRaid = { raid }
      setResultOfMap(result)
      if (scene.scene.key === 'Game') {
        customScene.loadMapResource()
      }

      if (scene.scene.key === 'MainMenu') {
        customScene.onCreateAfter()
      }
    },
    [raid, scene],
  )

  const updateRankData = useCallback(async () => {
    if (!totalResult) return
    const fightScene = scene as FightScene
    if (!raid) return
    await fetchUpdateRaidAttackLog(
      raid._id!,
      createRankDataPacket({
        ...totalResult,
        activeSkill: fightScene.resultOfMe.stat.characterSkill.activeSkill,
      }),
    )
    // await fetchUpdateRankData(
    //   createRankDataPacket({
    //     ...totalResult,
    //     activeSkill: fightScene.resultOfMe.stat.characterSkill.activeSkill,
    //   }),
    // )
  }, [raid, scene, totalResult])

  const loadCharacterRaid = useCallback(async () => {
    const result = await fetchGetCharacterRaid()
    setCharacterRaid(result.characterRaid)
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
    if (!params?.raidId) return
    loadRaid(params.raidId)
    // loadMaps()
  }, [loadRaid, params])

  useEffect(() => {
    if (!raid) return
    injectMapToScene(raid.map._id!)
  }, [injectMapToScene, raid])

  useEffect(() => {
    if (!totalResult) return
    updateRankData()
  }, [totalResult, updateRankData])

  useEffect(() => {
    ;[
      GameEvent.MonsterDead,
      GameEvent.OnDamagedMonster,
      GameEvent.PlayerDead,
      GameEvent.OnGameStop,
      GameEvent.OnEndRaid,
    ].forEach((event: GameEvent) => {
      EventBus.on(event, (data: any) => {
        setDamaged(0)
        setTimeout(() => {
          setDamaged((scene as FightScene).player.queue.damaged)
          if (event === GameEvent.OnEndRaid || event === GameEvent.OnGameStop) {
            setIsEndedRaid(true)
            setDamaged((scene as FightScene).player.queue.damaged)
            setTotalResult({
              damaged: (scene as FightScene).player.queue.damaged,
              elapsed: (scene as FightScene).elapsedTime,
              maxElapsed: GameConfig.RAID_PRESERVE_TIME,
            })
          }
        }, 1)
      })
    })

    return () => {
      EventBus.removeListener(GameEvent.MonsterDead)
      EventBus.removeListener(GameEvent.OnDamagedMonster)
      EventBus.removeListener(GameEvent.PlayerDead)
      EventBus.removeListener(GameEvent.OnGameStop)
      EventBus.removeListener(GameEvent.OnEndRaid)
    }
  }, [damaged, scene])

  useEffect(() => {
    loadCharacterRaid()
  }, [loadCharacterRaid])

  return (
    <div className="flex flex-col gap-[4px]">
      {raid && (
        <Card className="p-[10px] gap-[4px] ff-score-all font-bold">
          <div className="flex items-center justify-start gap-[4px]">
            <div className="text-white border bg-gray-800 p-[4px] rounded">
              {raid.map.name}
            </div>
            <div>{raid.map && <div>지역 레벨 : {raid.map.level}</div>}</div>
          </div>
          <div className="flex items-center gap-[4px]">
            <i className="fa-solid fa-circle text-[3px]" />
            해당 전투는 {GameConfig.RAID_PRESERVE_TIME / 1000}초 동안의 피해량의
            평균값을 이용하여 통계처리 합니다.
          </div>
          <div className="flex items-center gap-[4px]">
            <i className="fa-solid fa-circle text-[3px]" />
            최초 한번 참여하면 전투 내역을 저장하고, 이후에는 기록 공격이
            가능합니다.
          </div>
          <hr />
          <div className="flex flex-col items-start justify-center gap-[4px]">
            <div className="border border-blue-950 flex justify-start p-[4px] items-center ff-score font-bold">
              레이드 공격 로그
            </div>
            {characterRaid?.logs[raid.mapId] && (
              <div className="flex items-stretch justify-start gap-[4px]">
                <div className="border bg-green-600 text-white p-[4px] ff-score font-bold">
                  저장된 피해량 :{' '}
                  {formatNumber(characterRaid?.logs[raid.mapId].damage)}
                </div>
                {/* <div
                  className="flex items-center bg-gray-800 text-white p-[4px] cursor-pointer"
                  onClick={() => attackByLastDailyLog()}
                >
                  기존 기록으로 공격하기
                </div> */}
              </div>
            )}
          </div>
        </Card>
      )}
      <div className="flex ff-score-all font-bold">
        {raid && isEndedRaid && totalResult && (
          <RaidAttackResultComponent
            raid={raid}
            totalResult={totalResult}
            activeSkill={(scene as any).resultOfMe.stat.activeSkill}
          />
        )}
        <div className={`${isEndedRaid ? 'hidden' : 'flex'}`}>
          <PhaserGame
            ref={phaserRef}
            currentActiveScene={currentScene}
            setScene={setScene}
          />
        </div>
        {scene?.scene.key === 'Game' && !isEndedRaid && (
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
