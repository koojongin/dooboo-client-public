'use client'

import { Card, CardBody, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import {
  fetchGetEnhancedLogList,
  fetchGetMessageLogList,
} from '@/services/api-fetch'
import createKey from '@/services/key-generator'
import {
  ago,
  isExistLoginToken,
  toMMDDHHMMSS,
  translate,
} from '@/services/util'
import {
  MessageLogCategoryKind,
  Pagination,
} from '@/interfaces/common.interface'
import { EnhancedSnapshotBox } from '@/app/main/inn/black-smith/enhanced-result-dialog'
import toAPIHostURL from '@/services/image-name-parser'
import {
  EMIT_CHAT_MESSAGE_EVENT,
  EMIT_ENHANCED_LOG_MESSAGE_EVENT,
  EMIT_PICKUP_LOG_MESSAGE_EVENT,
} from '@/interfaces/chat.interface'
import { socket } from '@/services/socket'
import { GatchaCard } from '@/interfaces/gatcha.interface'

enum SelectMenu {
  MessageLog,
  EnhancedLog,
}
export default function MessagePage() {
  const [messageLogs, setMessageLogs] = useState<any[]>([])
  const [enhancedLogs, setEnhancedLogs] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [selectedMenu, setSelectedMenu] = useState<SelectMenu>(
    SelectMenu.MessageLog,
  )

  const [messageCondition, setMessageCondition] = useState({})

  const loadMessages = useCallback(
    async (selectedPage = 1) => {
      const result = await fetchGetMessageLogList(messageCondition, {
        limit: 20,
        page: selectedPage,
        sort: { createdAt: -1 },
      })

      setMessageLogs(result.messageLogs)
      setPagination({
        page: result.page,
        total: result.total,
        totalPages: result.totalPages,
      })
    },
    [messageCondition],
  )

  const loadEnhancedLogs = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetEnhancedLogList(
      {},
      { limit: 10, page: selectedPage, sort: { createdAt: -1 } },
    )

    setEnhancedLogs(result.enhancedLogs)
    setPagination({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
      limit: result.limit,
    })
  }, [])

  const loadPage = async (page: number) => {
    if (selectedMenu === SelectMenu.MessageLog) {
      loadMessages(page)
    }

    if (selectedMenu === SelectMenu.EnhancedLog) {
      loadEnhancedLogs(page)
    }
  }

  useEffect(() => {
    if (selectedMenu === SelectMenu.MessageLog) {
      loadMessages()
    }
    if (selectedMenu === SelectMenu.EnhancedLog) {
      loadEnhancedLogs()
    }
  }, [loadEnhancedLogs, loadMessages, selectedMenu])

  return (
    <div className="w-full">
      <Card className="rounded p-[10px]">
        <div className="flex items-center mb-[10px] gap-[10px]">
          {Object.keys(SelectMenu)
            .slice(0, Object.values(SelectMenu).length / 2)
            .map((menuKey: SelectMenu | any) => {
              const menu = parseInt(menuKey, 10)
              return (
                <div
                  key={`menu_${menuKey}`}
                  className="ff-nbg text-[20px] border-b-ruliweb border-b-2 pb-[2px] cursor-pointer"
                  onClick={() => {
                    setSelectedMenu(menu)
                  }}
                >
                  {translate(`menu:${SelectMenu[menuKey]}`)}
                  {selectedMenu === menu && (
                    <>({pagination?.total.toLocaleString() || 0})</>
                  )}
                </div>
              )
            })}
        </div>
        <div className="flex flex-col border border-dashed border-gray-600 border-b-0">
          {selectedMenu === SelectMenu.MessageLog && (
            <MessageLogList
              messageLogs={messageLogs}
              setMessageCondition={setMessageCondition}
            />
          )}
          {selectedMenu === SelectMenu.EnhancedLog && (
            <EnhancedLogList
              pagination={pagination}
              enhancedLogs={enhancedLogs}
            />
          )}
        </div>
        <div>
          {pagination && (
            <div className="w-full flex justify-center mt-[15px]">
              <div className="flex gap-[4px] flex-wrap">
                {new Array(pagination.totalPages)
                  .fill(1)
                  .map((value, index) => {
                    return (
                      <div
                        onClick={() => loadPage(index + 1)}
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
      </Card>
    </div>
  )
}

function EnhancedLogList({
  enhancedLogs,
  pagination,
}: {
  enhancedLogs: any[]
  pagination: Pagination | undefined
}) {
  const shareLog = async (enhancedLog: any) => {
    if (!enhancedLog) return
    socket.emit(EMIT_ENHANCED_LOG_MESSAGE_EVENT, { id: enhancedLog._id })
  }

  useEffect(() => {}, [])

  if (!pagination) return <>.</>
  return (
    <>
      {enhancedLogs.map((enhancedLog, index) => {
        const pageIndex =
          pagination.total - (pagination.page - 1) * pagination.limit! - index
        return (
          <div key={`enhancedLog:${enhancedLog._id}`}>
            <div className="flex border-b border-dashed border-b-gray-800 items-stretch">
              <div className="w-[30px] flex items-center justify-center border-r border-r-gray-500">
                {pageIndex}
              </div>
              <div className="w-[100px] flex items-center pl-[4px] border-r border-r-gray-500">
                <Tooltip content={toMMDDHHMMSS(enhancedLog.createdAt)}>
                  {ago(enhancedLog.createdAt)}
                </Tooltip>
              </div>
              <div className="flex items-center min-h-[40px]">
                <div className="p-[2px] flex items-center gap-[4px]">
                  <Tooltip
                    className="bg-transparent p-0"
                    interactive
                    placement="right"
                    content={<EnhancedSnapshotBox enhancedLog={enhancedLog} />}
                  >
                    <div className="flex gap-[4px] cursor-pointer">
                      <div className="w-[36px] h-[36px] border border-gray-600 p-[2px]">
                        <img
                          className="w-full h-full"
                          src={toAPIHostURL(enhancedLog.snapshot.thumbnail)}
                        />
                      </div>
                      <div className="flex items-center">
                        <div>{enhancedLog.snapshot.name}</div>
                        {enhancedLog.snapshot?.starForce > 0 && (
                          <div>+{enhancedLog.snapshot.starForce}</div>
                        )}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div
                className="ml-auto mr-[5px] flex items-center"
                onClick={() => shareLog(enhancedLog)}
              >
                <div className="ff-nbg text-[16px] bg-green-500 text-white flex items-center justify-center w-[50px] rounded cursor-pointer">
                  공유
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

function MessageLogList({
  messageLogs,
  setMessageCondition,
}: {
  messageLogs: any[]
  setMessageCondition: any
}) {
  return (
    <>
      <div className="flex flex-wrap gap-[4px] text-[20px] m-[4px]">
        <div
          className="px-[4px] py-[2px] border border-gray-500 ff-score font-bold cursor-pointer"
          onClick={() => setMessageCondition({})}
        >
          전체
        </div>
        <div
          className="px-[4px] py-[2px] border border-gray-500 ff-score font-bold cursor-pointer"
          onClick={() =>
            setMessageCondition({ category: MessageLogCategoryKind.PickupLog })
          }
        >
          픽업기록
        </div>
      </div>
      {messageLogs.map((messageLog) => {
        return (
          <div key={createKey()}>
            <MessageLogTitleBox messageLog={messageLog} />
          </div>
        )
      })}
    </>
  )
}

function GatchaLogBox({
  messageLog,
}: {
  messageLog: {
    _id: string
    snapshot: { category: string; pickedCards: GatchaCard[] }
  }
}) {
  const { snapshot } = messageLog

  const shareGatchaResult = () => {
    if (!snapshot) return
    socket.emit(EMIT_PICKUP_LOG_MESSAGE_EVENT, {
      messageLogId: messageLog._id,
      cards: snapshot.pickedCards,
    })
  }

  return (
    <>
      <div className="flex flex-col gap-[4px] text-gray-800">
        <div>
          가챠 로그 {snapshot?.pickedCards?.length}회 모집 -{' '}
          {snapshot.category ||
            '알 수 없음(과거 픽업 카테고리 저장 없던 시절 기록)'}
        </div>
        <div className="flex flex-wrap gap-[2px]">
          {snapshot.pickedCards.map((card) => {
            return (
              <Tooltip
                key={createKey()}
                content={translate(`card:${card.name}`)}
                className="bg-gray-800/80"
              >
                <div className="border border-gray-500 rounded overflow-hidden cursor-pointer">
                  <div
                    className="w-[50px] h-[50px] bg-cover bg-no-repeat bg-center p-[2px] bg-clip-content"
                    style={{ backgroundImage: `url(${card.thumbnail})` }}
                  />
                  <div>
                    <div className="flex bg-white/90 items-center justify-center ff-ba text-[16px] pb-[3px]">
                      {new Array(card.starForce).fill(1).map(() => (
                        <img
                          key={createKey()}
                          className="w-[12px] h-[12px]"
                          src="/images/star_on.png"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Tooltip>
            )
          })}
        </div>
      </div>
      <div className="ml-auto mr-[5px] flex items-center">
        <div
          className="ff-nbg text-[16px] bg-green-500 text-white flex items-center justify-center w-[50px] rounded cursor-pointer"
          onClick={() => shareGatchaResult()}
        >
          공유
        </div>
      </div>
    </>
  )
}

function MessageLogTitleBox({ messageLog }: any) {
  return (
    <div className="flex border-b border-dashed border-b-gray-800">
      {messageLog.category === MessageLogCategoryKind.PickupLog && (
        <div className="flex items-center w-full px-[4px] py-[2px]">
          <div className="min-w-[100px]">{ago(messageLog.createdAt)}</div>
          <GatchaLogBox messageLog={messageLog} />
        </div>
      )}
      {messageLog.category === MessageLogCategoryKind.AuctionAdd && (
        <div className="flex items-center w-full px-[4px] py-[2px]">
          <div className="min-w-[100px]">{ago(messageLog.createdAt)}</div>
          <div className="flex gap-[4px] text-ruliweb">
            <div>거래소에 물품을 등록했습니다.</div>
            <div className="">
              [{messageLog.snapshot.auction.snapshot.name}]
            </div>
          </div>
        </div>
      )}
      {messageLog.category === MessageLogCategoryKind.AuctionRetrieve && (
        <div className="flex items-center w-full px-[4px] py-[2px] bg-gray-200">
          <div className="min-w-[100px]">{ago(messageLog.createdAt)}</div>
          <div className="flex gap-[4px] text-gray-800">
            <div>거래소에서 물품을 회수했습니다.</div>
            <div>[{messageLog.snapshot.auction.snapshot.name}]</div>
          </div>
        </div>
      )}
      {messageLog.category === MessageLogCategoryKind.AuctionPurchase && (
        <div className="flex items-center w-full px-[4px] py-[2px] bg-green-200 text-dark-blue">
          <div className="min-w-[100px]">{ago(messageLog.createdAt)}</div>
          <div className="flex gap-[4px]">
            <div>거래소에서 물품을 구매했습니다.</div>
            <div>[{messageLog.snapshot.auction.snapshot.name}]</div>
            <div>
              <span className="text-red-400">
                <div className="flex items-center">
                  <img src="/images/icon_currency.png" className="w-[20px]" />
                  <div>-{messageLog.snapshot.auction.gold.toFixed(0)}</div>
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
      {messageLog.category === MessageLogCategoryKind.AuctionSold && (
        <div className="flex items-center w-full px-[4px] py-[2px] bg-yellow-100">
          <div className="min-w-[100px]">{ago(messageLog.createdAt)}</div>
          <div className="flex gap-[4px]">
            <div>거래소에서 물품이 판매되었습니다.</div>
            <div>[{messageLog.snapshot.auction.snapshot.name}]</div>
            <div className="flex items-center">
              <img src="/images/icon_currency.png" className="w-[20px]" />
              <div>
                +{(messageLog.snapshot.auction.gold * 0.9).toLocaleString()}
              </div>
            </div>
            {messageLog.snapshot.auction?.purchaserNickname && (
              <div className="bg-blue-gray-500 text-white px-[4px]">
                구매자 : {messageLog.snapshot.auction?.purchaserNickname}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
