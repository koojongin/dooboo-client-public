'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { getJobIconBgColor, getJobIconUrl, translate } from '@/services/util'
import { Character } from '@/interfaces/user.interface'
import { fetchGetCharacterProfile } from '@/services/api/api.character'

export function ProfileLeftBoxComponent({
  characterId,
}: {
  characterId: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [character, setCharacter] = useState<Character>()

  const getProfileInfo = useCallback(async (cId: string) => {
    const result = await fetchGetCharacterProfile(cId)
    setCharacter(result.character)
  }, [])
  const goToSubRoute = (url: string) => {
    if (url === '') {
      return router.push(`/main/profile/${characterId}`)
    }
    if (pathname.indexOf(url) >= 0) return
    router.push(`/main/profile/${characterId}/${url}`)
  }

  useEffect(() => {
    getProfileInfo(characterId)
  }, [characterId, getProfileInfo])

  return (
    <Card className="p-[10px] rounded min-w-[200px]">
      <div className="flex flex-col">
        <div className="flex gap-[10px]">
          {character && (
            <>
              <div className="w-[100px] h-[100px] min-w-[100px] min-h-[100px] border border-gray-600 rounded p-[1px] flex items-center justify-center">
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{
                    backgroundImage: `url('${character.thumbnail || DEFAULT_THUMBNAIL_URL}')`,
                  }}
                />
              </div>
              <div className="w-full flex flex-col gap-[2px] min-w-[200px]">
                <Tooltip
                  content={`[${translate(`job:${character.job ? character.job : 'novice'}`)}]${
                    character.nickname
                  }`}
                >
                  <div className="flex items-center gap-[2px]">
                    <div
                      className="w-[20px] h-[20px] min-w-[20px] min-h-[20px]"
                      style={{
                        background: getJobIconBgColor(character.job),
                      }}
                    >
                      <img
                        src={getJobIconUrl(character.job)}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="ff-score font-bold overflow-ellipsis truncate">
                      {character.nickname}
                    </div>
                  </div>
                </Tooltip>
                <div className="w-full flex justify-between">
                  <div>Lv.{character.level}</div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-[7px] mt-[4px]">
          <div
            className="bg-cyan-900 text-white flex items-center justify-center min-w-[120px] min-h-[30px] rounded shadow-md shadow-cyan-950/50 cursor-pointer"
            onClick={() => goToSubRoute('')}
          >
            홈으로
          </div>
          <div
            className="bg-cyan-900 text-white flex items-center justify-center min-w-[120px] min-h-[30px] rounded shadow-md shadow-cyan-950/50 cursor-pointer"
            onClick={() => goToSubRoute('skill')}
          >
            스킬트리보기
          </div>
          <div
            className="bg-cyan-900 text-white flex items-center justify-center min-w-[120px] min-h-[30px] rounded shadow-md shadow-cyan-950/50 cursor-pointer"
            onClick={() => goToSubRoute('deck')}
          >
            덱보기
          </div>
        </div>
      </div>
    </Card>
  )
}
