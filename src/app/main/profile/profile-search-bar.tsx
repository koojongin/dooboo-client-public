'use client'

import { Card } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ProfileSearchBar() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')

  const searchKeyword = () => {
    // 젬젬
    router.push(`/main/profile/search/${keyword}`)
  }
  return (
    <Card className="rounded ff-score-all font-bold p-[10px]">
      <div>사용자 프로필 검색</div>
      <input
        className="border-gray-500 border p-[4px] rounded"
        placeholder="유저의 닉네임을 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') searchKeyword()
        }}
      />
    </Card>
  )
}
