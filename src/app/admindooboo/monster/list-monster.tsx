import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Typography,
} from '@material-tailwind/react'
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import _ from 'lodash'
import createKey from '@/services/key-generator'
import {
  Monster,
  MonsterListRef,
  UpdateMonsterDialogRef,
} from '@/interfaces/monster.interface'
import UpdateMonsterDialog from './update-monster-dialog'
import { API_SERVER_URL } from '@/constants/constant'
import { Pagination } from '@/interfaces/common.interface'
import { fetchGetMonsters } from '@/services/api-admin-fetch'
import { DbMap } from '@/interfaces/map.interface'

const TABLE_HEAD = [
  '이미지',
  '_id',
  'map',
  'level',
  'name',
  'experience',
  'hp',
  'gold',
  'weight',
  '-',
]

export default forwardRef<MonsterListRef, any>(function MonsterListComponent(
  {
    customCss,
  }: {
    customCss: any
  },
  forwardedRef: ForwardedRef<any>,
) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [pagination, setPagination] = useState<Pagination>()
  const [monsters, setMonsters] = useState<
    Array<Monster & { map?: { name: string } | DbMap }>
  >([])
  const monsterUpdateDialogRef = useRef<UpdateMonsterDialogRef>(null)
  const handleOpenUpdateMonsterDialog = (monster: Monster) => {
    monsterUpdateDialogRef?.current?.openDialog(monster)
  }
  const editMonster = (monster: Monster) => {
    // handleOpenUpdateMonsterDialog(monster)
    router.push(`/admindooboo/monster/edit/${monster._id}`)
  }

  const onClickMap = (map?: DbMap | any) => {
    if (!map) return
    router.push(`/admindooboo/monster/${map._id}`)
  }

  const refreshMonsters = useCallback(async (condition = {}, opts = {}) => {
    const {
      monsters: rMonsters,
      total,
      totalPages,
      page,
    } = await fetchGetMonsters(condition, { ...opts, sort: { updatedAt: -1 } })
    const mixedMonsters = rMonsters.map((m: any) => {
      const monster = { ...m }
      monster.thumbnail = `${API_SERVER_URL}/${monster.thumbnail}`
      return monster
    })
    // setMonsters(_.sortBy(mixedMonsters, 'map.name'))
    setMonsters(mixedMonsters)
    setPagination({
      total,
      totalPages,
      page,
    })
  }, [])

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    _.chain(current)
      .map((a) => {
        return a
      })
      .value()
    refreshMonsters()
  }, [refreshMonsters, searchParams])

  useImperativeHandle(forwardedRef, () => ({
    refresh: () => {
      refreshMonsters()
    },
  }))

  return (
    <Card className={`h-full w-full ${customCss}`}>
      <UpdateMonsterDialog
        ref={monsterUpdateDialogRef}
        refreshMonsters={refreshMonsters}
      />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex justify-start items-center gap-[10px] [&>div]:bg-green-800 [&>div]:text-white [&>div]:p-[4px] [&>div]:cursor-pointer">
          <div onClick={() => refreshMonsters()}>전체</div>
          <div onClick={() => refreshMonsters({ inRaid: true })}>레이드</div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-1"
                >
                  <div className="p-1">{head}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr />
            {monsters &&
              monsters.map((monster, index) => {
                const isLast = index === monsters.length - 1
                const classes = isLast
                  ? 'p-1'
                  : 'p-1 border-b border-blue-gray-50'

                return (
                  <tr key={createKey()} className="hover:bg-gray-100">
                    <td className={`${classes}`} style={{ padding: 0 }}>
                      <img
                        src={monster.thumbnail}
                        className="w-[30px] h-[30px] border border-blue-gray-50 bg-blue-gray-50/50 object-contain"
                      />
                    </td>
                    <td className={`${classes}`}>
                      <div>{monster._id}</div>
                    </td>
                    <td className={`${classes}`} style={{ padding: 0 }}>
                      <div
                        className="inline-flex bg-green-500 text-white cursor-pointer rounded px-[4px]"
                        onClick={() => onClickMap(monster?.map)}
                      >
                        {monster?.map?.name}
                      </div>
                    </td>
                    <td className={`${classes}`} style={{ padding: 0 }}>
                      <div>{monster.level}</div>
                    </td>
                    <td className={classes}>
                      <div>{monster.name}</div>
                    </td>
                    <td className={classes}>
                      <div>{monster.experience}</div>
                    </td>
                    <td className={classes}>
                      <div>{monster.hp}</div>
                    </td>
                    <td className={classes}>
                      <div>{monster.gold}</div>
                    </td>
                    <td className={classes}>
                      <div>{monster.weight}</div>
                    </td>
                    <td className={`${classes}`}>
                      <div
                        className="cursor-pointer"
                        key={monster._id}
                        onClick={() => editMonster(monster)}
                      >
                        수정
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </CardBody>
      <div className="min-h-[27px] flex items-center px-[8px] border-t border-t-gray-400">
        {pagination && (
          <div className="w-full flex justify-center">
            <div className="flex gap-[4px]">
              {new Array(pagination.totalPages).fill(1).map((value, index) => {
                return (
                  <div
                    onClick={() => refreshMonsters({}, { page: index + 1 })}
                    className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                    key={createKey()}
                  >
                    {index + 1}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
})
