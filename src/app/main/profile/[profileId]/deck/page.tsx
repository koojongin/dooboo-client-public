'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import { GatchaCardExtended } from '@/app/main/inn/deck/deck.type'
import {
  fetchGetAllCardSet,
  fetchGetCardsByCharacterId,
  fetchGetDeckByCharacter,
} from '@/services/api/api.card'
import { CardSetList } from '@/components/deck/card-set-list'
import { GatchaCardComponent } from '@/components/deck/gatcha-card'
import createKey from '@/services/key-generator'
import { CardDeck } from '@/interfaces/gatcha.interface'

export default function ProfileDeckPage({
  params,
}: {
  params: { profileId: string }
}) {
  const [allCardSet, setAllCardSet] = useState<Array<GatchaCardExtended>>([])

  const [deck, setDeck] = useState<CardDeck>()
  const [decks, setDecks] = useState<CardDeck[]>([])

  const loadMyCards = useCallback(async () => {
    const result = await fetchGetDeckByCharacter(params.profileId)
    setDeck(result.deck)
    setDecks(result.decks)
  }, [params.profileId])

  const changeDeck = (index: number) => {
    if (decks.length <= 0) return
    setDeck(decks[index])
  }

  const loadAllCardSet = useCallback(async () => {
    const [resultOfAllCards, resultOfMyCards] = await Promise.all([
      fetchGetAllCardSet(),
      fetchGetCardsByCharacterId(params.profileId),
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
          <div className="flex items-center ff-score font-bold text-[20px] gap-[10px]">
            덱 리스트
            <div className="flex gap-[4px] mb-[5px]">
              {decks?.map((cardDeck, index) => {
                const isSelectedDeck = deck!._id! === cardDeck._id!
                return (
                  <div
                    key={`deck-${cardDeck._id}`}
                    className={`ff-score h-[30px] flex items-center justify-center border border-blue-950 cursor-pointer p-[10px] 
                    ${isSelectedDeck ? 'bg-green-600 text-white border-green-600' : ''}`}
                    onClick={() => {
                      changeDeck(index)
                    }}
                  >
                    {cardDeck.isActive && (
                      <Tooltip content="사용중인 덱">
                        <i className="fa-solid fa-square-check" />
                      </Tooltip>
                    )}
                    {cardDeck.name}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-[4px]">
            {deck &&
              deck.cards.map((card) => {
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
