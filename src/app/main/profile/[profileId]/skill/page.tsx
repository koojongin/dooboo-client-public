'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@material-tailwind/react'
import { ActiveSkillListBox } from '@/app/main/skill/active-skill-list-box.component'
import { PassiveSkillListBoxComponent } from '@/app/main/skill/passive-skill-list-box.component'
import { SkillMeResponse } from '@/interfaces/skill.interface'
import { AllSkillResponse, JobKind } from '@/interfaces/job.interface'
import { fetchCharacterSkill } from '@/services/api/api.skill'
import { fetchGetSkills } from '@/services/api-fetch'
export default function ProfileSkillPage({
  params,
}: {
  params: { profileId: string }
}) {
  const [mySkill, setMySkill] = useState<SkillMeResponse>()
  const [allSkills, setAllSkills] = useState<AllSkillResponse>()
  const [myJob, setMyJob] = useState<JobKind>()

  const loadSkills = useCallback(async () => {
    setMyJob(undefined)

    const [resultMe, allSkillResult] = await Promise.all([
      fetchCharacterSkill(params.profileId),
      fetchGetSkills(),
    ])

    setAllSkills(allSkillResult)
    setMyJob(resultMe.job as JobKind)
    setMySkill(resultMe)
  }, [params.profileId])

  useEffect(() => {
    loadSkills()
  }, [loadSkills])
  return (
    <Card className="rounded w-full p-[10px] h-full">
      {!myJob && <div>현재 선택된 직업이 없습니다.</div>}
      {myJob && mySkill && (
        <div className="text-[24px] flex-col flex gap-[4px]">
          <ActiveSkillListBox
            showOnlyUsing
            skill={mySkill}
            refresh={loadSkills}
            readonly
          />
          {mySkill && allSkills && (
            <PassiveSkillListBoxComponent
              allSkills={allSkills}
              refresh={loadSkills}
              job={myJob}
              mySkill={mySkill}
              readonly
            />
          )}
        </div>
      )}
    </Card>
  )
}
