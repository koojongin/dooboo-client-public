'use client'

import { Button, Tooltip } from '@material-tailwind/react'
import Swal from 'sweetalert2'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { getJobIconBgColor, getJobIconUrl, translate } from '@/services/util'

export function ProfileBoxComponent({ character }: { character: any }) {
  const goToSkillTech = () => {
    Swal.fire({
      title: '준비중',
      text: '준비중',
      icon: 'info',
      confirmButtonText: '확인',
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-[10px]">
        <div className="w-[50px] h-[50px] min-w-[50px] min-h-[50px] border border-gray-600 rounded p-[1px] flex items-center justify-center">
          <img
            className="w-full"
            src={character.thumbnail || DEFAULT_THUMBNAIL_URL}
          />
        </div>
        <div className="w-full flex flex-col gap-[2px]">
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
      </div>
      <div className="flex mt-[4px]">
        <div
          className="bg-cyan-900 text-white flex items-center justify-center min-w-[120px] min-h-[30px] rounded shadow-md shadow-cyan-800 cursor-pointer"
          onClick={goToSkillTech}
        >
          스킬트리보기
        </div>
      </div>
    </div>
  )
}
