import type { Metadata } from 'next'
import InnHeader from './inn-header'

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
  return (
    <div className="flex flex-col gap-[4px] text-[20px] ff-ba ff-skew">
      <InnHeader />
      <div>{children}</div>
    </div>
  )
}
