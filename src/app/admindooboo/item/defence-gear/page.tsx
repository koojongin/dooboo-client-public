'use client'

import { Card, CardBody, CardHeader } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { fetchGetBaseDefenceGearList } from '@/services/api-admin-fetch'
import { Pagination } from '@/interfaces/common.interface'
import { BaseDefenceGear } from '@/interfaces/item.interface'

export default function ItemDefenceGearPage() {
  const router = useRouter()
  const [baseDefenceGears, setBaseDefenceGears] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>()

  const loadBaseDefenceGears = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetBaseDefenceGearList({}, { page: selectedPage })
    setBaseDefenceGears(result.baseDefenceGears)
    setPagination({ ...result })
  }, [])

  const editItem = (baseDefenceGear: BaseDefenceGear) => {
    router.push(`/admindooboo/item/defence-gear/edit/${baseDefenceGear._id}`)
  }
  const deleteItem = (baseDefenceGear: BaseDefenceGear) => {}

  useEffect(() => {
    loadBaseDefenceGears()
  }, [loadBaseDefenceGears])

  return (
    <div>
      <Card className="h-full w-full rounded">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          DefenceGear 목록
        </CardHeader>
        <CardBody>
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                {[
                  '',
                  'name',
                  'armor',
                  'evasion',
                  '에쉴',
                  'eqLevel',
                  'eqStr',
                  'eqDex',
                  'eqLuk',
                  'iLevel',
                  'gold',
                  '-',
                ].map((head) => (
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
              {baseDefenceGears &&
                baseDefenceGears.map((baseDefenceGear: any, index: number) => {
                  const isLast = index === baseDefenceGears.length - 1
                  const classes = `${isLast ? 'p-1' : 'p-1 border-b border-blue-gray-50'}`
                  return (
                    <tr
                      key={createKey()}
                      className="hover:bg-gray-100 [&>*:nth-child(even)]:bg-blue-gray-50/50"
                    >
                      <td className={`${classes} w-[50px]`}>
                        <img
                          src={toAPIHostURL(baseDefenceGear.thumbnail)}
                          className="w-[40px] h-[40px] border border-blue-gray-50 bg-blue-gray-50/50 object-contain"
                        />
                      </td>
                      <td>{baseDefenceGear.name}</td>
                      <td>{baseDefenceGear.armor.join('-')}</td>
                      <td>{baseDefenceGear.evasion.join('-')}</td>
                      <td>{baseDefenceGear.energyShield.join('-')}</td>
                      <td>{baseDefenceGear.requiredEquipmentLevel}</td>
                      <td>{baseDefenceGear.requiredEquipmentStr}</td>
                      <td>{baseDefenceGear.requiredEquipmentDex}</td>
                      <td>{baseDefenceGear.requiredEquipmentLuk}</td>
                      <td>{baseDefenceGear.iLevel}</td>
                      <td>{baseDefenceGear.gold}</td>
                      <td>
                        <div className="flex justify-start gap-1">
                          <div
                            className="cursor-pointer rounded bg-green-500 text-white px-2 py-0.5"
                            key={`${baseDefenceGear._id}-edit`}
                            onClick={() => editItem(baseDefenceGear)}
                          >
                            수정
                          </div>
                          <div
                            className="cursor-pointer rounded bg-red-700 text-white px-2 py-0.5"
                            key={`${baseDefenceGear._id}-delete`}
                            onClick={() => deleteItem(baseDefenceGear)}
                          >
                            삭제
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              <div>
                {pagination && (
                  <div className="w-full flex justify-center mt-[15px]">
                    <div className="flex gap-[4px]">
                      {new Array(pagination.totalPages)
                        .fill(1)
                        .map((value, index) => {
                          return (
                            <div
                              onClick={() => loadBaseDefenceGears(index + 1)}
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
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}
