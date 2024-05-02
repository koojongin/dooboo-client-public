import { Button, Card, Chip, Option, Select } from '@material-tailwind/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import createKey from '@/services/key-generator'
import { fetchBattle, fetchGetMapsName } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { DbMap } from '@/interfaces/map.interface'
import { ItemBoxComponent } from '@/app/main/inventory.component'
import { Item } from '@/interfaces/item.interface'

export default (function Battle({
  headCss,
  battleHandler,
  refreshInventory,
}: any) {
  const [maps, setMaps] = useState<DbMap[]>([])
  const [selectedMap, setSelectedMap] = useState<string>()
  const [battleResult, setBattleResult]: any = useState()
  const [battleLogs, setBattleLogs]: any = useState([])
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const battleScrollDivRef = useRef<HTMLDivElement>(null)

  const onChangeMap = (mapName: string | undefined) => {
    if (!mapName) return
    setSelectedMap(mapName)
  }
  const activateBattle = async (mapName: string) => {
    setBattleResult(null)
    if (!maps!.map((d) => d.name)!.includes(mapName)) {
      stopBattleInterval()
      return Swal.fire({
        title: '사냥터를 선택해주세요',
        text: '문제가 계속되면 관리자에게 문의해주세요',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }

    setIsAutoRunning(true)
    const result = await fetchBattle(mapName)
    if ((result?.drops?.length || 0) > 0) {
      refreshInventory()
      playDropSound()
    }
    setBattleResult(result)
    setBattleLogs(result.battleLogs)

    if (result.isWin) {
      await battleHandler.refreshCharacterComponent()
    }
  }

  const startBattleInterval = (mapName: string) => {
    if (!timerRef.current) {
      timerRef.current = setInterval(async () => {
        try {
          await activateBattle(mapName)
        } catch (error: any) {
          stopBattleInterval()
        }
      }, 5000)
    }
  }

  const audio = new Audio('/audio/item_drop.mp3')
  const audioEndOfBattle = new Audio('/audio/end_of_battle.mp3')

  const stopBattleInterval = useCallback(() => {
    setIsAutoRunning(false)
    if (timerRef.current) {
      if (selectedMap && timerRef?.current) {
        audioEndOfBattle.volume = 0.5
        audioEndOfBattle.play()
      }
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
  }, [selectedMap])

  const battle = (mapName: string) => {
    if (!isAutoRunning) {
      setIsAutoRunning(true)
      try {
        startBattleInterval(mapName)
      } catch (error: any) {
        setIsAutoRunning(false)
      }
    } else {
      stopBattleInterval()
    }
  }

  const refreshMaps = useCallback(async () => {
    const { maps: rMaps } = await fetchGetMapsName()
    setMaps(rMaps)
  }, [])

  const playDropSound = () => {
    audio.volume = 0.1
    audio.play()
  }

  const onAnimationEnd = () => {
    console.log('onAnimationEnd')
    battleScrollDivRef.current?.scrollTo(0, 9999999999999)
  }

  useEffect(() => {
    refreshMaps()
    return () => {
      stopBattleInterval()
    }
  }, [refreshMaps, stopBattleInterval])
  return (
    <Card className={headCss}>
      <div className="flex mb-5 px-[24px] pt-[20px]">
        <div className="w-72">
          {maps && maps.length > 0 && (
            <Select
              disabled={isAutoRunning}
              className="rounded-r-none"
              label="선택된 사냥터"
              value={selectedMap}
              onChange={(value) => onChangeMap(value)}
            >
              {maps.map((map) => {
                return (
                  <Option key={createKey()} value={map.name}>
                    {map.name}
                  </Option>
                )
              })}
            </Select>
          )}
        </div>
        <Button
          className="rounded-l-none"
          color={!isAutoRunning ? 'indigo' : 'red'}
          size="sm"
          variant="filled"
          onClick={() => battle(selectedMap!)}
        >
          {isAutoRunning ? '자동사냥중' : '사냥하기'}
        </Button>
      </div>
      {/* 전투로그 */}
      <div
        className="px-[24px] overflow-y-scroll max-h-[350px] h-[350px]"
        ref={battleScrollDivRef}
      >
        {battleResult && battleResult.monster && (
          <div>
            <div className="flex gap-1 text-sm">
              <div>전투일시</div>
              <div>
                {new Date(battleResult.battledAt).toLocaleDateString()}{' '}
                {new Date(battleResult.battledAt).toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center mb-1 gap-1">
              <div>
                <img
                  src={toAPIHostURL(battleResult.monster.thumbnail)}
                  className="max-w-[100px] rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center text-[20px] gap-1">
                  <div className="rounded bg-indigo-400 text-white px-4 py-0.5">
                    {battleResult.monster.name}
                  </div>
                  <div className="">을/를 만났습니다.</div>
                </div>
                <div className="text-[12px]">HP:{battleResult.monster.hp}</div>
              </div>
            </div>
            <div className="text-white text-[16px]">
              {battleLogs.map((battleLog: any, index: any) => {
                return (
                  <div
                    key={`battlelog-${index}`}
                    className="animate-slideIn flex items-center mb-1 gap-1 transition text-black opacity-0"
                    onAnimationEnd={onAnimationEnd}
                    style={
                      { '--delay': `${index * 0.25}s` } as React.CSSProperties
                    }
                  >
                    <Chip
                      variant="gradient"
                      size="sm"
                      className="text-[14px] rounded px-[4px] min-w-[70px] flex items-center justify-center py-[2px]"
                      color={battleLog.isCriticalHit ? 'red' : 'indigo'}
                      value={`${index + 1}Turn`}
                    />
                    <div className="flex items-center gap-1">
                      {battleLog.isCriticalHit && (
                        <Chip size="sm" color="yellow" value="치명타!" />
                      )}
                      <div className="bg-light-blue-300 ff-ba text-[20px] px-[6px] py-[1px] text-white rounded">
                        {battleLog.damage.toFixed(2).toLocaleString()}
                      </div>
                      <div>의 피해를 입혔습니다.</div>
                    </div>
                    <div className="ml-auto">
                      남은 체력:{battleLog.currentHp.toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              className="animate-slideIn transition flex flex-col opacity-0 text-[18px]"
              style={
                {
                  '--delay': `${battleResult.battleLogs.length * 0.25}s`,
                } as React.CSSProperties
              }
            >
              <div className="flex items-end mt-[10px]">
                전투에서
                <span
                  className={`pl-1 font-bold text-[20px] ${battleResult.isWin ? 'text-green-900' : 'text-red-800'}`}
                >
                  {battleResult.isWin ? '승리' : '패배'}
                </span>
                했습니다!
              </div>
              {battleResult.isWin && (
                <div>
                  <div className="flex gap-1">
                    <Chip
                      color="teal"
                      variant="gradient"
                      size="sm"
                      value={`+${battleResult.monster.experience} exp`}
                    />
                    <Chip
                      color="yellow"
                      variant="gradient"
                      size="sm"
                      value={`+${battleResult.monster.gold} Gold`}
                    />
                  </div>
                  {battleResult.drops.length > 0 && (
                    <DropListComponent drops={battleResult.drops} />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
})

function DropListComponent({ drops }: { drops: Item[] }) {
  return (
    <div className="flex flex-col gap-1 mt-10">
      <div className="bg-indigo-400 text-white text-[20px] pl-1">
        획득한 아이템
      </div>
      <div className="flex flex-row gap-1">
        {drops.map((item) => {
          return (
            <ItemBoxComponent
              item={item}
              key={`drops_${item._id}`}
              className="border p-[2px]"
            />
            // <div
            //   key={item._id}
            //   className="w-[40px] h-[40px] border-dark-blue border rounded"
            // >
            //   <img
            //     src={toAPIHostURL(item.thumbnail)}
            //     className="w-full h-full p-[2px]"
            //   />
            // </div>
          )
        })}
      </div>
    </div>
  )
}
