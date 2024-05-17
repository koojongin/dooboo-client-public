'use client'

import { Tooltip } from '@material-tailwind/react'
import { toHHMM } from '@/services/util'
import { EnhancedSnapshotBox } from '@/app/main/inn/black-smith/enhanced-result-dialog'
import { EnhancedLogBoxComponent } from '@/components/chat/enhanced-log-box.component'

export function ChatEnhancedLogComponent({
  chatMessage,
}: {
  chatMessage: any
}) {
  return (
    <div className="break-all pl-[5px] py-[4px] w-full border-t border-dashed border-b border-amber-800 cursor-pointer">
      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
      {`${chatMessage.nickname}: `}
      <Tooltip
        className="bg-transparent p-0"
        interactive
        placement="right"
        content={<EnhancedSnapshotBox enhancedLog={chatMessage.enhancedLog} />}
      >
        <div>
          <EnhancedLogBoxComponent enhancedLog={chatMessage.enhancedLog} />
        </div>
      </Tooltip>
    </div>
  )
}
