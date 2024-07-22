import { Tooltip } from '@material-tailwind/react'
import { CharacterStat } from '@/interfaces/user.interface'
import { formatNumber, translate } from '@/services/util'
import createKey from '@/services/key-generator'

export function StatDefenceOptionsBox({ stat }: { stat: CharacterStat }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <div className="w-full flex justify-between">
        <div>총 방어력</div>
        <div>{formatNumber(stat.armor)}</div>
      </div>
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-[2px]">
          <i className="fa-solid fa-turn-up rotate-90 text-[10px]" />
          기본 방어력
        </div>
        <div>+{formatNumber(stat.calculationData.totalAddedArmor)}</div>
      </div>
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-[2px]">
          <i className="fa-solid fa-turn-up rotate-90 text-[10px]" />
          증가된 방어력
        </div>
        <div>{formatNumber(stat.calculationData.totalIncreasedArmor)}%</div>
      </div>
      <hr className="border-dashed border-gray-500" />
      {[
        'totalIncreasedResistanceOfPhysical',
        'totalIncreasedResistanceOfCold',
        'totalIncreasedResistanceOfFire',
        'totalIncreasedResistanceOfLightning',
      ]
        .filter((key) => {
          const data: any = stat.calculationData
          return (
            data[key] + stat.calculationData.totalIncreasedResistanceOfAll > 0
          )
        })
        .map((key) => {
          const data: any = stat.calculationData
          const resist =
            data[key] + stat.calculationData.totalIncreasedResistanceOfAll
          return (
            <div key={createKey()} className="w-full flex justify-between">
              <div>
                {translate(
                  key.replace('totalIncreasedResistanceOf', '').toLowerCase(),
                )}{' '}
                저항
              </div>
              <div>+{formatNumber(resist)}%</div>
            </div>
          )
        })}
    </div>
  )
}
