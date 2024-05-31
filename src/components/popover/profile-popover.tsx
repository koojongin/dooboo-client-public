import {
  Popover,
  PopoverContent,
  PopoverHandler,
} from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import Swal from 'sweetalert2'
import {
  fetchChangeProfileCard,
  fetchGetAllCardSet,
  fetchGetMyCardSet,
} from '@/services/api/api.card'
import { GatchaCard } from '@/interfaces/gatcha.interface'
import createKey from '@/services/key-generator'

export function ProfilePopover({
  child,
  onSelect,
}: {
  child: any
  onSelect: any
}) {
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [allCards, setAllCards] = useState<GatchaCard[]>([])
  const [myCards, setMyCards] = useState<
    { thumbnail: string; name: string; isOwn?: boolean }[]
  >([])

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  }

  const selectCard = async (card: {
    thumbnail: string
    name: string
    isOwn?: boolean
  }) => {
    if (!card?.isOwn) {
      return Swal.fire({
        title: '보유중이 아닙니다.',
        confirmButtonText: '확인',
      })
    }

    await fetchChangeProfileCard(card.name)
    triggers.onMouseLeave()
    onSelect()
  }

  const loadAllCards = useCallback(async () => {
    const [resultOfAllCards, resultOfMyCards] = await Promise.all([
      fetchGetAllCardSet(),
      fetchGetMyCardSet(),
    ])

    setAllCards(resultOfAllCards.cardSet)
    const mergedCards = [
      ...resultOfMyCards.cardSet.map((card) => ({
        thumbnail: card.thumbnail,
        name: card.name,
        isOwn: true,
      })),
      ...resultOfAllCards.cardSet.map((card) => ({
        thumbnail: card.thumbnail,
        name: card.name,
      })),
    ]

    setMyCards(_.uniqBy(mergedCards, 'name'))
  }, [])

  useEffect(() => {
    loadAllCards()
  }, [loadAllCards])
  return (
    <Popover handler={setOpenPopover} open={openPopover} placement="left">
      <PopoverHandler>{child}</PopoverHandler>
      <PopoverContent className="rounded m-0 p-[10px] min-w-[870px] max-w-[870px]">
        <div className="ff-score font-bold text-[20px] text-[#245a7e]">
          변경할 프로필 카드를 선택하세요.
        </div>
        <div className="flex flex-wrap gap-[4px] overflow-y-scroll max-h-[400px]">
          {myCards.map((card) => {
            return (
              <div
                onClick={() => selectCard(card)}
                className={`hover:bg-white hover:z-[5] hover:border-[4px] hover:border-[#245a7e] cursor-pointer border border-gray-500 rounded w-[80px] h-[80px] bg-cover bg-center ${card.isOwn ? '' : 'brightness-[.2]'}`}
                key={createKey()}
                style={{
                  backgroundImage: `url('${card.thumbnail}')`,
                }}
              />
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
