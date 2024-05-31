import { headers } from 'next/headers'
import AdminLayoutHeader from './admin-layout-header'
import createKey from '@/services/key-generator'
import LoginTokenButton from '@/app/admindooboo/login-token-button'

const ADMIN_CHARACTER_ID = [
  '6603b3d5b7868c3b327f4c53',
  '661bb8d417b534690a0459dd',
  '6603a434b7868c3b327f4bf9', // 귀차나
]

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList: any = headers()
  const referer = headersList.get('referer')
  const token = headersList.get('token')
  if (
    !ADMIN_CHARACTER_ID.includes(token) &&
    process.env.NEXT_PUBLIC_ENVIRONMENT !== 'local'
  ) {
    return (
      <div className="p-[40px] min-h-[300px] w-full bg-white my-[10px] flex flex-col gap-[10px]">
        관리자 외 접근금지
        <div className="flex items-center">
          <LoginTokenButton />
        </div>
        <div className="text-[14px] flex flex-col gap-[4px]">
          {Object.keys(headersList.headers).map((name) => {
            return (
              <div key={createKey()} className="border-b border-gray-400">
                {name} :{headersList.headers[name]}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return (
    <div className="p-10">
      <div className="mb-5">
        <div>관리자페이지</div>
        <AdminLayoutHeader />
      </div>
      <div>{children}</div>
    </div>
  )
}
