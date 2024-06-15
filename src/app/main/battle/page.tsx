'use client'

import Link from 'next/link'

export default function BattlePage() {
  return (
    <div className="flex items-start gap-[10px]">
      <Link href="/main/battle/normal" className="cursor-pointer">
        <div className="p-[2px] border border-gray-600 rounded-lg bg-[#245a7e]/60 shadow-md shadow-[#245a7e]">
          <div className="bg-white/10 rounded-lg border border-[#245a7e]">
            <img className="w-[150px]" src="/images/menu/icon_battle.png" />
          </div>
        </div>
      </Link>
      <Link href="/main/battle/raid" className="cursor-pointer">
        <div className="p-[2px] border border-gray-600 rounded-lg bg-[#245a7e]/60 shadow-md shadow-[#245a7e]">
          <div className="bg-white/10 rounded-lg border border-[#245a7e]">
            <img className="w-[150px]" src="/images/menu/icon_raid.png" />
          </div>
        </div>
      </Link>
      <Link href="/main/battle/test">
        <div className="bg-white p-[40px] cursor-pointer rounded">
          테스트 on Debug
        </div>
      </Link>
    </div>
  )
}
