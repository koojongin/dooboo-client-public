'use client'

import Swal from 'sweetalert2'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Chip } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import {
  BaseMisc,
  MiscTypeCategoryKind,
  SelectItemDialogRef,
} from '@/interfaces/item.interface'
import toAPIHostURL from '@/services/image-name-parser'
import {
  fetchCreateShopItem,
  fetchPutShopItem,
} from '@/services/api-admin-fetch'
import { fetchGetShopOne } from '@/services/api/api.shop'
import { ShopItem } from '@/interfaces/shop.interface'
import SelectItemDialog from '@/app/admindooboo/drop/select-item-dialog'

export default function Page({
  params,
  searchParams,
}: {
  params: { shopItemId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const selectItemDialogRef = useRef<SelectItemDialogRef>(null)
  const router = useRouter()
  const imageUploadRef = useRef<any>(null)
  const isCreateMode = params?.shopItemId === 'create'
  const [shopItem, setShopItem] = useState<ShopItem | any>({
    name: '',
    category: MiscTypeCategoryKind.Etc,
  })

  const onSubmit = useCallback(async () => {
    const error = {
      message: '',
    }

    if (!shopItem.name) {
      error.message = '이름없음'
    }

    if (!shopItem.content) {
      error.message = '설명 없음'
    }

    if (!shopItem.baseMiscId) {
      error.message = '보상 없음'
    }

    if (error.message) {
      return Swal.fire({
        title: '실패',
        text: error.message || '알 수 없는 에러',
        icon: 'error',
        confirmButtonText: '닫기',
      })
    }

    if (isCreateMode) await fetchCreateShopItem(shopItem)
    else await fetchPutShopItem(shopItem)
    router.push('/admindooboo/shop')
  }, [shopItem, isCreateMode, router])

  const loadShopItem = useCallback(async (baseMiscId: string) => {
    const result = await fetchGetShopOne(baseMiscId)
    setShopItem(result.shopItem)
  }, [])

  const onSelectItem = (item: BaseMisc, selectedIndex: number) => {
    setShopItem({ ...shopItem, baseMisc: item, baseMiscId: item._id })
  }

  const openSelectItemModal = () => {
    selectItemDialogRef.current?.openDialog(0)
  }

  useEffect(() => {
    if (params.shopItemId !== 'create') loadShopItem(params.shopItemId)
  }, [loadShopItem, params.shopItemId])

  return (
    <div>
      <SelectItemDialog
        ref={selectItemDialogRef}
        onSelectItem={onSelectItem}
        onlyMisc
      />
      <div>아이템 {isCreateMode ? '생성' : '수정'} 페이지</div>
      <div className="flex gap-5">
        <Card className="overflow-auto min-w-[800px]">
          <CardBody>
            <Chip
              variant="outlined"
              size="lg"
              value={`${isCreateMode ? '아이템 옵션' : '수정 옵션'}`}
              className="mb-5 text-[16px] pt-2.5"
            />
            <form onSubmit={onSubmit}>
              <div className="[&>*]:flex [&>*]:items-center [&>*]:gap-1 [&>*>:first-child]:min-w-[150px] flex flex-col gap-2">
                <div>
                  <div>아이템 명</div>
                  <div>
                    <input
                      className="border p-[4px]"
                      value={shopItem.name}
                      onChange={(e) =>
                        setShopItem({ ...shopItem, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>설명</div>
                  <div className="w-full">
                    <textarea
                      className="border w-full p-[5px]"
                      value={shopItem.content}
                      onChange={(e) =>
                        setShopItem({ ...shopItem, content: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div>보상</div>
                  <div className="flex items-center gap-[10px]">
                    {shopItem.baseMisc && (
                      <div>
                        <img
                          className="w-[50px]"
                          src={toAPIHostURL(shopItem.baseMisc.thumbnail)}
                        />
                        <div>{shopItem.baseMisc.name}</div>
                      </div>
                    )}
                    <div
                      className="px-[8px] cursor-pointer rounded bg-green-500 text-white flex items-center justify-center py-0.5"
                      onClick={() => openSelectItemModal()}
                    >
                      보상 템 선택
                    </div>
                  </div>
                </div>

                {/* ================================================================= */}
              </div>

              <div className="flex justify-center mt-5">
                <Button
                  className="w-full"
                  size="md"
                  color="blue"
                  onClick={onSubmit}
                >
                  {isCreateMode ? '생성' : '수정'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
