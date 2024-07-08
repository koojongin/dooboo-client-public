import _ from 'lodash'
import { useCallback } from 'react'
import Swal from 'sweetalert2'
import { Tooltip } from '@material-tailwind/react'
import { CardDeck } from '@/interfaces/gatcha.interface'
import createKey from '@/services/key-generator'
import { fetchCreateDeck, fetchPutActiveDeck } from '@/services/api/api.card'

export function DeckBoxListComponent({
  refresh,
  decks,
}: {
  refresh: () => Promise<void>
  decks: CardDeck[]
}) {
  const MAX_DECK_LENGTH = 5
  const createNewDeck = useCallback(
    async (index: number) => {
      const { isConfirmed } = await Swal.fire({
        text: '신규 덱을 생성하시겠습니까?',
        icon: 'question',
        confirmButtonText: '예',
        denyButtonText: `닫기`,
        showDenyButton: true,
      })

      if (isConfirmed) {
        await fetchCreateDeck(index)
        await refresh()
      }
    },
    [refresh],
  )
  return (
    <>
      <div className="flex justify-start cursor-pointer">
        <Tooltip content="아래의 덱 리스트중 하나를 클릭하면 해당 덱이 활성화 됩니다.">
          <div className="font-bold flex flex-wrap gap-[4px] items-center justify-start">
            <div className="ff-score">덱 목록</div>
            <i className="fa-solid fa-circle-question" />
          </div>
        </Tooltip>
      </div>
      <div className="flex flex-wrap gap-[4px] mb-[10px]">
        {_.range(MAX_DECK_LENGTH).map((value, index) => {
          const deck = decks.find((fDeck) => fDeck.index === index + 1)
          return (
            <div
              key={createKey()}
              className="ff-score-all font-bold text-center flex items-stretch"
            >
              {deck ? (
                <DeckBoxComponent deck={deck} refresh={refresh} />
              ) : (
                <Tooltip content="클릭시 신규 덱을 생성합니다.">
                  <div
                    className="bg-gray-800/50 text-white cursor-pointer px-[10px]"
                    onClick={() => {
                      createNewDeck(index + 1)
                    }}
                  >
                    비어있음
                  </div>
                </Tooltip>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export function DeckBoxComponent({
  deck,
  refresh,
}: {
  deck: CardDeck
  refresh: () => Promise<void>
}) {
  const changeActiveDeck = useCallback(async () => {
    await fetchPutActiveDeck(deck.index)
    await refresh()
  }, [deck.index, refresh])
  return (
    <div
      className={`border border-gray-500 cursor-pointer truncate overflow-ellipsis w-[150px]
      ${deck.isActive ? 'bg-green-500 text-white border-green-600' : ''}
      `}
      onClick={() => {
        changeActiveDeck()
      }}
    >
      {deck.name}
    </div>
  )
}
