'use client'

import { Card, CardBody, CardHeader } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'
import toAPIHostURL from '@/services/image-name-parser'
import { Pagination } from '@/interfaces/common.interface'
import { BaseMisc } from '@/interfaces/item.interface'
import { fetchGetShopList } from '@/services/api/api.shop'
import { ShopItem } from '@/interfaces/shop.interface'

export default function ItemMiscPage() {
  const router = useRouter()
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [pagination, setPagination] = useState<Pagination>()

  const loadBaseMiscs = useCallback(async () => {
    const result = await fetchGetShopList()
    setShopItems(result.shopItems)
    // setPagination({ ...result })
  }, [])

  const editItem = (shopItem: ShopItem | string) => {
    if (typeof shopItem === 'string') {
      router.push(`/admindooboo/shop/edit/create`)
      return
    }
    router.push(`/admindooboo/shop/edit/${shopItem._id}`)
  }

  const deleteItem = (baseMisc: BaseMisc) => {}

  useEffect(() => {
    loadBaseMiscs()
  }, [loadBaseMiscs])

  return (
    <div>
      <Card className="h-full w-full rounded">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none flex items-center gap-[10px]"
        >
          <div>상점 목록</div>
          <div className="flex">
            <div
              className="bg-green-500 p-[4px] cursor-pointer ff-score font-bold text-white"
              onClick={() => editItem('create')}
            >
              추가
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {[
                  '',
                  'name',
                  'content',
                  'b.desc',
                  'b.iGrade',
                  'b.mSt',
                  'b.gold',
                  '-',
                ].map((head) => (
                  <th
                    key={createKey()}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-1"
                  >
                    <div className="p-1">{head}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shopItems &&
                shopItems.map((shopItem: any, index: number) => {
                  const isLast = index === shopItems.length - 1
                  const classes = `${isLast ? 'p-1' : 'p-1 border-b border-blue-gray-50'}`
                  const { baseMisc } = shopItem
                  return (
                    <tr
                      key={createKey()}
                      className="hover:bg-gray-100 [&>*:nth-child(even)]:bg-blue-gray-50/50"
                    >
                      <td className={`${classes} w-[50px]`}>
                        <img
                          src={toAPIHostURL(baseMisc.thumbnail)}
                          className="w-[40px] h-[40px] border border-blue-gray-50 bg-blue-gray-50/50 object-contain"
                        />
                      </td>
                      <td>{baseMisc.name}</td>
                      <td>{shopItem.content}</td>
                      <td>{baseMisc.desc}</td>
                      <td>{baseMisc.iGrade}</td>
                      <td>{baseMisc.maxStack}</td>
                      <td>{baseMisc.gold}</td>
                      <td>
                        <div className="flex justify-start gap-1">
                          <div
                            className="cursor-pointer rounded bg-green-500 text-white px-2 py-0.5"
                            key={`${shopItem._id}-edit`}
                            onClick={() => editItem(shopItem)}
                          >
                            수정
                          </div>
                          <div
                            className="cursor-pointer rounded bg-red-700 text-white px-2 py-0.5"
                            key={`${shopItem._id}-delete`}
                            onClick={() => deleteItem(shopItem)}
                          >
                            삭제
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}
