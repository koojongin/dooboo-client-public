import type { Metadata } from 'next'
import InnHeader from './inn-header'

export const metadata: Metadata = {
  title: '두부 온라인',
  description: '두부 온라인',
  openGraph: {
    images: [
      {
        url: 'http://dooboo.online:3002/images/tofu.webp',
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
  return (
    <div className="flex flex-col gap-[4px] text-[20px] ff-ba ff-skew w-full">
      <InnHeader />
      <div>{children}</div>
    </div>
  )
}
