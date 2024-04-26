'use client'

import { Card, CardBody } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  fetchDeleteDropTable,
  fetchGetDropTableList,
} from '@/services/api-fetch'
import { DropTable } from '@/interfaces/drop-table.interface'

export default function DropPage() {
  const router = useRouter()
  const [dropTables, setDropTables] = useState<any[]>([])
  const loadDropTables = async () => {
    const { dropTables: rDropTables } = await fetchGetDropTableList()
    setDropTables(rDropTables)
  }

  const goToEditPage = (dropTableId: string) => {
    router.push(`/admindooboo/drop/${dropTableId}`)
  }

  const deleteDropTable = async (dropTable: DropTable) => {
    const { isConfirmed } = await Swal.fire({
      title: '정말로 삭제하시겠습니까?',
      text: dropTable.monster?.name || '?',
      icon: 'question',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      const result = await fetchDeleteDropTable(dropTable.id!)
      await Swal.fire({
        title: '삭제되었습니다.',
        text: '-',
        icon: 'success',
        confirmButtonText: '확인',
      })
      await loadDropTables()
    }
  }

  useEffect(() => {
    loadDropTables()
  }, [])
  return (
    <Card>
      <CardBody>
        <div className="flex gap-1 items-center">
          <div className="text-lg">드랍테이블 목록</div>
          <div
            className="ff-ba ff-skew cursor-pointer bg-green-500 px-[5px] rounded flex items-center text-[16px] text-white"
            onClick={() => goToEditPage('create')}
          >
            추가하기
          </div>
        </div>
        <div>
          {/* Header */}
          <div className="flex gap-1 px-[1px] py-[1px] bg-blue-gray-200 bg-dark-blue text-white">
            <div className="min-w-[200px]">몬스터명</div>
            <div>비고</div>
          </div>

          {/* List */}
          {dropTables.map((dropTable) => {
            return (
              <div key={dropTable._id} className="flex gap-1 px-[1px] py-[1px]">
                <div className="min-w-[200px]">{dropTable.monster.name}</div>
                <div>{dropTable.items.length}개의 아이템</div>
                <div className="flex justify-start gap-1">
                  <div
                    className="cursor-pointer bg-green-500 px-2.5 rounded flex items-center text-[16px] leading-[1.5] text-white"
                    onClick={() => goToEditPage(dropTable._id)}
                  >
                    수정
                  </div>
                  <div
                    className="cursor-pointer rounded bg-red-700 text-white px-2 py-0.5"
                    key={`${dropTable._id}-delete`}
                    onClick={() => deleteDropTable(dropTable)}
                  >
                    삭제
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
