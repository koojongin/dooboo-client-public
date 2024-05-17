'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import toAPIHostURL from '@/services/image-name-parser'
import {
  fetchGetShopList,
  fetchPurchaseShopItem,
} from '@/services/api/api.shop'
import { ShopItem } from '@/interfaces/shop.interface'
import { BaseMisc, InventoryResponse, Item } from '@/interfaces/item.interface'
import createKey from '@/services/key-generator'
import ItemBoxComponent from '@/components/item/item-box'
import { InventoryActionKind } from '@/components/item/item.interface'
import { fetchGetMyInventory } from '@/services/api-fetch'

export default function ShopPage() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [inventoryRes, setInventoryRes] = useState<InventoryResponse>()

  const loadShopList = useCallback(async () => {
    const result = await fetchGetShopList()
    setShopItems(result.shopItems)
  }, [])

  const loadInventory = useCallback(async () => {
    const result = await fetchGetMyInventory()
    setInventoryRes(result)
  }, [])

  const onClickShopItem = useCallback(
    async (shopItem: ShopItem) => {
      if (!shopItem?._id) return
      const { isConfirmed } = await Swal.fire({
        title: shopItem.baseMisc.name,
        text: '정말로 구매하시겠습니까? 구매재료는 인벤토리에 묶음으로 있어야 합니다.',
        confirmButtonText: '예',
        denyButtonText: `닫기`,
        showDenyButton: true,
      })

      if (isConfirmed) {
        await fetchPurchaseShopItem(shopItem._id!)
        await Promise.all([
          Swal.fire({
            title: '구매되었습니다.',
            denyButtonText: `닫기`,
          }),
          loadInventory(),
        ])
      }
    },
    [loadInventory],
  )

  useEffect(() => {
    loadShopList()
    loadInventory()
  }, [loadInventory, loadShopList])

  return (
    <div className="flex justify-start items-start gap-[10px]">
      <Card className="p-[10px] rounded">
        <div className="text-[16px]">
          아이템 클릭 시 구매 선택창이 나옵니다.
        </div>
        <div className="flex gap-[10px]">
          <div className="p-[2px] bg-gray-100/70 rounded border border-gray-600">
            <div className="flex flex-col items-start overflow-y-scroll h-[500px] max-h-[500px]">
              {shopItems.map((shopItem) => {
                return (
                  <div
                    key={shopItem._id}
                    onClick={() => onClickShopItem(shopItem)}
                  >
                    <ShopItemRow shopItem={shopItem} />
                    <div className="my-[5px] border-b border-b-gray-300 w-full" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded p-[10px]">
        <div className="flex flex-col ">
          <div className="text-[16px]">인벤토리</div>
          <div className="flex flex-wrap w-[520px] gap-[2px]">
            {inventoryRes && (
              <InventoryBox
                onRefresh={loadInventory}
                items={inventoryRes.items}
                slots={inventoryRes.slots}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

function InventoryBox({
  onRefresh = async () => {},
  items,
  slots,
}: {
  onRefresh: () => Promise<void>
  items: Item[]
  slots: number
}) {
  return (
    <>
      {new Array(100).fill(1).map((value, index) => {
        const item = items[index]
        const isOveredSlot = index >= slots
        return (
          <div
            key={`main_inventory_${item?._id || createKey()}`}
            className={`relative flex border border-r rounded-md w-[50px] h-[50px] ${isOveredSlot ? 'bg-gray-800 bg-opacity-60' : ''}`}
          >
            {item && (
              <ItemBoxComponent
                actionCallback={onRefresh}
                className="p-[2px]"
                item={item}
                key={`shop_inventory_${item?._id || createKey()}_box`}
                actions={[InventoryActionKind.Consume]}
              />
            )}
          </div>
        )
      })}
    </>
  )
}

function ShopItemRow({ shopItem }: { shopItem: ShopItem }) {
  return (
    <Tooltip
      className="bg-transparent border-none"
      content={<BaseMiscTooltipBox baseMisc={shopItem.baseMisc} />}
    >
      <div className="flex items-stretch border border-gray-600 cursor-pointer">
        <div className="m-[2px] border border-gray-600 flex items-center justify-center w-[50px] min-w-[50px] h-[50px] min-h-[50px]">
          <img
            className="w-full h-full"
            src={toAPIHostURL(shopItem.baseMisc.thumbnail)}
          />
        </div>
        <div className="text-[16px] bg-gray-100 flex flex-col justify-between min-w-[400px]">
          <div className="ff-score font-bold text-[16px] px-[4px] h-full">
            {shopItem.baseMisc.name}
          </div>
          <div className="border-b border-b-gray-500 border-dashed" />
          <div className="ff-score font-bold text-[16px] px-[4px] h-full">
            {shopItem.content}
          </div>
        </div>
      </div>
    </Tooltip>
  )
}

function BaseMiscTooltipBox({ baseMisc }: { baseMisc: BaseMisc }) {
  return (
    <div className="p-[1px] shadow-md shadow-gray-400 rounded bg-black/80 min-w-[300px] rounded">
      <div className="text-[#245a7e] rounded p-[10px] text-white ff-score-all border border-white">
        <div className="font-bold text-center text-[18px] mb-[5px]">
          {baseMisc.name}
        </div>
        <div className="flex items-start gap-[10px]">
          <div className="w-[50px] h-[50px] border border-white rounded">
            <img
              className="w-full h-full"
              src={toAPIHostURL(baseMisc.thumbnail)}
            />
          </div>
          <div className="w-[240px]">{baseMisc.desc}</div>
        </div>
      </div>
    </div>
  )
}
