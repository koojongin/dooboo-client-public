'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { GatchaCardExtended } from '@/app/main/inn/deck/deck.type'
import {
  fetchCardSet,
  fetchGetAllCardSet,
  fetchGetDeckByCharacter,
} from '@/services/api/api.card'
import { CardSetList } from '@/components/deck/card-set-list'
import { GatchaCardComponent } from '@/components/deck/gatcha-card'
import createKey from '@/services/key-generator'

export default function ProfileDeckPage({
  params,
}: {
  params: { profileId: string }
}) {
  const [allCardSet, setAllCardSet] = useState<Array<GatchaCardExtended>>([])

  const [deckCardSet, setDeckCardSet] = useState<Array<GatchaCardExtended>>([])

  const loadMyCards = useCallback(async () => {
    const result = await fetchGetDeckByCharacter(params.profileId)
    setDeckCardSet(result.cards)
  }, [params.profileId])

  const loadAllCardSet = useCallback(async () => {
    const [resultOfAllCards, resultOfMyCards] = await Promise.all([
      fetchGetAllCardSet(),
      fetchCardSet(params.profileId),
    ])

    const allCards = resultOfAllCards.cardSet.map((card) => {
      let newCard = { ...card }
      const existCard = resultOfMyCards.cardSet.find(
        (myCard) => myCard.name === card.name,
      )
      if (existCard) newCard = existCard
      return newCard
    })
    setAllCardSet(allCards)
  }, [params.profileId])

  useEffect(() => {
    loadAllCardSet()
    loadMyCards()
  }, [loadAllCardSet, loadMyCards])

  return (
    <div>
      <Card className="p-[10px] rounded">
        <div>
          <div className="ff-score font-bold text-[20px]">사용중인 덱</div>
          <div className="flex flex-wrap gap-[4px]">
            {deckCardSet &&
              deckCardSet.map((card) => {
                return (
                  <div key={createKey()} className="border border-gray-200">
                    <GatchaCardComponent card={card} isOwn width={100} />
                  </div>
                )
              })}
          </div>
        </div>
        <div className="my-[10px] border-b border-b-blue-gray-900" />
        <div className="">
          <div className="ff-score font-bold text-[20px]">
            보유중인 카드 목록
          </div>
          <div className="flex flex-wrap gap-[4px]">
            <CardSetList allCardSet={allCardSet} />
          </div>
        </div>
      </Card>
    </div>
  )
}
