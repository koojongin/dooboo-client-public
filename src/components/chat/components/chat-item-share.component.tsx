'use client'

import { Tooltip } from '@material-tailwind/react'
import { toHHMM } from '@/services/util'
import { ItemTypeKind } from '@/interfaces/item.interface'
import WeaponBoxDetailComponent from '@/components/item/weapon-box-detail.component'
import MiscBoxDetailComponent from '@/components/item/misc-box-detail.component'
import ShareItemBoxComponent from '@/components/chat/share-item-box.component'

export function ChatItemShareComponent({ chatMessage }: { chatMessage: any }) {
  return (
    <div className="break-all pl-[5px] w-full border-t border-dashed border-b border-amber-800 cursor-pointer py-[4px]">
      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
      {`${chatMessage.nickname}: `}
      <Tooltip
        className="rounded-none bg-transparent"
        interactive
        content={
          <>
            {chatMessage.item.iType === ItemTypeKind.Weapon && (
              <WeaponBoxDetailComponent item={chatMessage.item} />
            )}
            {chatMessage.item.iType === ItemTypeKind.Misc && (
              <MiscBoxDetailComponent item={chatMessage.item} />
            )}
          </>
        }
      >
        <div>
          <ShareItemBoxComponent item={chatMessage.item} />
        </div>
      </Tooltip>
    </div>
  )
}
