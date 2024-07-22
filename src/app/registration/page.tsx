'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useState } from 'react'
import axios from 'axios'
import { API_SERVER_URL } from '@/constants/constant'

export default function RegistrationPage() {
  const [nickNameValidationMessage, setNickNameValidationMessage] = useState('')
  const [isAvailableNickName, setIsAvailableNickName] = useState(false)
  const [nickname, setNickname] = useState('')

  const checkNickName = useCallback(async () => {
    const { data } = await axios.post(`${API_SERVER_URL}/auth/check-nickname`, {
      nickname,
    })

    const { isAvailable, message } = data
    if (!isAvailable) setNickNameValidationMessage(message)
    else setNickNameValidationMessage('사용 가능한 닉네임입니다.')

    setNickNameValidationMessage(message)
    setIsAvailableNickName(isAvailable)
  }, [nickname])

  return (
    <div className="my-[10px] mx-auto flex items-center justify-center">
      <Card className="rounded p-[10px] ff-score-all font-bold w-[600px]">
        <div className="text-[24px]">회원 가입 페이지</div>
        <hr className="my-[10px] border-blue-950" />
        <div className="flex items-stretch [&>div]:w-[100px]">
          <div className="flex items-center">닉네임</div>
          <input
            className="border p-[5px]"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <div
            className="bg-green-800 text-white cursor-pointer flex items-center justify-center"
            onClick={() => {
              checkNickName()
            }}
          >
            중복 확인
          </div>
        </div>
        {!isAvailableNickName && (
          <div className="text-[14px] text-red-600">
            * 닉네임은 2~16자, 영어,한글만 가능합니다. (자음,모음,영어 대문자
            불가능)
            <div>{nickNameValidationMessage}</div>
          </div>
        )}
        {isAvailableNickName && (
          <div className="text-[14px] text-green-700">* 사용가능</div>
        )}
        <div className="flex justify-center">
          <div className="p-[8px] bg-green-600 text-white">가입하기</div>
        </div>
      </Card>
    </div>
  )
}
