import { Card, Tooltip } from '@material-tailwind/react'
import { useState } from 'react'
import { ProfilePopover } from '@/components/popover/profile-popover'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { MeResponse } from '@/interfaces/user.interface'
import { AttackOptionsBox } from '@/app/main/inn/stash/stat-attack-options-box'
import { StatNormalOptionsBox } from '@/app/main/inn/stash/stat-normal-options-box'
import createKey from '@/services/key-generator'

const EXP_WIDTH = 200
export function CharacterStatBoxComponent({
  meResponse,
  refresh,
  disableExperience,
  disableProfileThumbnail,
  className,
}: {
  meResponse: MeResponse
  refresh: () => Promise<void>
  disableExperience?: boolean
  disableProfileThumbnail?: boolean
  className?: string
}) {
  const { stat, character, nextExp } = meResponse
  const [selectedTab, setSelectedTab] = useState('일반')
  return (
    <Card
      className={`rounded flex flex-col justify-start items-start min-h-40 shadow-none p-[10px] ${className}`}
    >
      <div className="ff-score font-bold text-[16px]">캐릭터 정보</div>
      <div className="flex flex-col gap-[2px] ff-score-all font-bold text-[16px] w-full">
        <div className="flex gap-1">
          {!disableProfileThumbnail && (
            <ProfilePopover
              onSelect={refresh}
              child={
                <div className="w-[80px] h-[80px] min-w-[80px] min-h-[80px] flex items-center justify-center border border-gray-300 rounded p-[2px]">
                  {/* <img className="w-full" src="/images/ako.webp" /> */}
                  {!character.thumbnail && (
                    <img className="w-full" src={DEFAULT_THUMBNAIL_URL} />
                  )}
                  {character.thumbnail && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${character.thumbnail}')`,
                      }}
                    />
                  )}
                </div>
              }
            />
          )}
          <div className="w-full flex flex-col gap-[2px]">
            <div className="flex w-full justify-between">
              <div>Lv.{character.level}</div>
              <div>{character.nickname}</div>
            </div>
            {/* <div className="w-full flex justify-between"> */}
            {/*  <div>골드</div> */}
            {/*  <div>{character.gold.toLocaleString()}</div> */}
            {/* </div> */}
            {!disableExperience && (
              <div className="w-full flex justify-between items-center">
                <div>경험치</div>
                <div>
                  <Tooltip
                    interactive
                    content={`경험치 ${character.experience} / ${nextExp}`}
                  >
                    <div
                      className={`min-w-[${EXP_WIDTH}px] max-w-[${EXP_WIDTH}px] min-h-[26px] flex justify-center items-center relative rounded-md overflow-hidden border-2 border-blue-200 noselect cursor-pointer`}
                    >
                      {/* {character.experience}/{nextExp} */}
                      <div
                        className="absolute left-0 max-w-[300px] min-h-full opacity-80 z-[5]"
                        style={{
                          width: `${EXP_WIDTH * (character.experience / nextExp)}px`,
                          background:
                            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                          transition: 'width 1s',
                        }}
                      />
                      <div
                        className={`absolute min-w-[${EXP_WIDTH}px] max-w-[{EXP_WIDTH$px] min-h-full bg-blue-100`}
                      />
                      <div
                        className={`z-[5] absolute min-w-[${EXP_WIDTH}px] max-w-[{EXP_WIDTH$px] min-h-full flex items-center justify-center text-white ff-ba text-[16px]`}
                      >
                        {((character.experience / nextExp) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col text-[14px] ff-score-all font-bold">
          <div className="flex items-center border-b border-b-gray-500 mt-[5px]">
            {['일반', '공격'].map((key) => {
              return (
                <div
                  key={createKey()}
                  className={`px-[8px] py-[4px] cursor-pointer text-[16px]
                  ${key === selectedTab ? 'bg-green-500 text-white' : ''}`}
                  onClick={() => {
                    setSelectedTab(key)
                  }}
                >
                  {key}
                </div>
              )
            })}
          </div>
          <div className="border border-t-0 border-gray-600 p-[5px]">
            {selectedTab === '일반' && <StatNormalOptionsBox stat={stat} />}
            {selectedTab === '공격' && <AttackOptionsBox stat={stat} />}
          </div>
        </div>
      </div>
    </Card>
  )
}
