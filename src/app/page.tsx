'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/dist/client/components/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const params = useSearchParams()
  const accessToken = params.get('accessToken')
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('token', accessToken)
      router.replace('/', undefined)
    }

    const token = localStorage.getItem('token')
    if (token) {
      router.push('/main/community')
    }
  }, [accessToken, router])

  return (
    <div className="full-center flex justify-center ">
      <div className="min-w-[900px] flex justify-between">
        <div className="flex max-w-full">
          <img className="min-w-[800px]" src="/images/tofu.webp" />
        </div>
        <div className="noselect flex flex-col justify-between w-full">
          <div
            className="text-white bg-gray-400 text-center w-full min-h-[300px] flex items-center justify-center text-[30px] duration-300 hover:font-bold hover:bg-white hover:text-black hover:cursor-pointer hover:text-[35px]"
            // onClick={() => router.push('/registration')}
          >
            -
          </div>
          <div
            onClick={() => router.push('/register')}
            className="text-white bg-gray-400 text-center w-full min-h-[300px] flex items-center justify-center text-[30px] duration-300 hover:font-bold hover:bg-white hover:text-black hover:cursor-pointer hover:text-[35px]"
          >
            디스코드로 로그인
          </div>
        </div>
      </div>
    </div>
  )
}
