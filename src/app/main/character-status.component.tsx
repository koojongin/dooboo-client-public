import { Card, CardBody, Tooltip } from '@material-tailwind/react'
import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { Character, MeResponse, User } from '@/interfaces/user.interface'

export default (function CharacterStatusComponent({
  user,
  character,
  nextExp,
  stat,
}: MeResponse | any): JSX.Element {
  return (
    <Card className="col-span-1 flex flex-col justify-start items-start min-h-40">
      <CardBody className="w-full">
        <div className="flex flex-col">
          <div className="flex gap-1">
            <div>Lv.{character.level}</div>
            <div>{user.nickname}</div>
          </div>

          <div className="w-full flex justify-between">
            <div>골드</div>
            <div>{character.gold.toLocaleString()}</div>
          </div>

          <div className="w-full flex justify-between items-center">
            <div>경험치</div>
            <div>
              <Tooltip
                interactive
                content={`경험치 ${character.experience} / ${nextExp}`}
              >
                <div className="min-w-[300px] max-w-[300px] min-h-[26px] flex justify-center items-center relative rounded-md overflow-hidden border-2 border-blue-200 noselect cursor-pointer">
                  {/* {character.experience}/{nextExp} */}
                  <div
                    className="absolute left-0 max-w-[300px] min-h-full opacity-80 z-20"
                    style={{
                      width: `${300 * (character.experience / nextExp)}px`,
                      background:
                        'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                      transition: 'width 1s',
                    }}
                  />
                  <div className="absolute min-w-[300px] max-w-[300px] min-h-full bg-blue-100" />
                  <div className="z-20 absolute min-w-[300px] max-w-[300px] min-h-full flex items-center justify-center text-white ff-ba text-[20px] leading-[20px]">
                    {((character.experience / nextExp) * 100).toFixed(2)}%
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="w-full flex justify-between">
            <div>물리 피해</div>
            <div>{stat.damageOfPhysical}</div>
          </div>

          <div className="w-full flex justify-between">
            <div>화염 피해</div>
            <div>0</div>
          </div>
          <div className="w-full flex justify-between">
            <div>냉기 피해</div>
            <div>0</div>
          </div>
          <div className="w-full flex justify-between">
            <div>번개 피해</div>
            <div>0</div>
          </div>

          <div className="w-full flex justify-between">
            <div>치명타 확률</div>
            <div>{stat.criticalRate.toFixed(2)}%</div>
          </div>
          <div className="w-full flex justify-between">
            <div>치명타 배율</div>
            <div>+{stat.criticalMultiplier}%</div>
          </div>
          <hr className="mb-1" />
          <div>
            <div>착용장비</div>
            <div className="flex gap-1">
              <div className="w-9 h-9 border border-gray-300 rounded flex justify-center items-center">
                1
              </div>
              <div className="w-9 h-9 border border-gray-300 rounded flex justify-center items-center">
                1
              </div>
              <div className="w-9 h-9 border border-gray-300 rounded flex justify-center items-center">
                1
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
})
