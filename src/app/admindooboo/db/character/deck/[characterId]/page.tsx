'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { GatchaCardExtended } from '@/app/main/inn/deck/deck.type'
import { fetchCardSet, fetchGetAllCardSet } from '@/services/api/api.card'
import { CardSetList } from '@/components/deck/card-set-list'

export default function AdminCharacterDeck({
  params,
}: {
  params: { characterId: string }
}) {
  const [allCardSet, setAllCardSet] = useState<Array<GatchaCardExtended>>([])

  const loadAllCardSet = useCallback(async () => {
    const [resultOfAllCards, resultOfMyCards] = await Promise.all([
      fetchGetAllCardSet(),
      fetchCardSet(params.characterId),
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
  }, [params.characterId])

  useEffect(() => {
    loadAllCardSet()
  }, [loadAllCardSet])

  return (
    <div>
      <Card className="p-[10px] rounded">
        <div className="flex flex-wrap gap-[10px]">
          <CardSetList allCardSet={allCardSet} />
        </div>
      </Card>
    </div>
  )
}
