'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileSearchBar } from '@/app/main/profile/profile-search-bar'
import { fetchGetCharactersByKeyword } from '@/services/api/api.character'
import { Character } from '@/interfaces/user.interface'
import createKey from '@/services/key-generator'
import { getJobIconBgColor, getJobIconUrl, translate } from '@/services/util'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'

export default function ProfileSearchPage({
  params,
}: {
  params: { keyword: string }
}) {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const loadCharacters = useCallback(async (keyword: string) => {
    const result = await fetchGetCharactersByKeyword(keyword)
    setCharacters(result.characters)
  }, [])

  const goToProfile = (id: string) => {
    router.push(`/main/profile/${id}`)
  }

  useEffect(() => {
    if (!params.keyword) return
    loadCharacters(decodeURIComponent(params.keyword))
  }, [loadCharacters, params.keyword])
  return (
    <div className="w-full flex flex-col gap-[5px] ff-score-all font-bold">
      <ProfileSearchBar />
      <Card className="rounded p-[10px]">
        <div>
          "{decodeURIComponent(params.keyword)}"(으)로 검색된 결과입니다.
        </div>
        <div className="flex flex-wrap gap-[10px] cursor-pointer">
          {characters.map((character) => {
            return (
              <div
                key={createKey()}
                className="flex gap-[4px] border border-blue-200 p-[1px] rounded shadow-md"
                onClick={() => {
                  goToProfile(character._id)
                }}
              >
                <div className="flex gap-[4px] border border-purple-300 p-[10px] rounded border-dashed bg-gradient-to-br from-blue-100 via-purple-50 to-blue-200">
                  <div
                    className="w-[100px] h-[100px] bg-cover bg-no-repeat bg-center border rounded bg-white"
                    style={{
                      backgroundImage: `url(${character.thumbnail || DEFAULT_THUMBNAIL_URL})`,
                    }}
                  />
                  <div className="min-w-[150px]">
                    <div className="flex items-center gap-[4px] border border-blueGray-400 rounded px-[4px]">
                      <div className="w-[18px] h-[18px]">
                        <img
                          style={{
                            background: getJobIconBgColor(character.job),
                          }}
                          src={getJobIconUrl(character.job)}
                          className="w-full h-full"
                        />
                      </div>
                      <div>{translate(`job:${character.job || 'novice'}`)}</div>
                    </div>
                    <div>
                      Lv.{character.level} {character.nickname}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
