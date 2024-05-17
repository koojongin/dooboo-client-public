'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import {
  fetchAcceptBaseQuest,
  fetchBaseQuest,
  fetchBaseQuestList,
  fetchCompleteBaseQuest,
  fetchQuestList,
} from '@/services/api-fetch'
import { parseHtml, translate } from '@/services/util'
import {
  BaseQuest,
  Quest,
  QuestPageMenuType,
} from '@/interfaces/quest.interface'
import { Pagination } from '@/interfaces/common.interface'
import {
  QuestContainer,
  RunningStatusChip,
} from '@/app/main/inn/quest/quest-blocks'

export default function QuestPage() {
  const [baseQuests, setBaseQuests] = useState<BaseQuest[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [bqPagination, setBqPagination] = useState<Pagination>()
  const [qPagination, setQPagination] = useState<Pagination>()
  const [selectedMenu, setSelectedMenu] = useState<QuestPageMenuType>()
  const [selectedBaseQuest, setSelectedBaseQuest] = useState<
    BaseQuest & { quest?: Quest }
  >()

  const loadBaseQuests = useCallback(
    // eslint-disable-next-line @typescript-eslint/default-param-last
    async (selectedPage = 1, menuName = selectedMenu) => {
      const result = await fetchBaseQuestList({}, { page: selectedPage })
      setBaseQuests(result.baseQuests)
      setBqPagination({
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      })
    },
    [],
  )

  const loadQuests = useCallback(
    // eslint-disable-next-line @typescript-eslint/default-param-last
    async (selectedPage = 1, menuName = selectedMenu) => {
      let condition: any = {}
      if (QuestPageMenuType.Running === menuName) {
        condition = { isCompleted: false }
      }

      if (QuestPageMenuType.Completed === menuName) {
        condition = { isCompleted: true }
      }

      const result = await fetchQuestList(condition, { page: selectedPage })
      setQuests(result.quests)
      setQPagination({
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      })
    },
    [],
  )

  const loadBaseQuestDetail = useCallback(async (id: string) => {
    const result = await fetchBaseQuest(id)
    setSelectedBaseQuest({ ...result.baseQuest, quest: result.quest })
  }, [])

  const selectMenu = (menuName: QuestPageMenuType) => {
    setBaseQuests([])
    setSelectedBaseQuest(undefined)

    setSelectedMenu(menuName as QuestPageMenuType)
    if (menuName === QuestPageMenuType.All) {
      loadBaseQuests(1, menuName)
    }
    if (
      [QuestPageMenuType.Running, QuestPageMenuType.Completed].includes(
        menuName,
      )
    ) {
      loadQuests(1, menuName)
    }
  }

  const acceptQuest = async (baseQuest: BaseQuest) => {
    if (!baseQuest) return
    const { isConfirmed } = await Swal.fire({
      title: '퀘스트를 수락하시겠습니까?',
      text: baseQuest.name,
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      await fetchAcceptBaseQuest(baseQuest._id!)
      setSelectedBaseQuest(undefined)
      selectMenu(QuestPageMenuType.Running)

      await Swal.fire({
        title: '퀘스트가 수락되었습니다.',
        text: '수락된 퀘스트는 진행중 탭에서 확인할 수 있습니다.',
        icon: 'success',
        confirmButtonText: '예',
        denyButtonText: `닫기`,
      })
    }
  }

  const completeQuest = async (baseQuest: BaseQuest) => {
    if (!baseQuest) return
    const { isConfirmed } = await Swal.fire({
      title: '퀘스트를 완료하시겠습니까?',
      text: baseQuest.name,
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      setQuests([])
      await fetchCompleteBaseQuest(baseQuest._id!)
      setSelectedBaseQuest(undefined)
      loadQuests()

      await Swal.fire({
        title: '퀘스트가 완료되었습니다.',
        text: '완료한 퀘스트는 완료 탭에서 확인할 수 있습니다.',
        icon: 'success',
        confirmButtonText: '예',
        denyButtonText: `닫기`,
      })
    }
  }

  useEffect(() => {
    selectMenu(QuestPageMenuType.All)
  }, [])

  return (
    <div>
      <Card className="rounded p-[8px] w-full min-h-[600px]">
        <div className="flex flex-col">
          <div className="ff-ba-all flex gap-[2px]">
            {Object.keys(QuestPageMenuType as any).map((menuName: string) => {
              return (
                <div
                  key={menuName}
                  onClick={() => {
                    selectMenu(menuName as QuestPageMenuType)
                  }}
                  className={`${selectedMenu === menuName ? 'bg-gray-900' : 'bg-gray-500'} ff-score font-bold text-white shadow px-[8px] py-[4px] text-[18px] cursor-pointer`}
                >
                  {translate(`menu:${menuName}`)}
                </div>
              )
            })}
          </div>
          <div className="ff-ba-all flex min-h-[400px] items-stretch">
            <div className="flex items-stretch shadow-md shadow-gray-400 bg-gray-100">
              <div className="border border-gray-600 w-[400px] min-h-full ff-score-all flex flex-col">
                {/* 전체----------------------------------------------------------------------*/}
                {selectedMenu === QuestPageMenuType.All && (
                  <QuestContainer
                    baseQuestOrQuests={baseQuests}
                    pagination={bqPagination}
                    onClickListItem={loadBaseQuestDetail}
                    onClickPaginationItem={loadBaseQuests}
                  />
                )}
                {/* 진행중,완료----------------------------------------------------------------------*/}
                {[
                  QuestPageMenuType.Running,
                  QuestPageMenuType.Completed,
                ].includes(selectedMenu as QuestPageMenuType) && (
                  <QuestContainer
                    baseQuestOrQuests={quests}
                    pagination={qPagination}
                    onClickListItem={loadBaseQuestDetail}
                    onClickPaginationItem={loadQuests}
                  />
                )}
                {/* ----------------------------------------------------------------------*/}
              </div>
              <div className="ff-ba-all min-h-full border border-gray-600 border-l-0 w-[500px] bg-gray-100">
                {selectedBaseQuest && (
                  <div>
                    {/* <div className="bg-gradient-to-b from-sky-50 via-blue-400 to-sky-600 text-white m-[5px] p-[10px] rounded"> */}
                    <div
                      className="bg-[url(/images/bar_blue.png)] bg-no-repeat m-[5px] text-white p-[10px]"
                      style={{ backgroundSize: '100% 100%' }}
                    >
                      <div className="text-[24px]">
                        {selectedBaseQuest.name}
                      </div>
                      <div className="text-[16px] mt-[8px]">
                        레벨 {selectedBaseQuest.reqLevel} 이상
                      </div>
                    </div>
                    <div className="p-[10px] text-[16px] overflow-y-scroll h-[300px] font-normal">
                      <div className="text-gray-900 leading-[18px]">
                        {parseHtml(selectedBaseQuest.desc)}
                      </div>
                    </div>
                    <div className="flex px-[8px] border-t  border-t-gray-400 py-[4px]">
                      {!selectedBaseQuest.quest && (
                        <div
                          className="ff-ba ff-skew text-[16px] bg-green-500 text-white px-[4px] py-[1px] rounded shadow-md shadow-green-300 cursor-pointer"
                          onClick={() => acceptQuest(selectedBaseQuest)}
                        >
                          퀘스트 수락
                        </div>
                      )}
                      {selectedBaseQuest.quest && (
                        <RunningStatusChip
                          selectedMenu={selectedMenu}
                          baseQuest={selectedBaseQuest}
                          onClick={completeQuest}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
