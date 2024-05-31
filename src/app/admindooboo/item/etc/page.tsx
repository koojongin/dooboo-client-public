'use client'

import { Card, CardBody, CardHeader } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { fetchGetBaseMiscList } from '@/services/api-admin-fetch'
import { Pagination } from '@/interfaces/common.interface'
import { BaseMisc } from '@/interfaces/item.interface'

export default function ItemMiscPage() {
  const router = useRouter()
  const [baseMiscs, setBaseMiscs] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>()

  const loadBaseMiscs = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetBaseMiscList({}, { page: selectedPage })
    setBaseMiscs(result.baseMiscs)
    setPagination({ ...result })
  }, [])

  const editItem = (baseMisc: BaseMisc) => {
    router.push(`/admindooboo/item/etc/edit/${baseMisc._id}`)
  }
  const deleteItem = (baseMisc: BaseMisc) => {}

  useEffect(() => {
    loadBaseMiscs()
  }, [loadBaseMiscs])

  return (
    <div>
      <Card className="h-full w-full rounded">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          Misc 목록
        </CardHeader>
        <CardBody>
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                {[
                  '',
                  '이름',
                  'category',
                  'desc',
                  '등급',
                  '총스택',
                  '가격',
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
              {baseMiscs &&
                baseMiscs.map((baseMisc: any, index: number) => {
                  const isLast = index === baseMiscs.length - 1
                  const classes = `${isLast ? 'p-1' : 'p-1 border-b border-blue-gray-50'}`
                  return (
                    <tr
                      key={createKey()}
                      className="hover:bg-gray-100 [&>*:nth-child(even)]:bg-blue-gray-50/50"
                    >
                      <td className={`${classes} w-[50px]`}>
                        <img
                          src={toAPIHostURL(baseMisc.thumbnail)}
                          className="w-[40px] h-[40px] border border-blue-gray-50 bg-blue-gray-50/50 object-contain"
                        />
                      </td>
                      <td>{baseMisc.name}</td>
                      <td>{baseMisc.category}</td>
                      <td>{baseMisc.desc}</td>
                      <td>{baseMisc.iGrade}</td>
                      <td>{baseMisc.maxStack}</td>
                      <td>{baseMisc.gold}</td>
                      <td>
                        <div className="flex justify-start gap-1">
                          <div
                            className="cursor-pointer rounded bg-green-500 text-white px-2 py-0.5"
                            key={`${baseMisc._id}-edit`}
                            onClick={() => editItem(baseMisc)}
                          >
                            수정
                          </div>
                          <div
                            className="cursor-pointer rounded bg-red-700 text-white px-2 py-0.5"
                            key={`${baseMisc._id}-delete`}
                            onClick={() => deleteItem(baseMisc)}
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
                              onClick={() => loadBaseMiscs(index + 1)}
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
