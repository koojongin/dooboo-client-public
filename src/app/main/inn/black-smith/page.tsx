'use client'

import { Card } from '@material-tailwind/react'
import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import {
  fetchEnhanceWeapon,
  fetchGetEnhancePrice,
  fetchGetMyInventory,
} from '@/services/api-fetch'
import {
  EnhancedResultDialogRef,
  InnItem,
  ItemTypeKind,
} from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import EnhancedResultDialog from './enhanced-result-dialog'
import ItemBoxComponent from '@/components/item/item-box'

export default function BlackSmithPage() {
  const smithOptions = [
    {
      name: '스타포스 제련',
      desc: '동일 아이템과 골드를 소모하여 기본 속성을 랜덤하게 추가시킵니다.',
    },
    {
      name: '재설정',
      desc: '특정 아이템을 사용하여, 아이템의 옵션을 재설정합니다.',
    },
    {
      name: '속성 전환',
      desc: '무기의 기본 옵션에서 속성(물리,화염,냉기,번개) 중 하나를 무작위로 전환하여 기존 기본옵션 속성에 추가 합니다.',
    },
    {
      name: '속성 분할',
      desc: '무기의 기본 옵션에서 속성(물리,화염,냉기,번개) 중 하나를 다른 속성으로 분할합니다.',
    },
  ]
  return (
    <div>
      <Card className="rounded p-[10px]">
        <div className="flex flex-col gap-[15px]">
          {smithOptions.map((smithOption, index) => {
            return (
              <BlackSmithInfoBlock
                key={createKey()}
                smithOption={smithOption}
                index={index}
              />
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function BlackSmithInfoBlock({
  smithOption,
  index,
}: {
  smithOption: { name: string; desc: string }
  index: number
}) {
  const { name, desc } = smithOption
  return (
    <div>
      <div className="text-[#245a7e] flex items-center gap-[4px]">
        <div>{index + 1}.</div>
        <div>{name}</div>
      </div>
      <div className="flex items-center gap-[4px] text-[18px]">
        <i className="fa-regular fa-circle-question" />
        <div>{desc}</div>
      </div>
    </div>
  )
}
