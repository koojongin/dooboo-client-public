'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@material-tailwind/react'
import { fetchGetStashList } from '@/services/api-admin-fetch'
import { ago, toMMDDHHMMSS } from '@/services/util'
import createKey from '@/services/key-generator'
import { Pagination } from '@/interfaces/common.interface'

export default function AdminStashListPage() {
  const [pagination, setPagination] = useState<Pagination>()
  const [stashes, setStashes] = useState<any[]>([])
  const loadStashes = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetStashList(
      {},
      { sort: { createdAt: -1 }, limit: 20, page: selectedPage },
    )

    setStashes(result.docs)
    setPagination({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    })
  }, [])

  useEffect(() => {
    loadStashes()
  }, [loadStashes])
  return (
    <div>
      <Card className="rounded">
        <div className="p-[10px]">
          {stashes.map((stash, index) => {
            return (
              <div
                key={stash._id}
                className="text-[14px] flex border-b border-b-gray-400 px-[4px] py-[2px] items-center [&>div]:border-r [&>div]:border-gray-600"
              >
                <div className="w-[20px]">{index}.</div>
                <div className="w-[100px]">{stash.owner.nickname}</div>
                <div className="w-[30px]">{stash.slots}</div>
                <div className="w-[130px]">
                  {stash.createdAt && toMMDDHHMMSS(stash.createdAt)}
                </div>
                <div className="w-[80px]">
                  {stash.createdAt && ago(stash.createdAt)}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          {pagination && (
            <div className="w-full flex justify-start mt-[15px]">
              <div className="flex gap-[4px]">
                {new Array(pagination.totalPages)
                  .fill(1)
                  .map((value, index) => {
                    return (
                      <div
                        className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                        onClick={() => loadStashes(index + 1)}
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
    </div>
  )
}
