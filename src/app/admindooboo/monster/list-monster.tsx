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
import { useRouter } from 'next/navigation'
import { fetchGetMonsters } from '@/services/api-fetch'
import createKey from '@/services/key-generator'
import {
  Monster,
  MonsterListRef,
  UpdateMonsterDialogRef,
} from '@/interfaces/monster.interface'
import UpdateMonsterDialog from './update-monster-dialog'
import {API_SERVER_URL} from "@/constants/constant";

const TABLE_HEAD = ['이미지', 'name', 'experience', 'hp', 'gold', 'weight', '']

export default forwardRef<MonsterListRef, any>(function MonsterListComponent(
  { customCss }: any,
  forwardedRef: ForwardedRef<any>,
) {
  const router = useRouter()
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [result, setResult] = useState<any>()
  const monsterUpdateDialogRef = useRef<UpdateMonsterDialogRef>(null)
  const handleOpenUpdateMonsterDialog = (monster: Monster) => {
    monsterUpdateDialogRef?.current?.openDialog(monster)
  }
  const editMonster = (monster: Monster) => {
    // handleOpenUpdateMonsterDialog(monster)
    router.push(`/admindooboo/monster/edit/${monster._id}`)
  }
  const refreshMonsters = useCallback(async () => {
    const {
      monsters: rMonsters,
      total,
      totalPages,
      page,
    } = await fetchGetMonsters()
    const mixedMonsters = rMonsters.map((m: any) => {
      const monster = { ...m }
      monster.thumbnail = `${API_SERVER_URL}/${monster.thumbnail}`
      return monster
    })
    setMonsters(mixedMonsters)
    setResult({
      total,
      totalPages,
      page,
    })
  }, [])

  useEffect(() => {
    refreshMonsters()
  }, [])

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
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="text-2xl">등록된 몬스터 목록</div>
          <div className="flex w-full shrink-0 gap-1 md:w-max">
            <div className="w-full md:w-72">
              <Input label="Search" />
            </div>
            <Button className="flex items-center gap-3" size="sm">
              검색준비중
            </Button>
          </div>
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
                    <td className={`${classes}`}>
                      <img
                        src={monster.thumbnail}
                        className="w-20 h-20 border border-blue-gray-50 bg-blue-gray-50/50 object-contain"
                      />
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
      {result && (
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-1">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {new Array(result.totalPages).fill(1).map((value, index) => {
              return (
                <IconButton variant="outlined" size="sm" key={createKey()}>
                  {index + 1}
                </IconButton>
              )
            })}
          </div>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </CardFooter>
      )}
    </Card>
  )
})
