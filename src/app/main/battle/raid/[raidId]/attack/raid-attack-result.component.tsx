'use client'

import { Card } from '@material-tailwind/react'
import { formatNumber, translate } from '@/services/util'
import { GameDamageTotalResult, Raid } from '@/interfaces/raid.interface'
import { ActiveSkill } from '@/services/skill/skill'
import toAPIHostURL from '@/services/image-name-parser'

export function RaidAttackResultComponent({
  raid,
  totalResult,
  activeSkill,
}: {
  raid: Raid
  totalResult: GameDamageTotalResult
  activeSkill: ActiveSkill
}) {
  const monster = raid.monsters[0].monster!
  return (
    <Card className="p-[10px] rounded flex justify-center items-center w-full">
      <div className="text-center min-w-[500px]">
        <div className="inline-flex bg-gray-800 text-white p-[10px] px-[100px] ff-wavve font-normal text-[30px]">
          전투 기록
        </div>
        <div className="border border-gray-800 rounded p-[10px] mt-[10px] shadow-md shadow-gray-600/70">
          <div className="inline-flex justify-center items-center text-[20px] bg-gray-800 rounded overflow-hidden">
            <div
              className="bg-contain w-[60px] h-[60px] bg-white bg-center border border-r-0 border-gray-800 rounded-l"
              style={{
                backgroundImage: `url(${toAPIHostURL(monster.thumbnail)})`,
              }}
            />
            <div className="ff-wavve font-normal px-[10px] text-white min-w-[100px]">
              {monster.name}
            </div>
          </div>
          <div className="flex justify-between">
            <div>체력</div>
            <div>
              {formatNumber(raid.monsters[0].currentHp)} /{' '}
              {formatNumber(monster.hp)}
            </div>
          </div>
          <div className="flex justify-between">
            <div>저항</div>
            <div>{formatNumber(monster.resist)}</div>
          </div>
          <hr className="my-[5px] border-gray-800" />
          <div className="inline-flex justify-center items-center text-[20px] bg-gray-800 rounded overflow-hidden">
            <div
              className="bg-contain w-[50px] h-[50px] bg-white bg-center p-[2px] bg-clip-content rounded-[6px]"
              style={{ backgroundImage: `url(${activeSkill.icon})` }}
            />
            <div className="ff-wavve font-normal px-[10px] text-white">
              {translate(`skill:${activeSkill.name}`)}
            </div>
          </div>
          <div className="flex justify-between">
            <div>피해</div>
            <div>{formatNumber(totalResult.damaged)}</div>
          </div>
          <div className="flex justify-between">
            <div>초당 피해</div>
            <div>
              {formatNumber(totalResult.damaged / (totalResult.elapsed / 1000))}
            </div>
          </div>
          <div className="flex justify-between">
            <div>전투 시간</div>
            <div>
              {formatNumber(
                Math.min(
                  totalResult.elapsed / 1000,
                  totalResult.maxElapsed / 1000,
                ),
              )}
              초
            </div>
          </div>

          <div className="flex justify-between text-blueGray-400">
            <div>최대 전투 시간</div>
            <div>{formatNumber(totalResult.maxElapsed / 1000)}초</div>
          </div>
          <hr className="my-[5px] border-gray-800" />
          <div>
            <div className="flex justify-between">
              <div>최종 피해량</div>
              <div>
                {formatNumber(
                  Math.min(
                    totalResult.damaged / (totalResult.elapsed / 1000),
                    raid.monsters[0]!.monster!.hp,
                  ),
                )}
              </div>
            </div>
            <div className="flex justify-start gap-[10px]">
              <i className="fa-solid fa-turn-up rotate-90 text-[12px]" />
              <div className="text-[14px]">
                피해량 / 전투 시간,{' '}
                <span className="text-red-700">
                  몬스터의 최대 체력을 넘을 수 없습니다.
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <div>레이드 상한 피해량</div>
              <div>
                {formatNumber(
                  Math.min(
                    totalResult.damaged / (totalResult.elapsed / 1000),
                    raid.monsters[0]!.monster!.hp * 0.2,
                  ),
                )}
              </div>
            </div>
            <div className="flex justify-start gap-[10px]">
              <i className="fa-solid fa-turn-up rotate-90 text-[12px]" />
              <div className="text-[14px]">
                최대 피해량은 보스 체력의 20%입니다.
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-[10px] border-gray-800 border rounded">
            <div className="my-[4px] ff-wavve font-normal text-[20px]">
              기록에 적용될 피해량
            </div>
            <div className="bg-blue-900 text-white text-[30px] ff-wavve mt-0 m-[4px] py-[4px] rounded">
              {formatNumber(
                Math.min(
                  totalResult.damaged / (totalResult.elapsed / 1000),
                  raid.monsters[0]!.monster!.hp * 0.2,
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
