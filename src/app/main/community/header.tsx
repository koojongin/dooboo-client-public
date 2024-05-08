'use client'

import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import GoogleAd from '@/components/ads/ads'

export default function CommunityHeader({ children }: any) {
  const router = useRouter()
  const goToIndex = () => {
    router.push('/main/community')
  }

  const goToRoute = (path: string) => {
    router.push(path)
  }

  useEffect(() => {}, [])
  return (
    <div className="rounded w-full flex flex-row justify-between gap-1 ff-dodoom-all mb-[800px]">
      <div className="w-full">
        <Card className="p-2 rounded leading-none">
          <div className="text-[16px] flex flex-col gap-[4px]">
            <div className="flex gap-[4px]">
              <div
                className="flex items-center justify-center bg-ruliweb px-[9px] py-[4px] text-white font-bold cursor-pointer"
                onClick={() => goToIndex()}
              >
                메인으로
              </div>
            </div>
            <div>{children}</div>
          </div>
        </Card>
        <div className="w-full">
          <GoogleAd />
        </div>
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
