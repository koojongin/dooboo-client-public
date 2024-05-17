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
  return (
    <div>
      <Card className="rounded p-[10px]">
        <div>
          강화: 동일 아이템과 골드를 소모하여 기본 속성을 랜덤하게 추가시킵니다.
        </div>
        <div>재설정: 특정 아이템을 사용하여, 아이템의 옵션을 재설정합니다.</div>
      </Card>
    </div>
  )
}
