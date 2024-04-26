import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '두부 온라인',
  description: '두부 온라인',
  openGraph: {
    images: [
      // {url: 'https://s3.orbi.kr/data/file/united2/dd35986eea024b719c37cd597d39ee74.gif'},
      { url: 'http://dooboo.online:3002/images/tofu.webp' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} bg-[url('/images/bg001.jpg')] bg-contain min-h-[500px] min-w-[900px]`}
      >
        <div className="flex justify-start bg-gray-100 bg-opacity-65 w-full text-[14px] py-1">
          <div className="min-w-[900px] px-3">
            두부 온라인 - 공지 또는 외치기등.. 들어갈 영역
          </div>
        </div>
        <div className="px-3 min-w-fit">{children}</div>
        <div className="flex justify-center bg-gray-100 bg-opacity-65 w-full text-[14px] py-1">
          dev since 2024.03.26 ~
        </div>
      </body>
    </html>
  )
}
