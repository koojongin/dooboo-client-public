import { Card, CardBody } from '@material-tailwind/react'
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'
import { fetchGetMyInventory, fetchGetMyStash } from '@/services/api-fetch'
import { InventoryRef } from '@/interfaces/item.interface'
import ItemBoxComponent from '@/components/item/item-box'
import { InventoryActionKind } from '@/components/item/item.interface'
import { Stash } from '@/interfaces/stash.interface'

function InventoryComponent(
  { borderStyle, refreshInventory, refreshMe, equippedItems }: any,
  ref: ForwardedRef<InventoryRef>,
) {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()
  // const [lastOpenedItemId, setLastOpenedItemId] = useState<string>()

  const equippedCallback = async () => {
    if (refreshInventory && refreshMe) {
      await Promise.all([refreshInventory(), refreshMe()])
    }
  }
  const loadInventory = useCallback(async () => {
    const { items: rItems, slots, isFulled } = await fetchGetMyInventory()
    setItems(rItems)
    setMaxItemSlots(slots)
    setIsFulledInventory(isFulled)
  }, [])

  const goToInn = () => {
    router.push('/main/inn')
  }
  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      loadInventory()
    },
  }))

  return (
    <Card
      className={`rounded w-[560px] max-w-[560px] min-w-[560px] flex justify-center items-center min-h-40 ${borderStyle} [&_*]:select-none`}
    >
      <CardBody>
        <div>인벤토리</div>
        {isFulledInventory && (
          <div className="text-red-400 text-[14px]">
            * 인벤토리가 가득 찼습니다. 아이템을 더이상 획득할 수 없습니다.{' '}
            <span
              className="underline text-[20px] cursor-pointer"
              onClick={() => goToInn()}
            >
              여관
            </span>
            으로 이동해 아이템을 정리하세요
          </div>
        )}
        <div className="flex flex-wrap gap-[1px]">
          {new Array(100).fill(1).map((value, index) => {
            const item = items[index]
            const isOveredSlot = index >= maxItemSlots
            return (
              <div
                key={`main_inventory_${item?._id || createKey()}`}
                className={`relative flex border border-r rounded-md w-[50px] h-[50px] ${isOveredSlot ? 'bg-gray-800 bg-opacity-60' : ''}`}
              >
                {item && (
                  <ItemBoxComponent
                    className="p-[2px]"
                    item={item}
                    key={`main_inventory_${item?._id || createKey()}_box`}
                    // setLastOpenedItemId={setLastOpenedItemId}
                    // lastOpenedItemId={lastOpenedItemId}
                    actions={[
                      InventoryActionKind.Share,
                      InventoryActionKind.Equip,
                      InventoryActionKind.AddToAuction,
                    ]}
                    onShowTotalDamage
                    equippedItems={equippedItems}
                    actionCallback={equippedCallback}
                  />
                )}
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}

export default forwardRef<any, any>(InventoryComponent)
