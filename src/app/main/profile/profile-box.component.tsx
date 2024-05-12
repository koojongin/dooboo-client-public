'use client'

import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { Button, Tooltip } from '@material-tailwind/react'
import { getJobIconBgColor, getJobIconUrl, translate } from '@/services/util'
// import { fetchMe } from '@/services/api-fetch'

interface IProfileBoxComponent {
  character: { nickname: string; level: string; job: string }
  user: { nickname: string }
}

export function ProfileBoxComponent({ character, user }: IProfileBoxComponent) {
  const goToSkillTech = () => {
    console.log('스킬트리 창 띄우거나 보내기')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        <div className="w-[150px] h-[150px] min-w-[150px] min-h-[150px] border border-gray-600 rounded p-[1px] flex items-center justify-center">
          <img className="w-full" src={DEFAULT_THUMBNAIL_URL} />
        </div>
        <div className="w-full flex flex-col gap-[2px]">
          <Tooltip
            content={`[${translate(`job:${character.job ? character.job : 'novice'}`)}]${
              character.nickname
            }`}
          >
            <div className="flex items-center gap-[2px]">
              <div
                className="w-[40px] h-[40px] min-w-[40px] min-h-[40px]"
                style={{
                  background: getJobIconBgColor(character.job),
                }}
              >
                <img
                  src={getJobIconUrl(character.job)}
                  className="w-full h-full"
                />
              </div>
              <div className="ff-score font-bold leading-[100%] overflow-ellipsis truncate text-2xl">
                {character.nickname}
              </div>
            </div>
          </Tooltip>
          <div className="w-full flex justify-between text-2xl">
            <div>Lv.{character.level}</div>
          </div>
        </div>
      </div>
      <Button
        className="w-full text-xl"
        size="md"
        color="cyan"
        onClick={goToSkillTech}
      >
        스킬트리보기
      </Button>
    </div>
  )
}
