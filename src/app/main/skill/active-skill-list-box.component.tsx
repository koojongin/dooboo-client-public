import { Tooltip } from '@material-tailwind/react'
import { SkillMeResponse } from '@/interfaces/skill.interface'
import { fetchPutChangeActiveSkill } from '@/services/api/api.skill'
import { ActiveSkill, activeSkills } from '@/services/skill/skill'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'

export function ActiveSkillListBox({
  refresh,
  skill,
}: {
  skill: SkillMeResponse
  refresh: () => Promise<void>
}) {
  const { activeSkill } = skill
  const clickActiveSkill = async (aSkill: ActiveSkill) => {
    await fetchPutChangeActiveSkill(aSkill.name)
    await refresh()
  }
  return (
    <div className="border-2 border-gray-400 rounded w-[800px]">
      <div className="bg-gradient-to-t from-[#c83120eb] to-[#f00a0a4a] border border-gray-500 shadow-lg shadow-[#C3CBDC] p-[4px] pt-0 py-[8px]">
        <div className="w-full flex font-bold justify-center items-center text-[14px] py-[8px] text-white">
          액티브 스킬
        </div>
        <div className="flex-col p-[8px] flex rounded bg-white gap-[2px] cursor-pointer">
          {activeSkills.map((aSkill, index, array) => {
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
              {translate(`skill:${skill.name}`)}
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
