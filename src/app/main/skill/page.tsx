'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import 'reactflow/dist/style.css'
import { useCallback, useEffect, useState } from 'react'
import createKey from '@/services/key-generator'
import { SkillKind, SkillMeResponse } from '@/interfaces/skill.interface'
import {
  fetchGetMySkill,
  fetchGetSkills,
  fetchLearnSkill,
} from '@/services/api-fetch'
import { translate } from '@/services/util'
import {
  AllSkillResponse,
  JobKind,
  SkillData,
} from '@/interfaces/job.interface'
import { ActiveSkillListBox } from '@/app/main/skill/active-skill-list-box.component'
import {
  JobInformationComponent,
  SkillDetailComponent,
} from '@/app/main/skill/job-information.component'

export default function SkillPage() {
  const [mySkill, setMySkill] = useState<SkillMeResponse>()
  const [allSkills, setAllSkills] = useState<AllSkillResponse>()
  const [myJob, setMyJob] = useState<JobKind>()

  const [selectedSkill, setSelectedSkill] = useState<SkillData>()

  const loadSkills = useCallback(async () => {
    setMyJob(undefined)

    const [resultMe, allSkillResult] = await Promise.all([
      fetchGetMySkill(),
      fetchGetSkills(),
    ])

    setAllSkills(allSkillResult)
    setMyJob(resultMe.job as JobKind)
    setMySkill(resultMe)

    // const selectedSkillSet = result.skills
    //
    // setSkills(
    //   selectedSkillSet.map((skillBox: ISkill) => {
    //     const newSkill: any = { ...skillBox }
    //     newSkill.learn = result.tree[newSkill.name].learn
    //     return newSkill
    //   }),
    // )
  }, [])

  const showDetail = (skill: any) => {
    if (!allSkills || !myJob) return
    const test = allSkills[myJob!].find((s) => s.name === skill.name)
    setSelectedSkill(test!)
  }

  const learnSkill = async (skill: any) => {
    await fetchLearnSkill(skill.name, 1)
    loadSkills()
  }

  const decreaseSkill = async (skill: any) => {
    await fetchLearnSkill(skill.name, -1)
    loadSkills()
  }

  useEffect(() => {
    loadSkills()
  }, [loadSkills])

  return (
    <div className="w-full min-h-[500px] select-none">
      <Card className="rounded w-full p-[10px] h-full">
        {!myJob && (
          <div>
            <JobInformationComponent
              refresh={loadSkills}
              allSkills={allSkills}
            />
          </div>
        )}
        {myJob && mySkill && (
          <div className="text-[24px] flex-col flex gap-[4px]">
            <div className="bg-gradient-to-r from-blue-gray-600/90 to-blue-gray-100/0 w-[800px] text-white px-[10px] py-[0px] ff-gs">
              스킬 페이지
            </div>
            <div>
              <div className="text-red-500 text-[14px]">
                <div>
                  * 주의 : 스킬 칸 우하단의 화살표 클릭 시 바로 습득 됩니다
                </div>
                <div className="text-gray-500">
                  * 1차 전직 스킬포인트는 6~30레벨 구간에서만 획득 할 수
                  있습니다. (총 75포인트)
                </div>
                <div className="text-gray-500">
                  * 1차 전직 스킬포인트는 각 레벨당 3포인트를 얻습니다.
                </div>
              </div>
            </div>

            {/* 액티브 */}
            <ActiveSkillListBox skill={mySkill} refresh={loadSkills} />
            {/* SKILL BOX START */}
            {mySkill && (
              <div className="flex">
                <div className="border-2 border-gray-400 rounded w-[800px]">
                  <div className="bg-gradient-to-t from-[#d9d9d9] to-[#3d3d3d8c] border border-gray-500 shadow-lg shadow-[#C3CBDC] p-[4px] pt-0 py-[8px]">
                    <div className="w-full flex font-bold justify-center items-center text-[14px] py-[8px] text-white">
                      패시브 스킬
                    </div>
                    <div className="flex-col p-[8px] flex rounded bg-white bg-opacity-85">
                      <div className="flex justify-between items-center py-[4px]">
                        <div className="text-[14px]" />
                        <div className="text-[14px] font-bold flex items-center gap-[5px]">
                          <div>남은 스킬 포인트</div>
                          <div className="bg-white text-black text-right w-[45px] px-[2px] py-[1px] rounded border border-gray-400 font-thin">
                            {mySkill.point?.remain}
                          </div>
                        </div>
                      </div>
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
                                    <img
                                      className="w-full h-full"
                                      src={skill?.src}
                                    />
                                  </div>
                                </div>
                                <div
                                  className="w-full border border-l-gray-600 text-[14px] flex flex-col justify-between bg-gray-100 text-gray-700"
                                  onClick={() => showDetail(skill)}
                                >
                                  <div className="ff-dodoom  px-[2px] h-[20px] flex items-center">
                                    {translate(skill?.name)}
                                    {skill?.name === SkillKind.PowerStrike
                                      ? '[삭제 예정]'
                                      : ''}
                                  </div>
                                  <div className="border-b border-dashed border-b-gray-400 w-full" />
                                  <div className="flex items-center justify-between px-[2px] h-[20px] flex items-center">
                                    <div className="ff-dodoom ">
                                      {skill.learn}/{skill.max}
                                    </div>
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
                                  </div>
                                </div>
                              </div>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedSkill && (
              <SkillDetailComponent selectedSkill={selectedSkill} />
            )}
            {/* SKILL BOX END */}
          </div>
        )}
      </Card>
    </div>
  )
}
