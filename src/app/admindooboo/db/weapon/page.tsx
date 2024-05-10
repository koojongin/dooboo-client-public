'use client'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
} from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import createKey from '@/services/key-generator'
import {
  fetchDeleteBaseWeapon,
  fetchGetBaseWeaponList,
  fetchItemsAll,
  fetchWeaponsAll,
} from '@/services/api-fetch'
import { Pagination } from '@/interfaces/common.interface'
import { BaseWeapon, Item } from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { toRangeString } from '@/services/util'
import useDebounce from '@/components/hooks/debounce'
import ItemBoxComponent from '@/components/item/item-box'
import { InventoryActionKind } from '@/components/item/item.interface'

const TABLE_HEAD = [
  '-',
  '이름',
  '물리',
  '냉기',
  '화염',
  '번개',
  '치명타확률',
  '치명타피해',
  '획득골드',
  '템렙',
  '최대스타포스',
  '-',
]
export default function ItemListPage() {
  const [pagination, setPagination] = useState<Pagination>()
  const [items, setItems] = useState<Item[]>()

  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [selectedItem, setSelectedItem] = useState<Item>()
  const debouncedKeyword = useDebounce<string>(searchKeyword, 500)

  const loadList = useCallback(
    async (selectedPage = 1) => {
      const condition: any = {}

      if (debouncedKeyword) {
        condition._id = debouncedKeyword
      }
      const {
        page,
        total,
        totalPages,
        // items: rItems,
        weapons: rItems,
      } = await fetchWeaponsAll(condition, {
        page: selectedPage,
        limit: 50,
      })

      setPagination({ page, total, totalPages })
      setItems(
        rItems.map((i: any) => {
          return {
            _id: i._id,
            iType: 'weapon',
            createdAt: i.createdAt,
            owner: i.owner,
            weapon: { ...i },
          }
        }),
      )
    },
    [debouncedKeyword],
  )

  useEffect(() => {
    loadList()
  }, [loadList])

  return (
    <div>
      <Card className="p-[10px]">
        <div>
          {pagination && (
            <div className="flex items-center gap-[2px]">
              <div>{pagination.total}개의 아이템 검색됨</div>
              <div>
                [페이지 {pagination.page}/{pagination.totalPages}]
              </div>
            </div>
          )}
        </div>
        <div>
          {pagination && (
            <div className="w-full flex justify-start mt-[15px]">
              <div className="flex gap-[4px]">
                {new Array(pagination.totalPages)
                  .fill(1)
                  .map((value, index) => {
                    return (
                      <div
                        className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                        onClick={() => loadList(index + 1)}
                        key={createKey()}
                      >
                        {index + 1}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>

        <div>{selectedItem && <div>{selectedItem.owner.nickname}</div>}</div>
        <div className="">
          <div className="flex flex-wrap gap-[4px]">
            {items &&
              new Array(items.length).fill(1).map((value, index) => {
                const item = items[index]
                const disableSlotClass = 'bg-gray-800'
                return (
                  <div
                    key={`main_inventory_${item?._id || createKey()}`}
                    className="relative flex border border-r rounded-md w-[50px] h-[50px]"
                    onClick={() => setSelectedItem(item)}
                  >
                    {item && (
                      <ItemBoxComponent
                        className="p-[4px]"
                        item={item}
                        key={createKey()}
                        onShowTotalDamage
                      />
                    )}
                  </div>
                )
              })}
          </div>
          <div>
            {pagination && (
              <div className="w-full flex justify-start mt-[15px]">
                <div className="flex gap-[4px]">
                  {new Array(pagination.totalPages)
                    .fill(1)
                    .map((value, index) => {
                      return (
                        <div
                          className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                          onClick={() => loadList(index + 1)}
                          key={createKey()}
                        >
                          {index + 1}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
