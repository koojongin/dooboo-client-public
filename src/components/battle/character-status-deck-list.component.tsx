import { Tooltip } from '@material-tailwind/react'
import createKey from '@/services/key-generator'
import { translate } from '@/services/util'
import { CardDeck, GatchaCard } from '@/interfaces/gatcha.interface'
import { GatchaCardComponent } from '@/components/deck/gatcha-card'

export default function CharacterStatusDeckListComponent({
  deck,
  allCardSet,
}: {
  deck: CardDeck
  allCardSet: GatchaCard[] | []
}) {
  const mixedCards = deck.cards.map((card) => {
    const newCard: GatchaCard = { ...card }
    const foundCard = allCardSet.find((aCard) => aCard.name === newCard.name)
    if (foundCard) newCard.options = foundCard.options
    return { ...newCard }
  })
  return (
    <div>
      <div className="flex flex-wrap gap-[10px]">
        {new Array(5).fill(1).map((v, index) => {
          const card = mixedCards[index]
          return (
            <div
              key={createKey()}
              className="p-[1px] border border-gray-500 shadow-md shadow-gray-400"
            >
              <div className="h-full flex flex-col border border-gray-300 min-w-[100px] items-center">
                {!card && (
                  <div className="w-full h-full flex items-center justify-center" />
                )}
                {card && (
                  <Tooltip
                    content={
                      <div>
                        {card?.options?.map((option) => {
                          return (
                            <div
                              key={`option_csd_${card.name}_${option.name}`}
                              className="flex items-center justify-between"
                            >
                              <div>
                                {translate(`card:option:${option.name}`)}
                              </div>
                              <div className="ml-[10px]">{option.value}</div>
                            </div>
                          )
                        })}
                      </div>
                    }
                  >
                    <div>
                      <GatchaCardComponent card={card} isOwn />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
