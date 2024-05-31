import { Card, Chip } from '@material-tailwind/react'
import { useMemo, useRef, useState } from 'react'
import _ from 'lodash'
import Swal from 'sweetalert2'
import { fetchBattle } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { Character } from '@/interfaces/user.interface'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { formatNumber, translate } from '@/services/util'
import { DropResultComponent } from '@/components/battle/drop-result.component'
import { MapSelectComponent } from '@/components/battle/map-select-popover.component'
import {
  BattlePreferenceRef,
  DropSoundKind,
} from '@/components/battle/battle.interface'
import BattlePreference from './battle-preference'
import { ItemTypeKind } from '@/interfaces/item.interface'

export function Battle({ headCss, battleHandler, refreshInventory }: any) {
  const [battleResult, setBattleResult]: any = useState()
  const [battleLogs, setBattleLogs]: any = useState([])
  const [character, setCharacter] = useState<Character>()
  const battleScrollDivRef = useRef<HTMLDivElement>(null)
  const battlePreferenceRef = useRef<BattlePreferenceRef>()
  const [battleError, setBattleError] = useState<any>()

  const activateBattle = async (mapName: string) => {
    setBattleResult(null)
    setBattleError(null)
    try {
      const result = await fetchBattle(mapName)
      if ((result?.drops?.length || 0) > 0) {
        refreshInventory()
        const types = _.uniq(result.drops!.map((item) => item.iType))
        types.forEach((type) => {
          switch (type) {
            case ItemTypeKind.Weapon:
              battlePreferenceRef.current?.play(DropSoundKind.Weapon)
              break
            case ItemTypeKind.Misc:
              battlePreferenceRef.current?.play(DropSoundKind.Etc)
              break
            default:
              break
          }
        })
      }
      setBattleResult(result)
      setBattleLogs(result.battleLogs)
      setCharacter(result.character)

      if (result.isWin) {
        await battleHandler.refreshCharacterComponent()
      }
    } catch (error: any) {
      const { response } = error
      const { status, data } = response || {}
      if ([429, 600].includes(status)) {
        setBattleError({ status, message: data?.message })
        return
      }
      if ([601].includes(status)) {
        Swal.fire({
          title: error.message || '동일 아이피 에러',
          icon: 'error',
          confirmButtonText: '확인',
        })
        throw error
      }
    }
  }

  const audio = useMemo(() => new Audio('/audio/item_drop.mp3'), [])

  const playDropSound = () => {
    audio.volume = 0.1
    audio.play()
  }

  const onAnimationEnd = () => {
    battleScrollDivRef.current?.scrollTo(0, 9999999999999)
  }

  return (
    <Card className={headCss}>
      <div className="mb-[5px] px-[24px] pt-[20px] flex gap-[10px] items-center">
        <MapSelectComponent activateBattle={activateBattle} />
        <BattlePreference ref={battlePreferenceRef} />
      </div>
      {/* 전투로그 */}
      <div
        className="px-[24px] overflow-y-scroll max-h-[350px] h-[350px]"
        ref={battleScrollDivRef}
      >
        {battleError && (
          <div className="h-[300px] flex flex-col items-center justify-center text-[40px] gap-[20px] border border-blue-500 border-dashed bg-blue-100/30 rounded-lg">
            <i className="text-[80px]  text-red-500 fa-solid fa-circle-exclamation" />
            <div>
              <div>
                전투 요청이 너무 많거나 빨라서 스킵됨({battleError?.status})
              </div>
              <div className="text-[16px] text-center">
                전투는 5초에 1번 이뤄져야 합니다.
              </div>
              <div className="text-[16px] text-center">
                인터넷 통신에 문제가 있는 경우 요청을 뭉쳐서 보내기 때문에 이런
                경우에도 나타날 수 있습니다.
              </div>
              {battleError.message && (
                <div className="text-[14px] text-center text-red-500">
                  {battleError.message}
                </div>
              )}
            </div>
          </div>
        )}
        {battleResult && battleResult.monster && (
          <div className="mb-[10px]">
            <div className="w-[400px] flex items-center gap-[4px] text-sm ff-gs text-white text-[16px] pl-1 bg-gradient-to-r from-blue-gray-700 to-ruliweb/0 rounded-t">
              <div className="ff-gs p-[4px]">전투일시</div>
              <div>
                {new Date(battleResult.battledAt).toLocaleDateString()}{' '}
                {new Date(battleResult.battledAt).toLocaleTimeString()}
              </div>
            </div>
            {/* BattleLog Header Start */}
            <div className="w-full items-center gap-[50px] flex justify-center border-dotted border p-[4px] border-gray-700 mb-[10px] rounded">
              <div className="w-[350px] flex items-center gap-[4px] p-[10px] rounded border border-gray-300">
                <div className="min-w-[100px] min-h-[100px] w-[100px] h-[100px] rounded overflow-hidden border border-gray-300 p-[2px] overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${character?.thumbnail || DEFAULT_THUMBNAIL_URL}')`,
                    }}
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
                        width: `${(battleResult.battleLogs[battleResult.battleLogs.length - 1].player.currentMp / battleResult.battleLogs[0].player.maxMp) * 100}%`,
                      }}
                    />
                    <div className="bg-[#a5a8df] rounded min-h-[20px]" />
                    <div className="w-full absolute z-0 left-0 top-0 min-h-[20px] flex justify-center items-center text-white">
                      {
                        battleResult.battleLogs[
                          battleResult.battleLogs.length - 1
                        ].player.currentMp
                      }{' '}
                      / {battleResult.battleLogs[0].player.maxMp}
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
                <DropResultComponent battleResult={battleResult} />
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
