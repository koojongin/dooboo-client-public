import { Tooltip } from '@material-tailwind/react'
import { SkillMeResponse } from '@/interfaces/skill.interface'
import { fetchPutChangeActiveSkill } from '@/services/api/api.skill'
import { ActiveSkill } from '@/services/skill/skill'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'

export function ActiveSkillListBox({
  refresh,
  skill,
  readonly,
  showOnlyUsing,
}: {
  skill: SkillMeResponse
  refresh: () => Promise<void>
  readonly?: boolean
  showOnlyUsing?: boolean
}) {
  const { activeSkill, activeSkills } = skill
  let filterdActiveSkills = activeSkills
  if (showOnlyUsing) {
    filterdActiveSkills = activeSkills.filter(
      (aSkill) => aSkill.name === activeSkill,
    )
  }
  const clickActiveSkill = async (aSkill: ActiveSkill) => {
    if (readonly) return
    await fetchPutChangeActiveSkill(aSkill.name)
    await refresh()
  }
  return (
    <div className="border-2 border-gray-400 rounded w-[800px]">
      <div className="bg-gradient-to-t from-[#c83120eb] to-[#12062fcf] border border-gray-500 shadow-lg shadow-[#C3CBDC] p-[4px] pt-0 py-[8px]">
        <div className="w-full flex flex-col font-bold justify-center items-center text-[14px] py-[8px] text-white">
          <div>액티브 스킬</div>
          <Tooltip
            className="bg-white/95 border border-blue-950 shadow-md shadow-blue-200/50"
            content={
              <div className="flex flex-col text-black">
                <div className="text-[20px]">
                  최종 피해량은 [무기 총 피해량] * [스킬 피해량] 으로
                  계산됩니다.
                </div>
                <div>* 무기 총 피해량 : 기본(+)피해 * 증가피해(%)</div>
                <div>* 스킬 피해량이 1000%라면 10배의 피해를 줍니다.</div>
              </div>
            }
            interactive
          >
            <div className="text-[12px] cursor-pointer ff-score font-bold">
              * 액티브 스킬은 기본 무기 피해량에 기반하여 피해가 증폭됩니다.
            </div>
          </Tooltip>
        </div>
        <div className="flex-col p-[8px] flex rounded bg-white gap-[2px] cursor-pointer">
          {filterdActiveSkills.map((aSkill, index, array) => {
            return (
              <ActiveSkillBox
                key={createKey()}
                skill={aSkill}
                isSelected={aSkill.name === activeSkill}
                onClick={clickActiveSkill}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ActiveSkillBox({
  skill,
  onClick,
  isSelected,
}: {
  skill: ActiveSkill
  onClick: (skill: ActiveSkill) => void
  isSelected: boolean
}) {
  return (
    <Tooltip content={<div>{skill.desc}</div>}>
      <div
        className="flex items-center border gap-[4px] p-[4px]"
        onClick={() => onClick(skill)}
      >
        <div
          className="w-[36px] h-[36px] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url('${skill.icon}')` }}
        />
        <div className="flex items-center w-full">
          <div>
            <div className="ff-score font-bold text-[14px]">
              {translate(`skill:${skill.name}`)} | mp:{skill.mp} | 피해:
              {skill.damageData.Multiplier?.toLocaleString()}% | 최대 타격수:{' '}
              {skill.damageData.maxHitCount}
            </div>
            <div className="flex gap-[2px]">
              {skill.tags.map((tagName) => {
                return (
                  <div
                    key={createKey()}
                    className="text-[12px] border border-gray-500 px-[4px] bg-gray-500 text-white"
                  >
                    {translate(`skill-tag:${tagName}`)}
                  </div>
                )
              })}
            </div>
          </div>
          {isSelected && (
            <div className="ml-auto ff-score font-bold text-[14px] bg-cyan-700 text-white rounded p-[4px]">
              사용중
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  )
}
