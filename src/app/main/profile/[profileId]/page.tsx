'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@material-tailwind/react'
import { CharacterStatBoxComponent } from '@/app/main/inn/stash/character-stat-box.component'
import { MeResponse } from '@/interfaces/user.interface'
import { fetchGetCharacterById, fetchGetSkills } from '@/services/api-fetch'
import { ItemEquipmentBoxComponent } from '@/app/main/inn/stash/item-equipment-box.component'
import { SkillMeResponse } from '@/interfaces/skill.interface'
import { AllSkillResponse, JobKind } from '@/interfaces/job.interface'
import { fetchCharacterSkill } from '@/services/api/api.skill'
import { ActiveSkillListBox } from '@/app/main/skill/active-skill-list-box.component'
import { PassiveSkillListBoxComponent } from '@/app/main/skill/passive-skill-list-box.component'
import { ago, toMMDDHHMMSS } from '@/services/util'

export default function ProfilePage({
  params,
}: {
  params: { profileId: string }
}) {
  const [characterData, setCharacterData] = useState<MeResponse>()
  const refreshCharacterData = useCallback(async () => {
    const result = await fetchGetCharacterById(params.profileId)
    setCharacterData(result)
  }, [params.profileId])

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
    refreshCharacterData()
    loadSkills()
  }, [loadSkills, refreshCharacterData])
  return (
    <div>
      {characterData && (
        <div className="flex gap-[3px] items-start justify-start">
          <div className="flex flex-col gap-[4px] items-start">
            <CharacterStatBoxComponent
              meResponse={characterData}
              disableExperience
              disableProfileThumbnail
              className="min-w-[300px]"
              refresh={refreshCharacterData}
            />
            <Card className="flex p-[10px] rounded items-start w-full">
              <ItemEquipmentBoxComponent
                readonly
                meResponse={characterData}
                refresh={refreshCharacterData}
              />
            </Card>
            <Card className="flex p-[10px] rounded items-start w-full">
              {characterData.character.lastEarnedAt && (
                <div className="flex items-center justify-between w-full">
                  <div className="min-w-[70px]">최근 전투</div>
                  <div>
                    {toMMDDHHMMSS(characterData.character.lastEarnedAt!)} [
                    {ago(characterData.character.lastEarnedAt!)}]
                  </div>
                </div>
              )}
            </Card>
          </div>
          {myJob && (
            <Card className="rounded p-[10px] h-full">
              {myJob && mySkill && (
                <div className="text-[24px] flex-col flex gap-[4px]">
                  <ActiveSkillListBox
                    skill={mySkill}
                    refresh={loadSkills}
                    readonly
                    showOnlyUsing
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
          )}
        </div>
      )}
    </div>
  )
}
