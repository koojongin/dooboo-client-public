import { Card, CardBody, Tooltip } from '@material-tailwind/react'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'
import { fetchEquipItem, fetchGetMyInventory } from '@/services/api-fetch'
import { InnItem, InventoryRef, Weapon } from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { toMMDDHHMM } from '@/services/util'
import { socket } from '@/services/socket'
import { EMIT_SHARE_ITEM_EVENT } from '@/interfaces/chat.interface'

export function WeaponBoxDetailComponent({
  item,
  onShowActions,
  equippedCallback,
  onShowTotalDamage = false,
}: {
  item: Weapon | any
  onShowActions: boolean
  onShowTotalDamage?: boolean
  equippedCallback?: () => void
}) {
  const selectedItem = item.weapon
  const equipItem = async (eItem: Weapon | any) => {
    await fetchEquipItem(eItem._id)
    if (equippedCallback) equippedCallback()
  }

  const shareItem = async (eItem: Weapon | any) => {
    socket.emit(EMIT_SHARE_ITEM_EVENT, { itemId: eItem._id })
  }

  const sellItem = async (eItem: Weapon | any) => {
    await Swal.fire({
      title: '미지원',
      text: '미지원',
      icon: 'info',
      confirmButtonText: '확인',
    })
  }

  return (
    <div className="flex flex-col gap-1 min-w-[200px] p-[4px] text-white bg-[#555d62ed] rounded shadow-gray-400 shadow-xl">
      <div className="flex items-center justify-center">
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1].map((v) => {
          return (
            <img
              className="w-[16px] h-[16px]"
              key={createKey()}
              src={`/images/star_${v ? 'on' : 'off'}.png`}
            />
          )
        })}
      </div>
      <div className="text-center text-2xl bg-[#9bb5c44f]">
        {selectedItem.name}
      </div>
      <div className="flex justify-between">
        <div className="">iType</div>
        <div>{selectedItem.iType}</div>
      </div>
      <div className="flex justify-between">
        <div className="">아이템 레벨</div>
        <div>{selectedItem.iLevel}</div>
      </div>
      <div className="flex justify-between">
        <div className="">착용 레벨</div>
        <div>{selectedItem.requiredEquipmentLevel}</div>
      </div>
      <div className="border-b border-b-white" />
      {selectedItem.damageOfPhysical > 0 && (
        <div className="flex justify-between">
          <div className="">물리 피해</div>
          <div>{selectedItem.damageOfPhysical}</div>
        </div>
      )}
      {selectedItem.damageOfCold > 0 && (
        <div className="flex justify-between">
          <div className="">냉기 피해</div>
          <div>{selectedItem.damageOfCold}</div>
        </div>
      )}
      {selectedItem.damageOfFire > 0 && (
        <div className="flex justify-between">
          <div className="">화염 피해</div>
          <div>{selectedItem.damageOfFire}</div>
        </div>
      )}
      {selectedItem.damageOfLightning > 0 && (
        <div className="flex justify-between">
          <div className="">번개 피해</div>
          <div>{selectedItem.damageOfLightning}</div>
        </div>
      )}
      {selectedItem.criticalRate > 0 && (
        <div className="flex justify-between">
          <div className="">치명타 확률</div>
          <div>{selectedItem.criticalRate}</div>
        </div>
      )}
      {selectedItem.criticalMultiplier > 0 && (
        <div className="flex justify-between">
          <div className="">치명타 배율</div>
          <div>{selectedItem.criticalMultiplier}</div>
        </div>
      )}
      <div className="border-b border-b-white" />
      <div>
        <div className="flex justify-between">
          <div className="">판매가</div>
          <div>{selectedItem.gold.toLocaleString()}</div>
        </div>
      </div>

      <div className="border-b border-b-white" />

      <div>
        <div className="flex justify-between">
          <div>획득일시</div>
          <div>{toMMDDHHMM(item.createdAt)}</div>
        </div>
      </div>

      {onShowActions && (
        <>
          <div className="border-b border-b-dark-blue" />

          <div>
            <div className="flex items-center gap-1">
              <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => equipItem(item)}
              >
                착용
              </div>
              <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => shareItem(item)}
              >
                공유
              </div>
              {/*     <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => sellItem(item)}
              >
                판매
              </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function ItemBoxComponent({
  className = '',
  item,
  onShowActions = false,
  onShowTotalDamage = false,
  equippedCallback = () => {},
  onSelect = () => {},
}: {
  item: Weapon | any
  className: string
  onShowActions?: boolean
  onShowTotalDamage?: boolean
  equippedCallback?: () => void
  onSelect?: (param: InnItem) => void
}) {
  const selectedItem = item.weapon
  const totalFlatDamage =
    (selectedItem?.damageOfPhysical || 0) +
    (selectedItem?.damageOfLightning || 0) +
    (selectedItem?.damageOfCold || 0) +
    (selectedItem?.damageOfFire || 0)

  const onClickItem = () => {
    onSelect(item)
  }
  return (
    <>
      {item.iType === 'weapon' && (
        <div
          className={`relative cursor-pointer min-w-[40px] w-[40px] h-[40px] max-w-[40px] max-h-[40px] ${className}`}
          onClick={onClickItem}
        >
          <Tooltip
            className="rounded-none bg-transparent"
            interactive
            content={
              <WeaponBoxDetailComponent
                item={item}
                onShowTotalDamage={onShowTotalDamage}
                onShowActions={onShowActions}
                equippedCallback={equippedCallback}
              />
            }
          >
            <div className="relative max-w-full max-h-full w-[40px] h-[40px]">
              <div className="absolute text-[12px] border rounded px-[2px] ff-ba ff-skew bg-[#424242a6] text-white">
                {totalFlatDamage}
              </div>
              <img
                className="max-w-full max-h-full w-[40px] h-[40px]"
                src={`${toAPIHostURL(selectedItem.thumbnail)}`}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </>
  )
}

function InventoryComponent(
  { borderStyle, refreshInventory, refreshMe }: any,
  ref: ForwardedRef<InventoryRef>,
) {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [maxItemSlots, setMaxItemSlots] = useState<number>(0)
  const [isFulledInventory, setIsFulledInventory] = useState<boolean>()

  const equippedCallback = async () => {
    if (refreshInventory && refreshMe) {
      await Promise.all([refreshInventory(), refreshMe()])
    }
  }
  const loadInventory = async () => {
    const { items: rItems, slots, isFulled } = await fetchGetMyInventory()
    setItems(rItems)
    setMaxItemSlots(slots)
    setIsFulledInventory(isFulled)
  }

  const goToInn = () => {
    router.push('/main/inn')
  }
  useEffect(() => {
    loadInventory()
  }, [])
  useImperativeHandle(ref, () => ({
    refresh: () => {
      loadInventory()
    },
  }))

  return (
    <Card
      className={`rounded w-[460px] max-w-[460px] min-w-[460px] flex justify-center items-center min-h-40 ${borderStyle}`}
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
            const disableSlotClass = 'bg-gray-800'
            const isOveredSlot = index >= maxItemSlots
            return (
              <div
                key={createKey()}
                className={`relative flex border-[1px] border-r rounded-md w-[40px] h-[40px] ${isOveredSlot ? disableSlotClass : ''}`}
              >
                {isOveredSlot && (
                  <div className="absolute z-10 bg-gray-800 bg-opacity-80 rounded" />
                )}
                {item && (
                  <ItemBoxComponent
                    className="p-[2px]"
                    item={item}
                    onShowActions
                    onShowTotalDamage
                    equippedCallback={equippedCallback}
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
