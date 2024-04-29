'use client'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import createKey from '@/services/key-generator'
import {
  fetchDeleteBaseWeapon,
  fetchGetBaseWeaponList,
} from '@/services/api-fetch'
import { Pagination } from '@/interfaces/common.interface'
import { BaseWeapon } from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { toRangeString } from '@/services/util'

const TABLE_HEAD = [
  '-',
  '이름',
  '물리',
  '냉기',
  '화염',
  '번개',
  '치명타확률',
  '치명타피해',
  '획득골드',
  '템렙',
  '최대스타포스',
  '-',
]
export default function ItemWeaponPage() {
  const router = useRouter()
  const monsters: any = []
  const result = null
  const [pagination, setPagination] = useState<Pagination>()
  const [weapons, setWeapons] = useState<BaseWeapon[]>()

  const editItem = (weapon: BaseWeapon) => {
    router.push(`/admindooboo/item/weapon/edit/${weapon._id}`)
  }
  const deleteItem = async (weapon: BaseWeapon) => {
    const { isConfirmed } = await Swal.fire({
      title: '정말로 삭제하시겠습니까?',
      text: weapon.name || '?',
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      await fetchDeleteBaseWeapon(weapon._id!)
      await Swal.fire({
        title: '삭제되었습니다.',
        text: '-',
        icon: 'success',
        confirmButtonText: '확인',
      })
    }
  }

  const loadList = async () => {
    const {
      page,
      total,
      totalPages,
      weapons: rWeapons,
    } = await fetchGetBaseWeaponList()

    setPagination({ page, total, totalPages })
    setWeapons(rWeapons)
  }
  useEffect(() => {
    loadList()
  }, [])
  return (
    <div>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="text-2xl">무기목록</div>
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
                    key={createKey()}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-1"
                  >
                    <div className="p-1">{head}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weapons &&
                weapons.map((weapon, index) => {
                  const isLast = index === monsters.length - 1
                  const classes = `${isLast ? 'p-1' : 'p-1 border-b border-blue-gray-50'}`

                  return (
                    <tr
                      key={createKey()}
                      className="hover:bg-gray-100 [&>*:nth-child(even)]:bg-blue-gray-50/50"
                    >
                      <td className={`${classes} w-[50px]`}>
                        <img
                          src={toAPIHostURL(weapon.thumbnail)}
                          className="w-[40px] h-[40px] border border-blue-gray-50 bg-blue-gray-50/50 object-contain"
                        />
                      </td>
                      <td className={classes}>
                        <div>{weapon.name}</div>
                      </td>
                      <td className={classes}>
                        <div>{toRangeString(weapon.damageOfPhysical)}</div>
                      </td>
                      <td className={classes}>
                        <div>{toRangeString(weapon.damageOfCold)}</div>
                      </td>
                      <td className={classes}>
                        <div>{toRangeString(weapon.damageOfFire)}</div>
                      </td>
                      <td className={classes}>
                        <div>{toRangeString(weapon.damageOfLightning)}</div>
                      </td>
                      <td className={classes}>
                        <div>{toRangeString(weapon.criticalRate)}</div>
                      </td>
                      <td className={classes}>
                        <div>{toRangeString(weapon.criticalMultiplier)}</div>
                      </td>
                      <td className={classes}>
                        <div>{weapon.gold}</div>
                      </td>{' '}
                      <td className={classes}>
                        <div>{weapon.iLevel}</div>
                      </td>
                      <td className={classes}>
                        <div>{weapon.maxStarForce}</div>
                      </td>
                      <td className={`${classes}`}>
                        <div className="flex justify-start gap-1">
                          <div
                            className="cursor-pointer rounded bg-green-500 text-white px-2 py-0.5"
                            key={`${weapon._id}-edit`}
                            onClick={() => editItem(weapon)}
                          >
                            수정
                          </div>
                          <div
                            className="cursor-pointer rounded bg-red-700 text-white px-2 py-0.5"
                            key={`${weapon._id}-delete`}
                            onClick={() => deleteItem(weapon)}
                          >
                            삭제
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </CardBody>
        {pagination && (
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-1">
            <Button variant="outlined" size="sm">
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {new Array(pagination.totalPages).fill(1).map((value, index) => {
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
    </div>
  )
}
