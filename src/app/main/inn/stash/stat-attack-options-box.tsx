import { Tooltip } from '@material-tailwind/react'
import { CharacterStat } from '@/interfaces/user.interface'
import { formatNumber, translate } from '@/services/util'
import createKey from '@/services/key-generator'

export function StatAttackOptionsBox({ stat }: { stat: CharacterStat }) {
  const dps =
    stat.damage *
    stat.attackSpeed *
    (1 + (stat.criticalMultiplier / 100) * (stat.criticalRate / 100))
  return (
    <div className="flex flex-col gap-[2px]">
      <div className="w-full flex justify-between">
        <Tooltip content="최대 공격 속도는 2를 넘을수 없습니다.">
          <div className="cursor-pointer">
            공격 속도
            <i className="fa-regular fa-circle-question" />
          </div>
        </Tooltip>
        <div>{formatNumber(stat.attackSpeed)}</div>
      </div>
      <hr className="border-dashed border-gray-500" />
      {[
        'addedDamageOfAxe',
        'addedDamageOfSword',
        'addedDamageOfDagger',
        'addedDamageOfBow',
        'addedDamageOfBlunt',
        'addedDamageOfSpear',
        'addedDamageOfGun',
        'addedDamageOfCannon',
        'addedDamageOfClaw',
      ]
        .filter((key) => {
          const data: any = stat.calculationData || {}
          return data[key] > 0
        })
        .map((key) => {
          const data: any = stat.calculationData || {}
          return (
            <div className="w-full flex justify-between" key={createKey()}>
              <div>
                기본 {translate(key.replace('addedDamageOf', '').toLowerCase())}{' '}
                피해
              </div>
              <div>+{data[key]}</div>
            </div>
          )
        })}
      <hr className="border-dashed border-gray-500" />
      <div className="w-full flex justify-between">
        <div>기본 물리 피해</div>
        <div>{stat.damageOfPhysical}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>기본 화염 피해</div>
        <div>{stat.damageOfFire}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>기본 냉기 피해</div>
        <div>{stat.damageOfCold}</div>
      </div>
      <div className="w-full flex justify-between">
        <div>기본 번개 피해</div>
        <div>{stat.damageOfLightning}</div>
      </div>
      <hr className="border-dashed border-gray-500" />
      <div className="w-full flex justify-between">
        <div>물리 피해</div>
        <div>+{stat.totalIncreasedPhysical}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>냉기 피해</div>
        <div>+{stat.totalIncreasedCold}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>번개 피해</div>
        <div>+{stat.totalIncreasedLightning}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>화염 피해</div>
        <div>+{stat.totalIncreasedFire}%</div>
      </div>
      <hr className="border-dashed border-gray-500" />
      <div className="w-full flex justify-between">
        <div>물리 스킬 피해</div>
        <div>+{stat.damageOfPhysicalWithSkill}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>냉기 스킬 피해</div>
        <div>+{stat.damageOfColdWithSkill}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>번개 스킬 피해</div>
        <div>+{stat.damageOfLightningWithSkill}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>화염 스킬 피해</div>
        <div>+{stat.damageOfFireWithSkill}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>공격 스킬 피해</div>
        <div>+{stat.damageOfAttackWithSkill}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>마법 스킬 피해</div>
        <div>+{stat.damageOfSpellWithSkill}%</div>
      </div>
      <hr className="border-dashed border-gray-500" />
      <div className="w-full flex justify-between">
        <div>치명타 확률</div>
        <div>{stat.criticalRate.toFixed(2)}%</div>
      </div>
      <div className="w-full flex justify-between">
        <div>치명타 배율</div>
        <div>+{stat.criticalMultiplier}%</div>
      </div>
      <hr className="border-dashed border-gray-500" />
      <div className="w-full flex justify-between">
        <Tooltip content="예측 피해량은 공격 속도와 치명타 속성이 적용되어 있지 않습니다.">
          <div className="flex items-center gap-[4px]">
            <div>예측 단일 피해량</div>
            <i className="fa-regular fa-circle-question" />
          </div>
        </Tooltip>
        <Tooltip content={stat.damage}>
          <div>+{formatNumber(stat.damage)}</div>
        </Tooltip>
      </div>
      <div className="w-full flex justify-between">
        <Tooltip content="예측 DPS는 예측 피해량에 공격속도, 치명타 속성이 적용된 값입니다.">
          <div className="flex items-center gap-[4px]">
            <div>예측 DPS</div>
            <i className="fa-regular fa-circle-question" />
          </div>
        </Tooltip>
        <Tooltip content={dps}>
          <div>+{formatNumber(dps)}</div>
        </Tooltip>
      </div>
    </div>
  )
}
