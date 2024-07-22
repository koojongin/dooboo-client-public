'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toMMDDHHMMSS } from '@/services/util'
import { Board } from '@/interfaces/board.interface'
import { fetchGetBoardList } from '@/services/api-fetch'

export function NoticeHeaderComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const [notice, setNotice] = useState<Board>()

  const loadNotice = useCallback(async () => {
    const result = await fetchGetBoardList(
      { category: { $in: ['공지', '패치노트'] } },
      { page: 1, limit: 1 },
    )
    setNotice((result?.boards || [])[0])
  }, [])

  useEffect(() => {
    if (pathname.indexOf('main/profile') >= 0) return
    if (pathname.indexOf('admindooboo') >= 0) return
    loadNotice()
  }, [loadNotice, pathname])

  useEffect(() => {}, [])
  return (
    <div className="flex justify-start bg-gray-100 bg-opacity-65 w-full text-[14px] py-1 hover:bg-gray-100/80">
      {notice && (
        <div
          className="min-w-[900px] px-3 cursor-pointer hover:underline"
          onClick={() => {
            router.push(`/main/community/detail/${notice._id}`)
          }}
        >
          [{toMMDDHHMMSS(notice.createdAt!)}] {notice.title}
        </div>
      )}
      {!notice && (
        <div className="min-w-[900px] px-3">공지사항 및 패치노트 영역</div>
      )}
    </div>
  )
}
