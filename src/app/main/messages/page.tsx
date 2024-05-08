'use client'

import { Card, CardBody } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { fetchGetMessageLogList } from '@/services/api-fetch'
import createKey from '@/services/key-generator'
import { ago, isExistLoginToken } from '@/services/util'
import {
  MessageLogCategoryKind,
  Pagination,
} from '@/interfaces/common.interface'

export default function MessagePage() {
  const [messageLogs, setMessageLogs] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>()

  const loadMessages = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetMessageLogList(
      {},
      { limit: 20, page: selectedPage, sort: { createdAt: -1 } },
    )

    setMessageLogs(result.messageLogs)
    setPagination({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    })
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])
  return (
    <div className="w-full">
      <Card className="rounded p-[10px]">
        <div className="flex items-center mb-[10px]">
          <div className="ff-nbg text-[20px] border-b-ruliweb border-b-2 pb-[2px] cursor-pointer">
            쪽지 목록({pagination?.total.toLocaleString() || 0})
          </div>
        </div>
        <div className="flex flex-col border border-dashed border-gray-600 border-b-0">
          {messageLogs.map((messageLog) => {
            return (
              <div key={createKey()}>
                <MessageLogTitleBox messageLog={messageLog} />
              </div>
            )
          })}
        </div>
        <div>
          {pagination && (
            <div className="w-full flex justify-center mt-[15px]">
              <div className="flex gap-[4px]">
                {new Array(pagination.totalPages)
                  .fill(1)
                  .map((value, index) => {
                    return (
                      <div
                        onClick={() => loadMessages(index + 1)}
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

function MessageLogTitleBox({ messageLog }: any) {
  // MessageLogCategoryKind
  return (
    <div className="flex border-b border-dashed border-b-gray-800">
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
