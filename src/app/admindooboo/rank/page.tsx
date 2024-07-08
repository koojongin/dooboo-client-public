'use client'

import { Card } from '@material-tailwind/react'
import { useCallback } from 'react'
import Swal from 'sweetalert2'
import { fetchRewardDamageRank } from '@/services/api-admin-fetch'

export default function RankPage() {
  const rewardDamageRank = useCallback(async () => {
    await fetchRewardDamageRank()
    Swal.fire({
      text: '지급완료',
      icon: 'info',
      confirmButtonText: '확인',
    })
  }, [])

  return (
    <Card className="p-[10px] rounded ff-score-all font-bold">
      <div className="flex justify-start">
        <div
          className="cursor-pointer bg-green-800 text-white p-[5px] rounded"
          onClick={() => rewardDamageRank()}
        >
          데미지 랭크 보상 지급하기
        </div>
      </div>
    </Card>
  )
}
