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
import _ from 'lodash'
import createKey from '@/services/key-generator'
import {
  fetchEquipItem,
  fetchGetMyInventory,
  fetchPostAddToAuction,
} from '@/services/api-fetch'
import { InnItem, InventoryRef, Weapon } from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import { toColorByGrade, toMMDDHHMMSS, translate } from '@/services/util'
import { socket } from '@/services/socket'
import { EMIT_SHARE_ITEM_EVENT } from '@/interfaces/chat.interface'

export const InventoryActionKind = {
  Share: 'share',
  Equip: 'equip',
  AddToAuction: 'add-to-auction',
}

export function WeaponBoxDetailComponent({
  item,
  equippedCallback,
  onShowTotalDamage = false,
  actions,
}: {
  item: Weapon | any
  actions?: string[]
  onShowTotalDamage?: boolean
  equippedCallback?: () => void
}) {
  const selectedItem = item.weapon
  if (!selectedItem.totalFlatDamage) {
    selectedItem.totalFlatDamage =
      selectedItem.damageOfPhysical +
      selectedItem.damageOfFire +
      selectedItem.damageOfCold +
      selectedItem.damageOfLightning
  }
  const equipItem = async (eItem: Weapon | any) => {
    await fetchEquipItem(eItem._id)
    if (equippedCallback) equippedCallback()
  }

  const isExistAdditionalAttributes =
    Object.keys(selectedItem.additionalAttributes || {}).length > 0
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

  const addToAuction = async () => {
    const { isConfirmed, value } = await Swal.fire({
      title: `판매 가격을 설정하세요`,
      input: 'number',
      html: `<div><div>${item.weapon.name}</div><div>판매 수수료는 10%입니다.</div><div>등록은 무료이며, 수수료는 판매되는 순간 정산됩니다.</div></div>`,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: '등록하기',
      cancelButtonText: '취소',
      showLoaderOnConfirm: true,
      preConfirm: async (goldString: string) => {
        const gold = parseInt(goldString, 10)
        const minGold = 1
        const maxGold = 100000000
        if (gold < minGold) {
          return Swal.showValidationMessage(
            `최소 설정 금액 제한
            ${minGold.toLocaleString()}`,
          )
        }
        if (gold > maxGold) {
          return Swal.showValidationMessage(
            `최대 설정 금액 한도 초과
            ${maxGold.toLocaleString()}`,
          )
        }
        try {
          return await fetchPostAddToAuction(item._id, { gold })
        } catch (error) {
          Swal.showValidationMessage(`
        Request failed: ${error}
      `)
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })

    if (isConfirmed) {
      await Swal.fire({
        title: '등록되었습니다',
      })
      if (equippedCallback) equippedCallback()
    }
  }

  return (
    <div
      key={createKey()}
      className="flex flex-col min-w-[300px] text-white bg-[#555d62ed] rounded shadow-gray-400 shadow-xl border-2 "
      style={{
        borderColor: toColorByGrade(selectedItem.iGrade),
      }}
    >
      <div className="flex items-center justify-center py-[6px]">
        {new Array(selectedItem?.maxStarForce).fill(1).map((v, index) => {
          const isOnStarForce = index < selectedItem.starForce
          return (
            <img
              className="w-[16px] h-[16px]"
              key={createKey()}
              src={`/images/star_${isOnStarForce ? 'on' : 'off'}.png`}
            />
          )
        })}
      </div>
      <div className="text-center text-2xl bg-[#9bb5c44f] ff-wavve">
        {selectedItem.name}
      </div>
      <div className="px-[10px] py-[2px] pt-[6px]">
        {/*  <div className="flex justify-between">
        <div className="">iType</div>
        <div>{selectedItem.iType}</div>
      </div> */}
        <div className="flex justify-between">
          <div className="">장비 분류</div>
          <div>{translate(selectedItem.weaponType) || '없음'}</div>
        </div>
        <div className="flex justify-between">
          <div className="">아이템 레벨</div>
          <div>{selectedItem.iLevel}</div>
        </div>
        <div className="flex justify-between">
          <div className="">등급</div>
          <div style={{ color: toColorByGrade(selectedItem.iGrade) }}>
            {translate(selectedItem.iGrade) || '없음'}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="">착용 레벨</div>
          <div>{selectedItem.requiredEquipmentLevel}</div>
        </div>
      </div>
      <div className="border-b border-b-gray-400 border-dotted" />
      <div className="px-[10px] pt-[2px] text-[14px]">
        <div className="mt-[6px]">
          기본 속성({selectedItem.totalFlatDamage?.toLocaleString()})
        </div>
        <div className="border-b border-b-gray-400" />
      </div>
      <div className="px-[10px]">
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
      </div>
      {isExistAdditionalAttributes && (
        <div>
          <div className="border-b border-b-gray-400 border-dotted" />
          <div className="px-[10px] mt-[6px] text-[#ffea00]">추가 속성</div>
        </div>
      )}
      {isExistAdditionalAttributes && (
        <div className="px-[10px]">
          <div className="border-b border-b-gray-400" />
          {_.sortBy(
            Object.keys(selectedItem.additionalAttributes || {}),
            (k) => k,
          ).map((key: string) => {
            const attributeValue = selectedItem.additionalAttributes[key]
            return (
              <div key={createKey()}>
                <div className="flex justify-between">
                  <div>{translate(key)}</div>
                  <div>{attributeValue}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="border-b border-b-gray-400 border-dotted" />
      <div className="px-[10px] py-[2px]">
        <div className="flex justify-between items-center">
          <div className="">판매가</div>
          <div className="flex items-center gap-[2px]">
            <img src="/images/icon_currency.png" className="w-[24px]" />
            <div>{selectedItem.gold.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="border-b border-b-gray-400 border-dotted" />

      <div className="px-[10px] py-[2px]">
        <div className="flex justify-between">
          <div>획득일시</div>
          <div>{toMMDDHHMMSS(item.createdAt)}</div>
        </div>
      </div>

      {
        <>
          <div>
            <div className="flex items-center gap-1">
              {actions && actions.includes(InventoryActionKind.Equip) && (
                <div
                  className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                  onClick={() => equipItem(item)}
                >
                  착용
                </div>
              )}
              {actions && actions.includes(InventoryActionKind.Share) && (
                <div
                  className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                  onClick={() => shareItem(item)}
                >
                  공유
                </div>
              )}
              {actions &&
                actions.includes(InventoryActionKind.AddToAuction) && (
                  <div
                    className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                    onClick={() => addToAuction()}
                  >
                    거래소 등록
                  </div>
                )}
              {/*     <div
                className="flex items-center justify-center border border-white min-w-[40px] bg-green-400 rounded text-white px-[2px] cursor-pointer"
                onClick={() => sellItem(item)}
              >
                판매
              </div> */}
            </div>
          </div>
        </>
      }
    </div>
  )
}

export function ItemBoxComponent({
  className = '',
  item,
  actions,
  onShowTotalDamage = false,
  equippedItems,
  equippedCallback = () => {},
  onSelect = () => {},
}: {
  item: InnItem | any
  className: string
  equippedItems?: any[]
  actions?: string[]
  onShowTotalDamage?: boolean
  equippedCallback?: () => void
  onSelect?: (param: InnItem) => void
}) {
  const [equippedWeapon] = (equippedItems || []).filter(
    (i) => i.iType === 'weapon',
  )

  const dismiss = (event: any) => {
    console.log(event)
  }

  const handler = (event: any, sItem: any) => {
    console.log('?')
    if (sItem?.onChangeLatestItem) sItem.onChangeLatestItem()
    if (!sItem.isLatest) {
      return
    }
    console.log(event, sItem)
  }
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
          style={{
            borderColor: toColorByGrade(selectedItem.iGrade),
            borderWidth: '1px',
            borderRadius: '2px',
          }}
          onClick={onClickItem}
        >
          <Tooltip
            className="rounded-none bg-transparent"
            interactive
            // handler={(e: any) => handler(e, item)}
            // open={item.open}
            content={
              <div className="flex gap-[4px] items-start">
                {equippedWeapon && (
                  <div>
                    <div className="text-black">착용중 아이템</div>
                    <WeaponBoxDetailComponent
                      item={equippedWeapon}
                      onShowTotalDamage={onShowTotalDamage}
                      actions={actions}
                      equippedCallback={equippedCallback}
                    />
                  </div>
                )}
                <div>
                  {equippedWeapon && (
                    <div className="text-black">선택된 아이템</div>
                  )}
                  <WeaponBoxDetailComponent
                    item={item}
                    onShowTotalDamage={onShowTotalDamage}
                    actions={actions}
                    equippedCallback={equippedCallback}
                  />
                </div>
              </div>
            }
          >
            <div className="relative max-w-full max-h-full w-[40px] h-[40px]">
              <div className="absolute text-[12px] border rounded px-[2px] ff-ba ff-skew bg-[#424242a6] text-white">
                {totalFlatDamage}
              </div>
              <img
                className="max-w-full max-h-full w-[40px] h-[40px]"
                src={`${toAPIHostURL(selectedItem?.thumbnail)}`}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </>
  )
}

function InventoryComponent(
  { borderStyle, refreshInventory, refreshMe, equippedItems }: any,
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
                    key={createKey()}
                    actions={[
                      InventoryActionKind.Share,
                      InventoryActionKind.Equip,
                      InventoryActionKind.AddToAuction,
                    ]}
                    onShowTotalDamage
                    equippedItems={equippedItems}
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
