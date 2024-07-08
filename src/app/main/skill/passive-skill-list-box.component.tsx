import { useState } from 'react'
import { Tooltip } from '@material-tailwind/react'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'
import { SkillKind, SkillMeResponse } from '@/interfaces/skill.interface'
import { fetchLearnSkill } from '@/services/api-fetch'
import {
  AllSkillResponse,
  JobKind,
  SkillData,
} from '@/interfaces/job.interface'
import { SkillDetailComponent } from '@/app/main/skill/job-information.component'

export function PassiveSkillListBoxComponent({
  allSkills,
  refresh,
  job,
  mySkill,
  readonly,
}: {
  allSkills: AllSkillResponse
  refresh: () => Promise<void>
  job: JobKind
  mySkill: SkillMeResponse
  readonly?: boolean
}) {
  const [selectedSkill, setSelectedSkill] = useState<SkillData>()
  const showDetail = (skill: any) => {
    if (!allSkills || !job) return
    const test = allSkills[job!].find((s) => s.name === skill.name)
    setSelectedSkill(test!)
  }

  const learnSkill = async (skill: any) => {
    await fetchLearnSkill(skill.name, 1)
    await refresh()
  }

  const decreaseSkill = async (skill: any) => {
    await fetchLearnSkill(skill.name, -1)
    await refresh()
  }
  return (
    <div className="flex">
      <div className="border-2 border-gray-400 rounded w-[800px]">
        <div className="bg-gradient-to-t from-[#d9d9d9] to-[#3d3d3d8c] border border-gray-500 shadow-lg shadow-[#C3CBDC] p-[4px] pt-0 py-[8px]">
          <div className="w-full flex font-bold justify-center items-center text-[14px] py-[8px] text-white">
            패시브 스킬
          </div>
          <div className="flex-col p-[8px] flex rounded bg-white bg-opacity-85">
            {!readonly && (
              <div className="flex justify-between items-center py-[4px]">
                <div className="text-[14px]" />
                <div className="text-[14px] font-bold flex items-center gap-[5px]">
                  <div>남은 스킬 포인트</div>
                  <div className="bg-white text-black text-right w-[45px] px-[2px] py-[1px] rounded border border-gray-400 font-thin">
                    {mySkill.point?.remain}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-[6px] flex-wrap bg-white justify-between">
              {Object.keys(mySkill.tree).map((skillName) => {
                const skill = mySkill.tree[skillName]
                return (
                  <Tooltip
                    placement="right"
                    key={createKey()}
                    content={skill.desc}
                  >
                    <div className="flex items-stretch border border-gray-600 w-[250px]">
                      <div className="flex items-center justify-center">
                        <div className="min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex items-center justify-center mx-[1px]">
                          <img className="w-full h-full" src={skill?.src} />
                        </div>
                      </div>
                      <div
                        className="w-full border border-l-gray-600 text-[14px] flex flex-col justify-between bg-gray-100 text-gray-700"
                        onClick={() => showDetail(skill)}
                      >
                        <div className="ff-dodoom  px-[2px] h-[20px] flex items-center">
                          {translate(`skill:${skill?.name}`)}
                          {skill?.name === SkillKind.PowerStrike
                            ? '[삭제 예정]'
                            : ''}
                        </div>
                        <div className="border-b border-dashed border-b-gray-400 w-full" />
                        <div className="flex items-center justify-between px-[2px] h-[20px]">
                          <div className="ff-dodoom ">
                            {skill.learn}/{skill.max}
                          </div>
                          {!readonly && (
                            <div className="flex items-center gap-[3px]">
                              <div
                                className="bg-gradient-to-b to-green-400 shadow-md from-green-400/80 text-white rounded overflow-hidden border border-gray-600 w-[18px] h-[18px] flex items-center justify-center"
                                onClick={() => {
                                  learnSkill(skill)
                                }}
                              >
                                <i className="fa-solid fa-caret-up cursor-pointer" />
                              </div>
                              <div
                                className="bg-gradient-to-b to-red-400 from-red-400/80 shadow-md text-white rounded overflow-hidden border border-gray-600 w-[18px] h-[18px] flex items-center justify-center"
                                onClick={() => {
                                  decreaseSkill(skill)
                                }}
                              >
                                <i className="fa-solid fa-caret-down cursor-pointer" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                )
              })}
            </div>
          </div>
          {selectedSkill && !readonly && (
            <SkillDetailComponent selectedSkill={selectedSkill} />
          )}
        </div>
      </div>
    </div>
  )
}
