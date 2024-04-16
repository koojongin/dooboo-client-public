import {
  Button,
  Card,
  CardBody,
  Chip,
  Option,
  Select,
} from '@material-tailwind/react'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import createKey from '@/services/key-generator'
import { fetchBattle, fetchGetMapsName } from '@/services/api-fetch'
import toAPIHostURL from '@/services/image-name-parser'
import { DbMap } from '@/interfaces/map.interface'

export default (function Battle(
  { headCss, battleHandler }: any,
  // battleHandler: ForwardedRef<any>,
) {
  const [maps, setMaps] = useState<DbMap[]>([])
  const [selectedMap, setSelectedMap] = useState<string>()
  const [battleResult, setBattleResult]: any = useState()
  const [battleLogs, setBattleLogs]: any = useState([])
  const onChangeMap = (mapName: string | undefined) => {
    if (!mapName) return
    setSelectedMap(mapName)
  }
  const battle = async (mapName: string) => {
    setBattleResult(null)
    if (!maps!.map((d) => d.name)!.includes(mapName)) {
      return Swal.fire({
        title: '사냥터를 선택해주세요',
        text: '문제가 계속되면 관리자에게 문의해주세요',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }
    const result = await fetchBattle(mapName)
    setBattleResult(result)
    setBattleLogs(result.battleLogs)

    if (result.isWin) {
      battleHandler.refreshCharacterComponent()
    }
  }

  const refreshMaps = async () => {
    const { maps: rMaps } = await fetchGetMapsName()
    setMaps(rMaps)
  }

  useEffect(() => {
    refreshMaps()
  }, [])

  return (
    <Card className={headCss}>
      <CardBody>
        <div className="flex mb-5">
          <div className="w-72">
            {maps && maps.length > 0 && (
              <Select
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
            color="indigo"
            size="sm"
            variant="filled"
            onClick={() => battle(selectedMap!)}
          >
            사냥하기
          </Button>
        </div>

        {/* 전투로그 */}
        {battleResult && battleResult.monster && (
          <div>
            <div className='flex gap-1 text-sm'>
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
                  className="max-w-28 rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center text-[24px] leading-[24px] ff-ba gap-1">
                  <div className="ff-ba rounded-lg bg-indigo-400 text-white px-4 py-0.5">
                    {battleResult.monster.name}
                  </div>
                  <div className="ff-ba">을/를 만났습니다.</div>
                </div>
                <div>HP:{battleResult.monster.hp}</div>
              </div>
            </div>
            <div className="text-white text-[16px]">
              {battleLogs.map((battleLog: any, index: any) => {
                return (
                  <div
                    key={`battlelog-${index}`}
                    className="animate-slideIn flex items-center mb-1 gap-1 transition text-black opacity-0"
                    style={
                      { '--delay': `${index * 0.25}s` } as React.CSSProperties
                    }
                  >
                    <Chip
                      variant="gradient"
                      size="sm"
                      color={battleLog.isCriticalHit ? 'red' : 'indigo'}
                      value={`${index + 1}Turn`}
                    />
                    <div className="flex items-center gap-1">
                      {battleLog.isCriticalHit && (
                        <Chip size="sm" color="yellow" value="치명타!" />
                      )}
                      <div className="bg-light-blue-300 ff-ba text-[20px] leading-[20px] px-2 py-0.5 text-white rounded-lg">
                        {battleLog.damage}
                      </div>
                      <div>의 피해를 입혔습니다.</div>
                    </div>
                    <div className="ml-auto">
                      남은 체력:{battleLog.currentHp}
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              className="animate-slideIn transition flex flex-col opacity-0"
              style={
                {
                  '--delay': `${battleResult.battleLogs.length * 0.25}s`,
                } as React.CSSProperties
              }
            >
              <div className="flex items-end">
                전투에서
                <span
                  className={`pl-1 font-bold text-3xl ${battleResult.isWin ? 'text-green-900' : 'text-red-800'}`}
                >
                  {battleResult.isWin ? '승리' : '패배'}
                </span>
                했습니다!
              </div>
              {battleResult.isWin && (
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
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
})
