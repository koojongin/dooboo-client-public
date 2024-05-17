'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { fetchGetCharacterList } from '@/services/api-admin-fetch'
import { ago, toMMDDHHMMSS } from '@/services/util'
import createKey from '@/services/key-generator'
import { Pagination } from '@/interfaces/common.interface'

export default function AdminCharacterListPage() {
  const router = useRouter()
  const [pagination, setPagination] = useState<Pagination>()
  const [characters, setCharacters] = useState<any[]>([])
  const loadCharacters = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetCharacterList(
      {},
      { sort: { lastBattledAt: -1 }, limit: 20, page: selectedPage },
    )

    setCharacters(result.docs)
    setPagination({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    })
  }, [])

  useEffect(() => {
    loadCharacters()
  }, [loadCharacters])
  return (
    <div>
      <Card className="rounded">
        <div className="p-[10px]">
          {characters.map((character, index) => {
            return (
              <div
                onClick={() =>
                  router.push(`/admindooboo/db/character/deck/${character._id}`)
                }
                key={character._id}
                className="hover:bg-gray-100 cursor-pointer text-[14px] flex border-b border-b-gray-400 px-[4px] py-[2px] items-center [&>div]:border-r [&>div]:border-gray-600"
              >
                <div className="w-[30px]">{index}.</div>
                <div className="w-[30px]">{character.level}</div>
                <div className="w-[100px]">{character.job}</div>
                <div className="w-[120px]">{character.nickname}</div>
                <div className="w-[120px]">
                  {character.gold.toLocaleString()}
                </div>
                <div className="w-[130px]">
                  {character.lastBattledAt &&
                    toMMDDHHMMSS(character.lastBattledAt)}
                </div>
                <div className="w-[80px]">
                  {character.lastBattledAt && ago(character.lastBattledAt)}
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
                        onClick={() => loadCharacters(index + 1)}
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
