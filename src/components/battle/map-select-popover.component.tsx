import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from '@material-tailwind/react'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Swal from 'sweetalert2'
import { DbMap } from '@/interfaces/map.interface'
import { fetchGetMapsName } from '@/services/api-fetch'
import { MapType } from '@/components/battle/map.type'
import { translate } from '@/services/util'
import createKey from '@/services/key-generator'

export function MapSelectComponent({
  activateBattle,
}: {
  activateBattle: (mapName: string) => Promise<void | any>
}) {
  const [maps, setMaps] = useState<DbMap[]>([])
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false)
  const [selectedMap, setSelectedMap] = useState<string>()
  const audioEndOfBattle = useMemo(
    () => new Audio('/audio/end_of_battle.mp3'),
    [],
  )
  const timerRef = useRef<NodeJS.Timeout>()

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
  }, [audioEndOfBattle, selectedMap])
  const startBattleInterval = (mapName: string) => {
    if (!timerRef.current) {
      timerRef.current = setInterval(async () => {
        try {
          if (!mapName) {
            stopBattleInterval()
            return await Swal.fire({
              title: '사냥터를 선택해주세요',
              text: '문제가 계속되면 관리자에게 문의해주세요',
              icon: 'error',
              confirmButtonText: '확인',
            })
          }
          await activateBattle(mapName)
        } catch (error: any) {
          const { response } = error
          const { status, data } = response || {}
          if ([429, 600].includes(status)) {
            return
          }
          stopBattleInterval()
        }
      }, 5500)
    }
  }

  const refreshMaps = useCallback(async () => {
    const { maps: rMaps } = await fetchGetMapsName()
    setMaps(rMaps)
  }, [])
  const battle = (mapName: string) => {
    if (!mapName)
      return Swal.fire({
        title: '사냥터를 선택해주세요',
        text: '문제가 계속되면 관리자에게 문의해주세요',
        icon: 'error',
        confirmButtonText: '확인',
      })
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

  useEffect(() => {
    refreshMaps()
    return () => {
      stopBattleInterval()
    }
  }, [refreshMaps, stopBattleInterval])
  return (
    <div className="flex">
      <div className="w-[200px]">
        <div>
          <MapSelectPopoverComponent
            maps={maps}
            selectedMap={selectedMap}
            setSelectedMap={setSelectedMap}
          />
        </div>
      </div>
      {isAutoRunning && (
        <div
          className="ff-ba ff-skew rounded-r flex cursor-pointer shadow-md hover:shadow-red-400 items-center justify-center w-[100px] text-white bg-red-500"
          onClick={() => battle(selectedMap!)}
        >
          자동 사냥중
        </div>
      )}
      {!isAutoRunning && (
        <div
          className="ff-ba ff-skew rounded-r flex cursor-pointer shadow-md hover:shadow-indigo-400 items-center justify-center w-[100px] text-white bg-indigo-500"
          onClick={() => battle(selectedMap!)}
        >
          사냥하기
        </div>
      )}
    </div>
  )
}

export function MapSelectPopoverComponent({
  maps,
  selectedMap,
  setSelectedMap,
}: {
  maps: any[]
  selectedMap: string | undefined
  setSelectedMap: Dispatch<SetStateAction<string | undefined>>
}) {
  const [isOpenedMapList, setIsOpenedMapList] = useState<boolean>(false)
  const selectMap = (mapName: string) => {
    setIsOpenedMapList(false)
    setSelectedMap(mapName)
  }
  const onClickMapType = async (mapType: MapType) => {
    // if (mapType === MapType.Raid)
    //   await Swal.fire({
    //     title: '미지원',
    //     text: '개발중',
    //     icon: 'info',
    //   })
  }

  return (
    <Popover
      handler={setIsOpenedMapList}
      open={isOpenedMapList}
      placement="bottom-end"
    >
      <PopoverHandler>
        <div className="ff-ba ff-skew border cursor-pointer pl-[10px] h-[30px] flex items-center text-blue-gray-700 border-gray-400 rounded">
          {selectedMap || '사냥터 선택하기'}
        </div>
      </PopoverHandler>
      <PopoverContent className="p-0 m-0 bg-transparent bg-gray-100 p-[4px] rounded border-gray-300">
        <div className="flex flex-col">
          <div className="ff-ba ff-skew bg-gradient-to-r from-[#272766e6]/100 to-gray-100/10 p-[8px] py-[5px] text-white text-[16px]">
            사냥터 목록
          </div>
          <div className="flex min-w-[500px]">
            <div className="flex flex-col min-w-[100px] gap-[4px]">
              {Object.keys(MapType).map((value, index) => {
                return (
                  <div
                    key={`map_type_${index}`}
                    className="hover:bg-gray-100 ff-ba ff-skew text-gray-800 bg-white p-[4px] border border-gray-400 border-r-0 cursor-pointer text-gray-700"
                    onClick={() => onClickMapType(value as unknown as MapType)}
                  >
                    {translate(`map:${value}`)}
                  </div>
                )
              })}
            </div>
            <div className="rounded-r rounded-bl border border-gray-400 border bg-white w-full p-[10px]">
              <div className="ff-ba-all ff-skew">
                <div className="flex items-center text-gray-900">
                  <div className="w-[50px]">레벨</div>
                  <div>지역명</div>
                </div>
                <div className="border-dashed border-b border-blue-gray-300 my-[6px]" />
                <div className="flex flex-col">
                  {maps &&
                    maps.map((map) => {
                      const { level } = map
                      if (level <= 30) {
                        return (
                          <MapNameBox
                            key={createKey()}
                            map={map}
                            onClick={() => selectMap(map.name)}
                          />
                        )
                      }
                      return (
                        <Tooltip
                          content="지역 레벨이 31이상 부터는 착용 무기의 아이템 레벨이 지역 레벨보다 낮을 경우 피해가 75% 감소됩니다."
                          key={createKey()}
                        >
                          <div>
                            <MapNameBox
                              map={map}
                              onClick={() => selectMap(map.name)}
                            />
                          </div>
                        </Tooltip>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MapNameBox({
  map,
  onClick,
}: {
  map: DbMap
  onClick: (mapName: string) => void
}) {
  return (
    <div
      key={`map_${map._id}`}
      className="py-[4px] flex items-center hover:bg-gray-100 cursor-pointer text-gray-800"
      onClick={() => onClick(map.name)}
    >
      <div className="w-[50px] overflow-ellipsis truncate pr-[5px]">
        {map.level}
      </div>
      <div>{map.name}</div>
    </div>
  )
}
