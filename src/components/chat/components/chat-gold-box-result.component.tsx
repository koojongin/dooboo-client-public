'use client'

import { Tooltip } from '@material-tailwind/react'
import { toHHMM } from '@/services/util'
import { EnhancedSnapshotBox } from '@/app/main/inn/black-smith/enhanced-result-dialog'
import { EnhancedLogBoxComponent } from '@/components/chat/enhanced-log-box.component'

export function ChatGoldBoxResultComponent({
  chatMessage,
}: {
  chatMessage: any
}) {
  const { systemLog } = chatMessage
  return (
    <div className="break-all pl-[5px] py-[4px] w-full border-t border-dashed border-b border-amber-800 cursor-pointer">
      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
      <span className="bg-[#245a7e] text-white px-[2px] rounded text-[16px] font-bold ff-score">
        {chatMessage.nickname}
      </span>
      님이{' '}
      <span className="bg-[#245a7e] text-white px-[2px] rounded text-[16px] font-bold ff-score">
        {systemLog.snapshot?.from}
      </span>
      를 개봉하여{' '}
      <span className="bg-yellow-600 text-white px-[2px] text-[16px] rounded font-bold ff-score">
        {systemLog?.snapshot?.gold.toLocaleString()}골드
      </span>
      를 획득하셨습니다.
    </div>
  )
}
