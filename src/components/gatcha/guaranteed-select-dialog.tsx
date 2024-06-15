'use client'

import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { Dialog, DialogBody } from '@material-tailwind/react'
import Swal from 'sweetalert2'
import { GuaranteedSelectDialogRef } from '@/components/gatcha/gatcha.interface'
import { CardSetCategory } from '@/constants/cards.enum'
import {
  fetchGetGuarenteedPickUpCards,
  fetchPickUpGuarenteedCard,
} from '@/services/api/api.card'
import { GatchaCardExtended } from '@/app/main/inn/deck/deck.type'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'

function GuaranteedSelectDialog(
  { refresh = async () => {} }: { refresh: () => Promise<void> },
  ref: ForwardedRef<GuaranteedSelectDialogRef>,
) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<CardSetCategory>()
  const [cards, setCards] = useState<GatchaCardExtended[]>([])
  const handleOpen = async (cardSetCategory?: CardSetCategory) => {
    setOpen(!open)
    await loadCards(cardSetCategory)
  }

  const loadCards = useCallback(
    async (cardSetCategory?: CardSetCategory) => {
      setCards([])
      if (!category && !cardSetCategory) return
      const result = await fetchGetGuarenteedPickUpCards(
        (cardSetCategory || category)!,
      )
      setCards(result.cards)
    },
    [category],
  )

  const selectGuaranteedPickUp = async (cardName: string) => {
    setOpen(false)
    await fetchPickUpGuarenteedCard(cardName, category!)
    await Promise.all([
      refresh(),
      Swal.fire({
        title: '확정권을 이용해서 카드를 획득하였습니다.',
        confirmButtonText: '확인',
      }),
    ])
  }

  useImperativeHandle(ref, () => ({
    open: async (cardSetCategory: CardSetCategory) => {
      setCategory(cardSetCategory)
      await handleOpen(cardSetCategory)
    },
    refresh: () => {},
  }))

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogBody className="ff-score-all font-bold">
        <div>{category}</div>
        <div className="flex items-center gap-[10px] mb-[10px]">
          <img className="w-[50px]" src="/images/icon_point.png" />
          <div className="text-[#245a7e]">
            확정 선택은 100 모집 포인트가 필요합니다.
          </div>
        </div>
        <div className="flex flex-col gap-[4px]">
          {cards.length === 0 && <div>Loading...</div>}
          {cards &&
            cards.map((card) => {
              return (
                <div
                  key={createKey()}
                  className="flex text-[#245a7e] items-center border border-[#245a7e] p-[10px]"
                >
                  <img
                    className="w-[100px] border border-[#245a7e]"
                    src={card.thumbnail}
                  />
                  <div className="w-[100px] flex items-center justify-center gap-[2px]">
                    {new Array(card.starForce).fill(1).map(() => {
                      return (
                        <img
                          key={createKey()}
                          className="w-[16px] h-[16px]"
                          src="/images/star_on.png"
                        />
                      )
                    })}
                  </div>
                  <div>{translate(`card:${card.name}`)}</div>
                  <div
                    className="ml-auto bg-[#245a7e] text-white flex items-center justify-center w-[100px] h-[30px] cursor-pointer"
                    onClick={() => selectGuaranteedPickUp(card.name)}
                  >
                    선택하기
                  </div>
                </div>
              )
            })}
        </div>
        <div
          className="mt-[10px] ff-score text-[20px] flex justify-center cursor-pointer"
          onClick={() => setOpen(false)}
        >
          취소
        </div>
      </DialogBody>
    </Dialog>
  )
}

export default forwardRef<any, any>(GuaranteedSelectDialog)
