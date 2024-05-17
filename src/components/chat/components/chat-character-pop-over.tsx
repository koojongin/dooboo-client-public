'use client'

import {
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from '@material-tailwind/react'
import { useState } from 'react'
import Link from 'next/link'
import { ConnectedCharacter } from '@/components/chat/components/chat.types'

export function ChatCharacterPopOver({
  child,
  onClickCall,
  connectedCharacter,
}: {
  connectedCharacter: ConnectedCharacter
  child: any
  onClickCall: () => void
}) {
  const [openPopover, setOpenPopover] = useState<boolean>(false)

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  }
  return (
    <Popover handler={setOpenPopover} open={openPopover} placement="left">
      <PopoverHandler>{child}</PopoverHandler>
      <PopoverContent className="rounded-none bg-transparent shadow-none text-gray-700 min-h-[100px] p-0 border-0">
        <div className="rounded shadow-md shadow-gray-600 overflow-hidden border-gray-300 border bg-white">
          <div className="ff-skew w-full bg-gray-600 text-white ff-ba text-[20px] flex justify-center items-center py-[4px] min-w-[150px]">
            {connectedCharacter.nickname}
          </div>
          <div className="flex flex-col gap-[10px] [&_div]:cursor-pointer p-[10px]">
            <div>
              <Link href={`/main/profile/${connectedCharacter.characterId}`}>
                <Tooltip content="컨트롤 + 클릭 시 새 창으로 이동">
                  <div className="ff-ba ff-skew">프로필 보기</div>
                </Tooltip>
              </Link>
            </div>

            <div onClick={onClickCall} className="ff-ba ff-skew">
              호출하기
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
