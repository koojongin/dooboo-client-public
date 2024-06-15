import type { Metadata } from 'next'
import './globals.css'
import axios from 'axios'

import { NoticeHeaderComponent } from '@/components/main/notice-header.component'
import GoogleAnalyticsComponent from '@/components/ads/google-analytics'

export const metadata: Metadata = {
  title: `두부 온라인 ${process.env.NEXT_PUBLIC_ENVIRONMENT === 'local' ? ' - 테스트' : ''}`,
  description: '두부 온라인',
  openGraph: {
    images: [
      // {url: 'https://s3.orbi.kr/data/file/united2/dd35986eea024b719c37cd597d39ee74.gif'},
      { url: 'http://dooboo.online:3002/images/tofu.webp' },
    ],
  },
}

export async function getNotice(): Promise<any | never> {
  const baseURL = `https://dooboo.online:${process.env.NEXT_PUBLIC_SERVER_PORT}`
  const response = await axios.post(`${baseURL}/board/list`, {
    condition: { category: { $in: ['공지', '패치노트'] } },
    opts: { page: 1, limit: 1 },
  })

  return response?.data
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const { boards = [] } = await getNotice()
  // const notice = boards[0]
  const notice = undefined

  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3170005754524045"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          // href="/font/font.awesome.all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="lep7juvIsq1-ds6fFdqxlUzmYC_9R-aCmTWssuX_MAk"
        />
        <meta name="google-adsense-account" content="ca-pub-3170005754524045" />
      </head>
      <body
        className={` bg-[url('/images/bg001.jpg')] bg-contain min-h-[500px] min-w-[900px] wide:w-full`}
      >
        <GoogleAnalyticsComponent />
        <NoticeHeaderComponent />
        <div className="px-3 min-w-fit">{children}</div>
        <div className="flex justify-center bg-gray-100 bg-opacity-65 w-full text-[14px] py-1">
          dev since 2024.03.26 ~
        </div>
        <noscript>
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PBJR2QM7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  )
}
