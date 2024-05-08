import {
  BaseQuest,
  Quest,
  QuestPageMenuType,
} from '@/interfaces/quest.interface'
import { toMMDDHHMMSS } from '@/services/util'
import createKey from '@/services/key-generator'
import { Pagination } from '@/interfaces/common.interface'

export function QuestContainer({
  baseQuestOrQuests,
  pagination,
  onClickListItem,
  onClickPaginationItem,
}: {
  baseQuestOrQuests: Array<BaseQuest | Quest>
  pagination: Pagination | undefined
  onClickListItem: (param: any) => void
  onClickPaginationItem: (param: any) => void
}) {
  return (
    <>
      <div className="overflow-y-scroll h-full">
        {baseQuestOrQuests.length === 0 && <EmptyQuestBlock />}
        <QuestList
          onClick={onClickListItem}
          baseQuestOrQuests={baseQuestOrQuests}
        />
      </div>
      <QuestListPagination
        pagination={pagination}
        onClick={onClickPaginationItem}
      />
    </>
  )
}

export function QuestListPagination({
  pagination,
  onClick,
}: {
  pagination: Pagination | undefined
  onClick: (param: any) => void
}) {
  return (
    <div className="min-h-[27px] flex items-center px-[8px] border-t border-t-gray-400">
      {pagination && (
        <div className="w-full flex justify-center">
          <div className="flex gap-[4px]">
            {new Array(pagination.totalPages).fill(1).map((value, index) => {
              return (
                <div
                  onClick={() => onClick(index + 1)}
                  className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                  key={createKey()}
                >
                  {index + 1}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function QuestList({
  baseQuestOrQuests,
  onClick,
}: {
  baseQuestOrQuests: Array<BaseQuest | Quest>
  onClick: (param: string) => void
}) {
  if (!baseQuestOrQuests[0]) return <></>
  const isQuest = (baseQuestOrQuests[0] as any).baseQuest
  const isBaseQuest = !isQuest
  let quests: Quest[] = []
  quests = baseQuestOrQuests as Quest[]
  if (isBaseQuest) {
    quests = baseQuestOrQuests.map((baseQuest) => {
      return {
        snapshot: {},
        baseQuest,
      }
    }) as Quest[]
  }

  return (
    <>
      {quests.map((quest) => {
        return (
          <div
            key={quest.baseQuest._id}
            className="border-b border-b-gray-500 border-dashed text-[16px] hover:bg-white hover:text-blue-800 cursor-pointer flex py-[5px] px-[5px]"
            onClick={() => {
              onClick(quest.baseQuest._id!)
            }}
          >
            <QuestTitle baseQuest={quest.baseQuest} />
          </div>
        )
      })}
    </>
  )
}

export function EmptyQuestBlock() {
  return <div className="p-[10px]">퀘스트가 없습니다.</div>
}

export function QuestTitle({ baseQuest }: { baseQuest: BaseQuest }) {
  return (
    <div className="flex items-center gap-[2px]">
      <div>•</div>
      <div>{baseQuest.name}</div>
    </div>
  )
}

export function RunningStatusChip({
  selectedMenu,
  baseQuest,
  onClick,
}: {
  selectedMenu: QuestPageMenuType | undefined
  baseQuest: BaseQuest
  onClick?: (param: any) => void
}) {
  const isRunning = baseQuest.quest && !baseQuest.quest.isCompleted
  const isCompleted = baseQuest.quest && baseQuest.quest.isCompleted

  if (!selectedMenu) return <>선택된 메뉴없음</>
  return (
    <>
      {isRunning && (
        <div className="ff-ba ff-skew text-[16px] bg-gray-800 text-white px-[4px] py-[1px] rounded">
          진행중인 퀘스트
        </div>
      )}
      {isCompleted && (
        <div className="ff-ba ff-skew text-[16px] bg-gray-400 text-white px-[4px] py-[1px] rounded">
          완료일시 - {toMMDDHHMMSS(baseQuest.quest!.completedAt)}
        </div>
      )}
      {selectedMenu === QuestPageMenuType.Running && (
        <div
          className="ml-auto ff-ba ff-skew text-[16px] bg-red-400 text-white px-[4px] py-[1px] rounded shadow-md shadow-red-300 cursor-pointer"
          onClick={() => {
            if (onClick) onClick(baseQuest)
          }}
        >
          퀘스트 완료
        </div>
      )}
    </>
  )
}
