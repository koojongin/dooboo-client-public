'use client'

import { Card } from '@material-tailwind/react'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { CardDeck } from '@/interfaces/gatcha.interface'
import { fetchGetMyDeck, fetchPutDeckName } from '@/services/api/api.card'
import createKey from '@/services/key-generator'
import { GatchaCardComponent } from '@/components/deck/gatcha-card'

export default function DeckManagementPage() {
  const [decks, setDecks] = useState<CardDeck[]>([])
  const loadMyDecks = useCallback(async () => {
    const result = await fetchGetMyDeck()
    setDecks(_.orderBy(result.decks, ['index'], ['asc']))
  }, [])

  const changeDeckName = useCallback(
    async (deck: CardDeck) => {
      await fetchPutDeckName(deck._id!, deck.name)
      await loadMyDecks()
      await Swal.fire({
        text: '덱 이름이 정상적으로 변경되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      })
    },
    [loadMyDecks],
  )

  useEffect(() => {
    loadMyDecks()
  }, [loadMyDecks])

  return (
    <Card className="rounded p-[10px] ff-score-all font-bold">
      <div>덱 관리</div>
      {decks.length === 0 && <div>관리 할 수 있는 덱 목록이 없습니다.</div>}
      {decks.length > 0 && (
        <div className="flex flex-col gap-[10px] items-start">
          {decks.map((deck, index) => {
            return (
              <div
                key={deck._id}
                className="flex items-center border border-blue-950 min-w-[500px] justify-start p-[10px] rounded shadow-md shadow-gray-800/60"
              >
                <div className="min-w-[40px] flex items-center justify-center rounded-full mr-[10px] ff-wavve bg-gray-800 text-white shadow-md shadow-gray-800/30">
                  {deck.index}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-stretch text-[14px] mb-[5px]">
                    <input
                      value={deck.name}
                      maxLength={50}
                      onChange={(e) => {
                        const newDecks = [...decks]
                        newDecks[index] = {
                          ...newDecks[index],
                          name: e.target.value,
                        }
                        setDecks(newDecks)
                      }}
                      className="border border-green-600 text-[16px] p-[5px]"
                    />
                    <div
                      className="bg-green-600 text-white p-[5px] cursor-pointer items-center flex"
                      onClick={() => changeDeckName(deck)}
                    >
                      덱 이름 변경
                    </div>
                  </div>
                  <div className="flex gap-[4px]">
                    {deck.cards.map((card) => {
                      return (
                        <div
                          key={createKey()}
                          className="border border-blue-950 shadow-md shadow-gray-900/60 rounded overflow-hidden"
                        >
                          <GatchaCardComponent card={card} isOwn />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
