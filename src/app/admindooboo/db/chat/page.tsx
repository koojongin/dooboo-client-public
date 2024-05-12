'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, Tooltip } from '@material-tailwind/react'
import { fetchGetChatMessageList } from '@/services/api-admin-fetch'
import { toMMDDHHMM, toMMDDHHMMSS } from '@/services/util'
import createKey from '@/services/key-generator'
import { Pagination } from '@/interfaces/common.interface'
import ItemBoxComponent from '@/components/item/item-box'
import { EnhancedLogBoxComponent } from '@/components/chat/enhanced-log-box.component'
import { EnhancedSnapshotBox } from '@/app/main/inn/black-smith/enhanced-result-dialog'

export default function AdminChatListPage() {
  const [pagination, setPagination] = useState<Pagination>()
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const loadChatMessages = useCallback(async (selectedPage = 1) => {
    const result = await fetchGetChatMessageList(
      {},
      { limit: 20, page: selectedPage },
    )

    setChatMessages(result.chatMessages)
    setPagination({
      page: result.page,
      total: result.total,
      totalPages: result.totalPages,
    })
  }, [])

  useEffect(() => {
    loadChatMessages()
  }, [loadChatMessages])
  return (
    <div>
      <Card className="rounded">
        <div className="p-[10px]">
          {chatMessages.map((chatMessage) => {
            return (
              <div
                key={chatMessage._id}
                className="flex border-b border-b-gray-400 px-[4px] py-[2px] items-center"
              >
                <div className="w-[130px] text-[14px]">
                  {toMMDDHHMMSS(chatMessage.createdAt)}
                </div>
                <div className="w-[120px]">{chatMessage.owner?.nickname}</div>
                {chatMessage.snapshot?.message && (
                  <div>{chatMessage.snapshot?.message}</div>
                )}
                {!chatMessage.snapshot?.message && (
                  <div>
                    {chatMessage.snapshot?.originWeaponId && (
                      <Tooltip
                        className="bg-transparent p-0"
                        interactive
                        placement="right"
                        content={
                          <EnhancedSnapshotBox
                            enhancedLog={chatMessage.snapshot}
                          />
                        }
                      >
                        <div>
                          <EnhancedLogBoxComponent
                            enhancedLog={chatMessage.snapshot}
                          />
                        </div>
                      </Tooltip>
                    )}
                    {!chatMessage.snapshot?.originWeaponId && (
                      <ItemBoxComponent
                        item={chatMessage.snapshot}
                        className=""
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div>
          {pagination && (
            <div className="w-full flex justify-start mt-[15px]">
              <div className="flex gap-[4px]">
                {new Array(pagination.totalPages)
                  .fill(1)
                  .map((value, index) => {
                    return (
                      <div
                        className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                        onClick={() => loadChatMessages(index + 1)}
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
