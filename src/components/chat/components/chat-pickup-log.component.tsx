'use client'

import { Tooltip } from '@material-tailwind/react'
import { toHHMM, toMMDDHHMMSSvDot } from '@/services/util'
import { GatchaResultBoxComponent } from '@/app/main/gatcha/gatcha-result-box.component'
import { GatchaCard } from '@/interfaces/gatcha.interface'
import { MongooseDocument } from '@/interfaces/common.interface'

export function ChatPickupLogComponent({ chatMessage }: { chatMessage: any }) {
  const {
    cards,
    messageLog,
  }: { messageLog?: MongooseDocument & any; cards: GatchaCard[] } = chatMessage
  return (
    <div className="flex items-center gap-[4px] break-all pl-[5px] py-[4px] w-full cursor-pointer">
      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
      {`${chatMessage.nickname}: `}
      <Tooltip
        className="bg-transparent p-0"
        interactive
        placement="left"
        content={
          <div className="relative border border-gray-300 shadow-lg shadow-gray-600 rounded overflow-hidden">
            <GatchaResultBoxComponent cards={cards} />
            <div className="absolute z-[5] right-0 bottom-0 m-[10px] bg-white text-ruliweb">
              <div className="p-[1px] border border-gray-600 rounded">
                <div className="border border-gray-600 ff-score font-bold bg-sky-500 text-white px-[5px]">
                  {chatMessage.nickname} -{' '}
                  {toMMDDHHMMSSvDot(
                    messageLog ? messageLog.createdAt : chatMessage.timestamp,
                  )}
                  {messageLog?.snapshot
                    ? ` - ${messageLog?.snapshot.category || ''}`
                    : ''}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="p-[1px] border border-gray-600 rounded">
          <div className="border border-gray-600 ff-score font-bold bg-sky-600 text-white px-[5px]">
            모집 공유됨
          </div>
        </div>
      </Tooltip>
    </div>
  )
}
