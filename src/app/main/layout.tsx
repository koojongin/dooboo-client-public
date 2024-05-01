import type { Metadata } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import MainHeader from '@/app/main/header.component'
import { ChatComponent } from '@/app/main/chat.component'
import AudioPlayBar from './audio-play-bar'

export const metadata: Metadata = {
  title: '두부 온라인',
  description: '두부 온라인',
  openGraph: {
    images: [
      {
        url: 'https://s3.orbi.kr/data/file/united2/dd35986eea024b719c37cd597d39ee74.gif',
      },
      // {url: 'http://dooboo.online:3002/images/tofu.webp'}
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currentPath = ''
  return (
    <div className="flex justify-center mt-2">
      {/* 컨텐츠 */}
      <div className="min-w-[960px] flex items-center justify-between flex-col mb-[50px] wide:min-w-full">
        {/* 헤더 */}
        <MainHeader />
        {/* 내용 */}
        <div className="flex flex-col gap-[6px] wide:flex-row wide:w-full">
          <div className="relative w-full flex justify-between wide:min-w-[1000px]">
            {children}
          </div>
          <ChatComponent />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <AudioPlayBar />
      </div>
    </div>
  )
}
