'use client'

import { useEffect, useState } from 'react'
import { fetchGetRankList } from '@/services/api-fetch'

export default function CommunityPage() {
  const [characters, setCharacters] = useState<any[]>([])

  const tableClass = ['min-w-[50px]', '']

  const loadRanks = async () => {
    const { characters: rCharacters } = await fetchGetRankList()
    setCharacters(rCharacters)
  }
  useEffect(() => {
    loadRanks()
  }, [])
  return (
    <div>
      <div className="flex gap-1 px-[1px] py-[1px] bg-blue-gray-200 bg-dark-blue text-white">
        <div className={tableClass[0]}>Lv</div>
        <div className={tableClass[1]}>캐릭터명</div>
      </div>
      {characters &&
        characters.map((character) => {
          const { user } = character
          return (
            <div key={character._id} className="flex gap-1 px-[1px] py-[1px]">
              <div className={tableClass[0]}>{character.level}</div>
              <div className={tableClass[1]}>{user.nickname}</div>
            </div>
          )
        })}
    </div>
  )
}
