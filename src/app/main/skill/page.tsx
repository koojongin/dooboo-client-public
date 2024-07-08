'use client'

import { Card } from '@material-tailwind/react'
import 'reactflow/dist/style.css'
import { useCallback, useEffect, useState } from 'react'
import { SkillMeResponse } from '@/interfaces/skill.interface'
import { fetchGetMySkill, fetchGetSkills } from '@/services/api-fetch'
import { AllSkillResponse, JobKind } from '@/interfaces/job.interface'
import { ActiveSkillListBox } from '@/app/main/skill/active-skill-list-box.component'
import { JobInformationComponent } from '@/app/main/skill/job-information.component'
import { PassiveSkillListBoxComponent } from '@/app/main/skill/passive-skill-list-box.component'

export default function SkillPage() {
  const [mySkill, setMySkill] = useState<SkillMeResponse>()
  const [allSkills, setAllSkills] = useState<AllSkillResponse>()
  const [myJob, setMyJob] = useState<JobKind>()
  const loadSkills = useCallback(async () => {
    setMyJob(undefined)

    const [resultMe, allSkillResult] = await Promise.all([
      fetchGetMySkill(),
      fetchGetSkills(),
    ])

    setAllSkills(allSkillResult)
    setMyJob(resultMe.job as JobKind)
    setMySkill(resultMe)
  }, [])

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

            <ActiveSkillListBox skill={mySkill} refresh={loadSkills} />
            {mySkill && allSkills && (
              <PassiveSkillListBoxComponent
                allSkills={allSkills}
                refresh={loadSkills}
                job={myJob}
                mySkill={mySkill}
              />
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
