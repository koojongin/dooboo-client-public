import { useState } from 'react'
import Swal from 'sweetalert2'
import { SkillData } from '@/interfaces/job.interface'
import { translate } from '@/services/util'
import { fetchAdvanceJob } from '@/services/api-fetch'
import createKey from '@/services/key-generator'
import { SkillKind } from '@/interfaces/skill.interface'

export function JobInformationComponent({
  refresh,
  allSkills,
}: {
  refresh: () => void
  allSkills?: { [key: string]: any[] }
}) {
  const [skills, setSkills] = useState<any[]>([])
  const [selectedJobName, setSelectedJobName] = useState<string>()
  const [selectedSkill, setSelectedSkill] = useState<SkillData>()

  const showDetail = (skill: any) => {
    setSelectedSkill(skill)
  }

  const advanceJob = async (jobName: string) => {
    const { isConfirmed } = await Swal.fire({
      title: `${translate(`job:${jobName}`)}로 전직하시겠습니까?`,
      text: '전직은 변경 할 수 없습니다.',
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })
    if (isConfirmed) {
      await fetchAdvanceJob(jobName)
      if (refresh) refresh()
    }
  }

  return (
    <div>
      <div className="text-[30px] flex">
        <div className="bg-gradient-to-r from-blue-gray-600/90 to-blue-gray-100/0 w-[800px] text-white px-[10px] py-[0px] ff-gs">
          직업 선택
        </div>
      </div>
      <div className="mt-[5px] flex flex-col gap-[4px]">
        <div>
          1차 전직은 레벨5 이후로 가능합니다. 전직은 5레벨 이 후에 하더라도,
          스킬포인트를 정상적으로 받을 수 있습니다.
        </div>
        <div>전직은 레벨당 3포인트를 얻을 수 있습니다.</div>
        <div>1차 전직은 30레벨 이전까지 포인트를 획득합니다.</div>
      </div>
      <div>
        <div className="flex items-center gap-[4px]">
          {allSkills &&
            Object.keys(allSkills).map((jobName: string) => {
              return (
                <div
                  key={jobName}
                  className="bg-ruliweb text-white w-[100px] h-[24px] flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    setSkills(allSkills[jobName as any])
                    setSelectedJobName(jobName)
                  }}
                >
                  {translate(`job:${jobName}`)}
                </div>
              )
            })}
        </div>
        <div className="mt-[10px] flex flex-col gap-[4px]">
          {selectedJobName && (
            <div className="text-[24px] flex flex-col gap-[4px]">
              <div className="bg-gradient-to-r from-blue-gray-600/90 to-blue-gray-100/0 w-[800px] text-white px-[10px] py-[0px] ff-gs pt-[5px]">
                {translate(`job:${selectedJobName}`)}
              </div>
              <div className="text-[20px] flex">
                <div
                  className="bg-green-500 text-white px-[10px] py-[2px] rounded cursor-pointer border border-green-800 items-center justify-center shadow-md shadow-green-200"
                  onClick={() => {
                    advanceJob(selectedJobName)
                  }}
                >
                  {translate(`job:${selectedJobName}`)}로 전직하기
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-[6px] flex-wrap w-[762px] bg-white">
            {skills.map((skill) => {
              return (
                <div
                  key={createKey()}
                  className="flex items-stretch border border-gray-600 w-[250px]"
                  onClick={() => showDetail(skill)}
                >
                  <div className="flex items-center justify-center">
                    <div className="min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex items-center justify-center mx-[1px]">
                      <img className="w-full h-full" src={skill?.src} />
                    </div>
                  </div>
                  <div className="w-full border border-l-gray-600 text-[14px] flex flex-col justify-between bg-gray-100 text-gray-700">
                    <div className="ff-dodoom  px-[2px] h-[20px] flex items-center">
                      {translate(skill?.name)}
                    </div>
                    <div className="border-b border-dashed border-b-gray-400 w-full" />
                    <div className="flex items-center justify-between px-[2px] h-[20px] flex items-center">
                      <div className="ff-dodoom ">최대 {skill.max}포인트</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {selectedSkill && (
          <SkillDetailComponent selectedSkill={selectedSkill} />
        )}
      </div>
    </div>
  )
}

export function SkillDetailComponent({
  selectedSkill,
}: {
  selectedSkill: SkillData
}) {
  return (
    <div className="mt-[10px] text-[16px] ff-dodoom-all flex items-start">
      <div className="border border-gray-400 p-[8px] border-r-0 flex gap-[4px] flex-col w-[300px]">
        <div className="flex items-center gap-[4px]">
          <div className="flex items-center justify-center">
            <div className="min-w-[40px] min-h-[40px] w-[40px] h-[40px] flex items-center justify-center mx-[1px]">
              <img className="w-full h-full" src={selectedSkill?.src} />
            </div>
          </div>
          <div>{translate(selectedSkill.name)}</div>
        </div>
        <div>{selectedSkill.desc}</div>
      </div>

      <div className="flex flex-col gap-[4px] border border-gray-400 text-[12px] border-t-0">
        {selectedSkill.info.map((data, index) => {
          return (
            <div
              key={`skill_info_${index}`}
              className="flex items-center border-t border-t-gray-400 p-[4px] flex items-start"
            >
              <div className="min-w-[80px]">레벨: {index + 1}</div>
              <div>
                {selectedSkill.name === SkillKind.PowerStrike && (
                  <div className="flex gap-[2px]">
                    <span>발동 턴의</span>
                    <span className="text-orange-700">
                      총 피해 * ({(1 + data.value / 100).toFixed(2)})의 피해
                    </span>
                    <span>,</span>
                    <span className="text-blue-800">{data?.mp}MP</span>
                    <span>소모,</span>
                    <span>발동확률</span>
                    <span>{data?.rate}%</span>
                  </div>
                )}

                {selectedSkill.name !== SkillKind.PowerStrike && (
                  <div>
                    {selectedSkill.desc} : {data.value}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
