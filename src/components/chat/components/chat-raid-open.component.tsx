'use client'

import { Tooltip } from '@material-tailwind/react'
import { toHHMM, toMMDDHHMMSSvDot } from '@/services/util'
import { GatchaResultBoxComponent } from '@/app/main/gatcha/gatcha-result-box.component'
import { GatchaCard } from '@/interfaces/gatcha.interface'

export function ChatRaidOpenComponent({ chatMessage }: { chatMessage: any }) {
  return (
    <div className="bg-gray-200 text-gray-500 flex items-center gap-[4px] break-all pl-[5px] py-[4px] w-full cursor-pointer">
      [{toHHMM(chatMessage.timestamp)}] {chatMessage.message}
    </div>
  )
}
