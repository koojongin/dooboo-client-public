'use client'

import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

export default function CommunityHeader({ children }: any) {
  const router = useRouter()
  const goToIndex = () => {
    router.push('/main/community')
  }
  return (
    <div className="rounded w-full flex flex-row justify-between gap-1">
      <div className="w-full">
        <Card className="p-2 rounded leading-none">
          <div className="text-[32px] my-1.5 cursor-pointer">
            <div onClick={() => goToIndex()}>전체 게시판(준비중)</div>
            <div>{children}</div>
          </div>
        </Card>
      </div>
      <div className="flex flex-col gap-2">
        <Card className="p-2 rounded min-w-40">
          <div>이 게시판의 베스트게시글</div>
          <div>베스트 게시글.1.</div>
          <div>베스트 게시글.2.</div>
          <div>베스트 게시글.2.</div>
          <div>베스트 게시글.2.</div>
        </Card>
        <Card className="p-2 rounded min-w-72">
          <div>베스트 게시글..</div>
          <div>베스트 게시글.1.</div>
          <div>베스트 게시글.2.</div>
          <div>베스트 게시글.2.</div>
          <div>베스트 게시글.2.</div>
        </Card>

        <Card className="p-2 rounded min-w-72">
          <img src="/images/right-banner.png" />
        </Card>
      </div>
    </div>
  )
}
