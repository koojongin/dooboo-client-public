import { Button, Card, Chip, Option, Select } from '@material-tailwind/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import createKey from '@/services/key-generator'
import { fetchBattle, fetchGetMapsName } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { DbMap } from '@/interfaces/map.interface'
import { Item } from '@/interfaces/item.interface'
import { Character } from '@/interfaces/user.interface'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { formatNumber, translate } from '@/services/util'
import ItemBoxComponent from '../item/item-box'

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
  const [character, setCharacter] = useState<Character>()
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
    setCharacter(result.character)

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
                    {map.name}(Lv.{map.level})
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
          <div className="mb-[10px]">
            <div className="w-[300px] flex gap-1 text-sm ">
              <div>전투일시</div>
              <div>
                {new Date(battleResult.battledAt).toLocaleDateString()}{' '}
                {new Date(battleResult.battledAt).toLocaleTimeString()}
              </div>
            </div>
            {/* BattleLog Header Start */}
            <div className="w-full items-center gap-[50px] flex justify-center border-dotted border p-[4px] border-gray-700 mb-[10px] rounded">
              <div className="w-[350px] flex items-center gap-[4px] p-[10px] rounded border border-gray-300">
                <div className="min-w-[100px] min-h-[100px] w-[100px] h-[100px] rounded overflow-hidden border border-gray-300">
                  <img
                    src={
                      toAPIHostURL(character?.thumbnail) ||
                      DEFAULT_THUMBNAIL_URL
                    }
                    className="w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-[2px] w-full text-[20px]">
                  <div className="rounded bg-[#7f92a1] text-white px-4 py-0.5 ff-wavve w-full flex justify-center items-center border border-dotted">
                    {character?.nickname}
                  </div>
                  <div className="text-[12px] relative rounded overflow-hidden">
                    <div
                      className="absolute left-0 top-0 z-0 min-h-full bg-red-300 flex justify-center min-h-[20px] text-white"
                      style={{
                        width: `${
                          (battleResult.character.hp /
                            battleResult.character.hp) *
                          100
                        }%`,
                      }}
                    />
                    <div className="bg-[#ffbdbd] rounded min-h-[20px]" />
                    <div className="w-full absolute z-0 left-0 top-0 min-h-[20px] flex justify-center items-center text-white">
                      {battleResult.character.hp} / {battleResult.character.hp}
                    </div>
                  </div>
                  <div className="text-[12px] relative rounded overflow-hidden">
                    <div
                      className="absolute left-0 top-0 z-0 min-h-full bg-blue-600 flex justify-center min-h-[20px] text-white"
                      style={{
                        width: `${(battleResult.battleLogs[battleResult.battleLogs.length - 1].player.currentMp / battleResult.character.mp) * 100}%`,
                      }}
                    />
                    <div className="bg-[#a5a8df] rounded min-h-[20px]" />
                    <div className="w-full absolute z-0 left-0 top-0 min-h-[20px] flex justify-center items-center text-white">
                      {
                        battleResult.battleLogs[
                          battleResult.battleLogs.length - 1
                        ].player.currentMp
                      }{' '}
                      / {battleResult.character.mp}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[150px] min-w-[150px] bg-[url('/images/versus.png')] bg-contain bg-no-repeat bg-center min-h-[150px] h-[150px]">
                {/* <img src="/images/versus.png" /> */}
              </div>
              {/* Monster Box Start */}
              <div className="w-[350px] flex items-center gap-[4px] p-[10px] rounded border border-gray-300">
                <div className="min-w-[100px] min-h-[100px] w-[100px] h-[100px] rounded overflow-hidden border border-gray-300">
                  <img
                    src={toAPIHostURL(battleResult.monster.thumbnail)}
                    className="w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-[2px] w-full">
                  <div className="flex items-center text-[20px] gap-1">
                    <div className="rounded bg-[#7f92a1] text-white px-4 py-0.5 ff-wavve w-full flex justify-center items-center border border-dotted">
                      {battleResult.monster.name}
                    </div>
                  </div>
                  <div className="text-[12px] relative rounded overflow-hidden">
                    <div
                      className="absolute left-0 top-0 z-0 min-h-full bg-red-300 flex justify-center min-h-[20px] text-white"
                      style={{
                        width: `${
                          (battleLogs[battleLogs.length - 1].currentHp /
                            battleResult.monster.hp) *
                          100
                        }%`,
                      }}
                    />
                    <div className="bg-[#ffbdbd] rounded min-h-[20px]" />
                    <div className="w-full absolute z-0 left-0 top-0 min-h-[20px] flex justify-center items-center text-white">
                      {formatNumber(
                        battleLogs[battleLogs.length - 1].currentHp,
                      )}{' '}
                      / {formatNumber(battleResult.monster.hp)}
                    </div>
                  </div>
                </div>
              </div>
              {/* Monster Box End */}
            </div>
            {/* BattleLog Header End */}

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
                    <div className="flex items-center gap-[4px]">
                      {/* TAGS-----------*/}
                      {battleLog.skills?.length > 0 && (
                        <div className="ff-wavve rounded-[4px] bg-blue-gray-500 text-white text-[16px] py-[2px] px-[8px] flex items-center justify-center">
                          {translate(battleLog.skills[0])}
                        </div>
                      )}
                      {battleLog.isCriticalHit && (
                        <div className="ff-wavve rounded-[4px] bg-yellow-500 text-red-700 text-[18px] py-[2px] px-[8px] flex items-center justify-center">
                          치명타!
                        </div>
                      )}
                      {/* TAGS END----------*/}
                      <div className="bg-light-blue-300 ff-ba text-[20px] px-[6px] py-[1px] text-white rounded">
                        {formatNumber(battleLog.damage)}
                      </div>
                      <div>의 피해를 입혔습니다.</div>
                    </div>
                    <div className="ml-auto">
                      남은 체력:{formatNumber(battleLog.currentHp)}
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
