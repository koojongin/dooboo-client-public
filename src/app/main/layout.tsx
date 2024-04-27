import type { Metadata } from 'next'
import { headers } from 'next/headers'
import MainHeader from '@/app/main/header.component'
import { ChatComponent } from '@/app/main/chat.component'

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
      <div className="min-w-[960px] flex items-center justify-between flex-col">
        {/* 헤더 */}
        <MainHeader />
        {/* 내용 */}
        <div className="flex flex-col gap-[6px]  wide:flex-row">
          <div className="relative w-full flex justify-between wide:w-[1000px]">
            {children}
          </div>
          <div className="w-full wide:w-[300px]">
            <ChatComponent />
          </div>
        </div>
      </div>
    </div>
  )
}
