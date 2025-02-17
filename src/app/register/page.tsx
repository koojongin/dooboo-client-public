'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { ScaleLoader } from 'react-spinners'
import { API_SERVER_URL } from '@/constants/constant'

export default function Register() {
  const router = useRouter()
  const params = useSearchParams()
  const [nickname, setNickname] = useState('')
  const [onLoading, setOnLoading] = useState(false)
  const [searchValidMessage, setSearchValidMessage] = useState('')
  const [isAvailableNickname, setIsAvailableNickname] = useState(false)
  const [accessToken, setAccessToken] = useState('')

  const [nickNameValidaitonMessage, setNickNameValidaitonMessage] = useState('')
  const isDev = process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'
  const addHookString = '+webhook.incoming'
  // &&prompt=none
  const REDIRECT_URI = encodeURIComponent(
    isDev ? 'http://localhost:4001/oauth2' : 'http://dooboo.online:3001/oauth2',
  )
  const loginUrl = `https://discord.com/oauth2/authorize?client_id=1219938115016458331&response_type=code&redirect_uri=${REDIRECT_URI}&scope=email+identify+guilds${isDev ? addHookString : ''}`

  const handleChange = (element: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(element.target.value)
  }

  const checkNickName = async () => {
    const { data } = await axios.post(`${API_SERVER_URL}/auth/check-nickname`, {
      nickname,
    })

    const { isAvailable, message } = data
    if (!isAvailable) setSearchValidMessage(message)
    else setSearchValidMessage('사용 가능한 닉네임입니다.')

    setNickNameValidaitonMessage(message)
    setIsAvailableNickname(isAvailable)
  }

  useEffect(() => {
    const ac = params.get('accessToken')
    setAccessToken(ac || '')
    if (!ac) window.location.href = loginUrl
  }, [])

  useEffect(() => {
    checkNickName()
  }, [nickname])

  useEffect(() => {
    if (!searchValidMessage) {
      setSearchValidMessage('중복 시 밑에 경고 메세지')
    }
  }, [searchValidMessage])

  const register = async () => {
    if (!isAvailableNickname) return
    setOnLoading(true)
    const registerResponse = await axios.post(
      `${API_SERVER_URL}/auth/register`,
      { nickname, accessToken },
    )
    setOnLoading(false)

    const { data } = registerResponse
    if (!data) {
      await Swal.fire({
        title: '가입에 실패하였습니다',
        text: '관리자에게 문의하세요',
        icon: 'error',
        confirmButtonText: '확인',
      })
      router.push('/')
    } else {
      localStorage.setItem('token', accessToken!)
      await Swal.fire({
        title: '가입되었습니다!',
        text: 'ㄱㄱㄱ',
        icon: 'success',
        confirmButtonText: '확인',
      })
      router.push('/')
    }
  }

  const logout = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
    localStorage.removeItem('characterId')
    localStorage.removeItem('nickname')
    window.location.href = '/'
  }

  return (
    <div className="flex justify-center">
      <div
        className={`${onLoading ? 'flex' : 'hidden'} absolute min-w-full min-h-full top-0 left-0 justify-center items-center z-10 bg-white bg-opacity-60`}
      >
        <ScaleLoader color="#36d7b7" />
      </div>
      <div className="min-w-[900px] bg-[url('/images/tofu.webp')] isolate relative bg-cover min-h-lvh flex flex-col items-center text-center text-black after:bg-white after:opacity-40 after:content-[''] after:absolute after:-z-10 after:inset-0">
        <div className="w-full full-center items-center flex flex-col">
          <div className="py-10 w-full text-4xl">
            <div className="px-10 flex flex-col items-center">
              <div className="flex items-center pb-1">
                <div className="flex items-center mr-1 min-w-28 justify-center">
                  닉네임
                </div>
                <input
                  className="flex border-2 rounded-md border-blue-200 text-xl p-1"
                  type="text"
                  value={nickname}
                  onChange={handleChange}
                />
              </div>
              <div
                className={`text-2xl ${isAvailableNickname ? 'bg-gray-800 text-cyan-400 p-[4px]' : 'bg-red-700 text-white p-[4px]'}`}
              >
                {searchValidMessage}
              </div>
              <div className="text-xl text-red-800">
                * 닉네임은 2~16자, 영어,한글만 가능합니다. (자음,모음,영어
                대문자 불가능)
              </div>
              {nickNameValidaitonMessage && (
                <div className="text-red-500 text-[16px]">
                  {nickname}:{nickNameValidaitonMessage}
                </div>
              )}
            </div>
          </div>
          <button
            className={`duration-300 text-5xl border-2 rounded-xl w-56 flex justify-center items-center bg-gradient-to-r pt-2 ${isAvailableNickname ? 'cursor-pointer shadow-md shadow-blue-400 text-white from-cyan-500 to-blue-500' : 'cursor-no-drop text-gray-400 from-gray-600 to-gray-600'}`}
            onClick={() => register()}
          >
            가입하기
          </button>
          <div className="w-full flex justify-end mr-[20px]">
            <button
              className="mt-[20px] flex flex-col text-[12px] border-2 justify-center items-center bg-red-700 text-white ff-score-all font-bold p-[10px]"
              onClick={() => logout()}
            >
              <div>디스코드 로그인 상태</div>
              <div>해제하고 로그아웃</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
