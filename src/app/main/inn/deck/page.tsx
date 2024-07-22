'use client'

import { Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import {
  fetchGetAllCardSet,
  fetchGetMyCardSet,
  fetchGetMyDeck,
  fetchSaveDeck,
} from '@/services/api/api.card'
import { translate } from '@/services/util'
import createKey from '@/services/key-generator'
import { GatchaCardExtended } from '@/app/main/inn/deck/deck.type'
import { SummpedCardOptions } from '@/components/deck/summped-card-options'
import { GatchaCardComponent } from '@/components/deck/gatcha-card'
import { fetchPurchaseCard } from '@/services/api/api.item'
import { CardDeck } from '@/interfaces/gatcha.interface'
import { DeckBoxListComponent } from '@/app/main/inn/deck/deck-box.component'

export default function DeckPage() {
  const router = useRouter()

  const [allCardSet, setAllCardSet] = useState<Array<GatchaCardExtended>>([])
  const [deckCardSet, setDeckCardSet] = useState<Array<GatchaCardExtended>>([])
  const [summedCardOptions, setSummedCardOptions] = useState<any[]>([])
  const [decks, setDecks] = useState<CardDeck[]>([])
  const [maxCardSlots, setMaxCardSlots] = useState<number>(0)
  const loadMyCards = useCallback(async () => {
    const result = await fetchGetMyDeck()
    setMaxCardSlots(result.maxCardSlots)
    setDeckCardSet(result.cards)
    setDecks(_.orderBy(result.decks, ['index'], ['asc']))
  }, [])

  const loadAllCardSet = useCallback(async () => {
    const [resultOfAllCards, resultOfMyCards] = await Promise.all([
      fetchGetAllCardSet(),
      fetchGetMyCardSet(),
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
  }, [])

  const saveDeck = async () => {
    await fetchSaveDeck(deckCardSet.map((card) => card.name))
    await Swal.fire({
      title: '덱이 수정되었습니다.',
      confirmButtonText: '확인',
    })
  }

  const onClickCard = async (card: GatchaCardExtended) => {
    if ((card.stack || 0) === 0) {
      const { isConfirmed } = await Swal.fire({
        text: `[${translate(`card:${card.name}`)}] 청휘석 50,000개를 사용하여 구매하시겠습니까?`,
        icon: 'question',
        confirmButtonText: '예',
        denyButtonText: `닫기`,
        showDenyButton: true,
      })
      if (isConfirmed) {
        await fetchPurchaseCard(card.name)
        await refresh()
      }
      return
    }
    if (deckCardSet.length >= maxCardSlots) return
    if (deckCardSet.map((deckCard) => deckCard.name).includes(card.name)) return
    const updatedCardSet = [...deckCardSet, card]
    setDeckCardSet(updatedCardSet)
  }

  const popCardInDeck = (index: number) => {
    if (!deckCardSet[index]) return
    deckCardSet.splice(index, 1)
    setDeckCardSet([...deckCardSet])
  }

  const refresh = useCallback(async () => {
    await Promise.all([loadAllCardSet(), loadMyCards()])
  }, [loadAllCardSet, loadMyCards])

  const goToRoute = (path: string) => {
    router.push(path)
  }

  useEffect(() => {
    refresh()
  }, [loadAllCardSet, loadMyCards, refresh])

  useEffect(() => {
    if (allCardSet.length === 0) {
      return
    }
    const mixedCards = deckCardSet.map((card) => {
      let newCard = { ...card }
      const matchedCard = allCardSet.find(
        (aCard) => aCard.name === newCard.name,
      )
      if (matchedCard) {
        newCard = { ...newCard, options: matchedCard.options }
      }
      return newCard
    })
    const groupedCard = _.groupBy(
      mixedCards.map((uCard) => uCard.options).flat(),
      'name',
    )
    const combinedOptions = _.chain(groupedCard)
      .mapValues((optionsInSingle) => {
        return optionsInSingle.reduce((prev, next: any) => {
          return { ...prev, value: prev.value + next.value }
        })
      })
      .values()
      .value()
    setSummedCardOptions(combinedOptions)
  }, [allCardSet, deckCardSet])

  return (
    <div>
      <Card className="rounded p-[10px] select-none">
        <div>
          <div className="flex justify-start items-stretch gap-[5px] mb-[5px] text-[16px] h-[28px]">
            <div
              className="bg-green-600 text-white px-[10px] cursor-pointer hover:bg-green-500 flex items-center justify-center"
              onClick={() => saveDeck()}
            >
              선택된 덱 저장
            </div>
            <div
              className="bg-red-400 text-white flex items-center justify-center p-[10px]"
              onClick={() => goToRoute('/main/inn/deck/management')}
            >
              관리
            </div>
          </div>
          {decks && <DeckBoxListComponent decks={decks} refresh={refresh} />}
          <div className="flex gap-[10px]">
            <div>
              <div className="flex flex-wrap gap-[10px]">
                {new Array(maxCardSlots).fill(1).map((v, index) => {
                  const baseCard = deckCardSet[index]
                  const [extendedBaseCard] = allCardSet.filter(
                    (aCard) => aCard.name === baseCard?.name,
                  )
                  const card = {
                    ...baseCard,
                    options: extendedBaseCard?.options,
                  }

                  return (
                    <div
                      key={createKey()}
                      className="p-[1px] border border-gray-500 shadow-md shadow-gray-400 flex flex-col"
                    >
                      <div
                        className="flex flex-col min-w-[100px] items-center"
                        style={{ height: baseCard ? '' : '100%' }}
                      >
                        {!baseCard && (
                          <div className="w-full h-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        )}
                        {baseCard && (
                          <Tooltip
                            className="bg-black/80"
                            content={
                              <div>
                                <div className="border-b border-b-white mb-[5px]">
                                  클릭 시 덱에서 제외됩니다.
                                </div>
                                {card?.options?.map((option) => {
                                  return (
                                    <div
                                      key={createKey()}
                                      className="flex flex-col"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          {translate(
                                            `card:option:${option.name}`,
                                          )}
                                        </div>
                                        <div className="ml-[10px]">
                                          {option.value}
                                        </div>
                                      </div>
                                      {option.desc && (
                                        <div className="flex items-center gap-[5px]">
                                          <i className="ml-[10px] fa-solid fa-turn-up rotate-90" />
                                          <div>{option.desc}</div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            }
                          >
                            <div
                              onClick={() => {
                                popCardInDeck(index)
                              }}
                            >
                              <GatchaCardComponent card={baseCard} isOwn />
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {summedCardOptions.length > 0 && (
              <div className="border border-gray-600 p-[4px] flex flex-col gap-[4px]">
                <SummpedCardOptions options={summedCardOptions} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-[20px]">
          <div className="ff-score font-bold">
            카드를 클릭해서 덱에 추가하세요
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {_.sortBy(allCardSet, 'starForce')
              .reverse()
              .map((card) => {
                return (
                  <Tooltip
                    className="bg-black/80"
                    interactive
                    key={`card_frame_${card.name}`}
                    content={
                      <div>
                        {card.options.map((option) => {
                          return (
                            <div key={createKey()} className="flex flex-col">
                              <div className="flex items-center justify-between">
                                <div>
                                  {translate(`card:option:${option.name}`)}
                                </div>
                                <div className="ml-[10px]">{option.value}</div>
                              </div>
                              {option.desc && (
                                <div className="flex items-center gap-[5px]">
                                  <i className="ml-[10px] fa-solid fa-turn-up rotate-90" />
                                  <div>{option.desc}</div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    }
                  >
                    <div
                      className="p-[1px] border border-gray-500 shadow-md shadow-gray-400 cursor-pointer"
                      onClick={() => onClickCard(card)}
                    >
                      <div className="flex flex-col border border-gray-300 min-w-[100px] max-w-[100px] items-center">
                        <div
                          className={`relative w-[100px] h-[100px] bg-cover bg-no-repeat bg-center ${(card.stack || 0) > 0 ? '' : 'brightness-[.2]'}`}
                          style={{
                            backgroundImage: `url('${card.thumbnail}')`,
                          }}
                        >
                          {(card.stack || 0) > 0 && (
                            <>
                              <div className="absolute right-0 ff-wavve bottom-0 bg-white/85 text-gray-800 text-[12px] border border-gray-600 px-[3px] flex items-center justify-center m-[1px]">
                                x{card.stack}
                              </div>
                              <div className="absolute left-0 top-0 ff-wavve font-bold bg-white/95 text-gray-900 text-[14px] px-[3px] flex items-center justify-center border border-dotted border-blue-950">
                                Lv.{card.level}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex bg-white/90 items-center justify-center ff-ba text-[16px] h-[22px]">
                          {new Array(card.starForce).fill(1).map(() => (
                            <img
                              key={createKey()}
                              className="w-[16px] h-[16px]"
                              src="/images/star_on.png"
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-center py-[4px] bg-blueGray-500 text-white w-full max-w-full">
                          <div className="ff-ba text-[16px] overflow-ellipsis truncate px-[4px]">
                            {translate(`card:${card.name}`)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                )
              })}
          </div>
        </div>
      </Card>
    </div>
  )
}
