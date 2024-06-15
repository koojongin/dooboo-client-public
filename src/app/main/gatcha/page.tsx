'use client'

import { Button, Card, Tooltip } from '@material-tailwind/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import createKey from '@/services/key-generator'
import { PickUpBox } from './pickup-box.component'
import { GatchaResultBoxComponent } from '@/app/main/gatcha/gatcha-result-box.component'
import { GatchaRateBoxComponent } from '@/app/main/gatcha/gatcha-rate-box.component'
import {
  fetchGatchaPoints,
  fetchGetCardSet,
  fetchGetGuarenteedPickUpCards,
  fetchPickUp,
} from '@/services/api/api.card'
import { CardSetCategory } from '@/constants/cards.enum'
import { socket } from '@/services/socket'
import { EMIT_PICKUP_LOG_MESSAGE_EVENT } from '@/interfaces/chat.interface'
import { GatchaCard } from '@/interfaces/gatcha.interface'
import { fetchGetMyCurrency } from '@/services/api-fetch'
import GuaranteedSelectDialog from '@/components/gatcha/guaranteed-select-dialog'
import { GuaranteedSelectDialogRef } from '@/components/gatcha/gatcha.interface'
import { CurrencyResponse } from '@/interfaces/currency.interface'
import { translate } from '@/services/util'

enum GatchaState {
  Init = 'Init',
  Run = 'Run',
  PickUpReady = 'PickUpReady',
  Result = 'Result',
}

function RequiredDiamondQuestionDiv({
  diamond,
  amount,
  cardSetCategory,
}: {
  amount: number
  diamond: number
  cardSetCategory: CardSetCategory
}) {
  return (
    <div>
      <div className="">
        정말로 {amount}회 뽑기를 진행하시겠습니까? ({cardSetCategory})
      </div>
      <div className="flex items-center justify-center gap-[4px]">
        <img
          src="/images/icon_diamond.webp"
          className="w-[22px] mr-[2px] mb-[2px]"
        />
        <div className="ff-ba text-[24px]">{diamond.toLocaleString()}</div>
      </div>
    </div>
  )
}

export default function SkillPage() {
  const [cards, setCards] = useState<GatchaCard[]>([])
  const [gatchaState, setGatchaState] = useState<GatchaState>(GatchaState.Init)
  const videoRef = useRef<any>()
  const videoWaitSignRef = useRef<any>()
  const [selectedCardSet, setSelectedCardSet] = useState<{
    cards: any[]
    guaranteed: any[]
  }>()
  const [cardSetCategory, setCardSetCategory] = useState<CardSetCategory>()
  const [lastestPickUpCards, setLastestPickUpCards] = useState<GatchaCard[]>([])
  const [currency, setCurrency] = useState<CurrencyResponse>()
  const [gatchaPoint, setGatchaPoint] = useState<{ point: any }>()
  const guaranteedSelectDialogRef = useRef<GuaranteedSelectDialogRef>()

  const loadCardSet = useCallback(async (categoryName: CardSetCategory) => {
    const [result, resultOfGuaranteed] = await Promise.all([
      fetchGetCardSet(categoryName),
      categoryName !== 'All'
        ? fetchGetGuarenteedPickUpCards(categoryName)
        : { cards: [] },
    ])
    setSelectedCardSet({
      cards: result.cardSet,
      guaranteed: resultOfGuaranteed.cards,
    })
    setCardSetCategory(categoryName)
  }, [])

  const loadGatchaPoints = useCallback(async () => {
    const result = await fetchGatchaPoints()
    let rGatchaPoint = { ...result.gatchaPoint }
    if (rGatchaPoint) {
      if (!rGatchaPoint?.point) {
        rGatchaPoint = { ...rGatchaPoint, point: {} }
      }
    }
    setGatchaPoint(rGatchaPoint)
  }, [])

  const selectGuaranteedPickUp = () => {
    if (!cardSetCategory) return
    if (cardSetCategory === CardSetCategory.All) {
      return Swal.fire({
        title: '상시 모집은 확정 선택이 불가능합니다.',
        confirmButtonText: '확인',
      })
    }
    guaranteedSelectDialogRef.current?.open(cardSetCategory)
  }
  const pickUpCard = async (amount: number) => {
    let diamond = 100 * amount
    if (amount === 10) {
      diamond *= 0.9
    }
    const { isConfirmed } = await withReactContent(Swal).fire({
      html: (
        <RequiredDiamondQuestionDiv
          cardSetCategory={cardSetCategory!}
          amount={amount}
          diamond={diamond}
        />
      ),
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (!isConfirmed) return

    const { cardSet } = await pullingCards(amount)
    videoRef.current.currentTime = 0
    setGatchaState(GatchaState.Run)
    loadMyCurrency()
    loadGatchaPoints()
    setCards(cardSet as [])
  }

  const pullingCards = useCallback(
    async (amount: number) => {
      const result = await fetchPickUp(cardSetCategory!, amount)
      setLastestPickUpCards(result.cardSet)
      return result
    },
    [cardSetCategory],
  )

  const shareToChat = useCallback((pickUpCards: GatchaCard[]) => {
    socket.emit(EMIT_PICKUP_LOG_MESSAGE_EVENT, { cards: pickUpCards })
  }, [])

  const loadMyCurrency = useCallback(async () => {
    const result = await fetchGetMyCurrency()
    setCurrency(result)
  }, [])

  useEffect(() => {
    loadCardSet(CardSetCategory.All)
    loadMyCurrency()
    loadGatchaPoints()
  }, [loadCardSet, loadMyCurrency, loadGatchaPoints])
  return (
    <div className="w-full">
      <GuaranteedSelectDialog
        ref={guaranteedSelectDialogRef}
        refresh={loadGatchaPoints}
      />
      <Card className="rounded bg-white p-[10px] w-full flex flex-col select-none pb-[200px]">
        <div className="flex flex-col gap-[4px] items-start">
          <div className="w-[1000px] flex flex-wrap gap-[4px]">
            {[
              CardSetCategory.All,
              CardSetCategory.HoshinoAndShiroko,
              CardSetCategory.Mashiro,
              CardSetCategory.Aru,
              CardSetCategory.Wakamo,
              CardSetCategory.ShokuhouMisaki,
              CardSetCategory.AzusaSwimsuit,
              CardSetCategory.FlatCardPickUp,
              CardSetCategory.PhysicalPickUp,
            ].map((categoryName, index) => {
              return (
                <div
                  key={createKey()}
                  className="max-w-[150px] min-w-[150px]"
                  onClick={() => loadCardSet(categoryName)}
                >
                  <PickUpBox event={{ categoryName }} />
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-[5px] mt-[10px]">
            <div className="border border-gray-300 shadow-md rounded overflow-hidden">
              <div
                className={`${gatchaState === GatchaState.Init ? '' : 'hidden'}`}
              >
                <div
                  className="flex flex-col gap-[20px] w-full justify-center items-center min-h-[500px] py-[20px]"
                  style={{ background: `url('/images/pickup/background.png')` }}
                >
                  {cardSetCategory === CardSetCategory.All && (
                    <div className="ff-ba ff-skew text-[24px] text-red-500">
                      상시 모집은 모집 포인트가 누적되지 않습니다
                    </div>
                  )}
                  {cardSetCategory !== CardSetCategory.All && (
                    <div className="ff-ba-all ff-skew text-[18px] text-cyan-950 flex flex-col gap-[8px] items-center">
                      <div>
                        1회 모집 시{' '}
                        <span className="p-[2px] ff-wavve bg-cyan-700 text-white rounded">
                          모집 포인트를 1 획득
                        </span>
                        합니다.
                      </div>
                      <div>
                        <span className="p-[2px] ff-wavve bg-cyan-700 text-white rounded">
                          100포인트
                        </span>{' '}
                        누적시 해당 픽업의{' '}
                        <span className="p-[2px] ff-wavve bg-cyan-700 text-white rounded">
                          3성 카드 1장을 확정 선택
                        </span>{' '}
                        할 수 있습니다.
                      </div>
                      <div>픽업 별로 모집 포인트는 별로도 누적됩니다.</div>
                    </div>
                  )}
                  <div className="flex gap-[10px]">
                    <div className="bg-white ff-ba ff-skew text-[20px] rounded border-gray-300 border shadow-lg shadow-gray-400 w-[500px]">
                      {!cardSetCategory && (
                        <div className="bg-transparent">
                          데이터 불러오는중...
                        </div>
                      )}
                      <PickUpBox event={{ categoryName: cardSetCategory! }} />
                    </div>
                    {selectedCardSet && (
                      <div className="flex flex-col bg-white ff-ba ff-skew text-[20px] rounded border-gray-300 border shadow-lg shadow-gray-400 p-[10px] max-w-[300px]">
                        <div className="text-[14px]">
                          해당 픽업으로 모집 시{' '}
                          <span className="p-[2px] ff-wavve bg-cyan-700 text-white rounded">
                            100 모집 포인트
                          </span>
                          로 아래 카드를{' '}
                          <span className="p-[2px] ff-wavve bg-cyan-700 text-white rounded">
                            확정 선택
                          </span>{' '}
                          가능
                        </div>
                        {selectedCardSet.guaranteed.length === 0 && (
                          <div className="text-red-600 flex items-center gap-[10px] text-[16px]">
                            <i className="text-[4px] fa-solid fa-circle" />
                            <div className="">확정 선택 할 수 없는 픽업</div>
                          </div>
                        )}
                        <div className="flex flex-col gap-[2px]">
                          {selectedCardSet.guaranteed.map((card) => {
                            return (
                              <div
                                key={createKey()}
                                className="flex items-center gap-[10px] text-[16px]"
                              >
                                <i className="text-[4px] fa-solid fa-circle" />
                                <div className="flex items-center gap-[4px]">
                                  <div
                                    className="w-[30px] h-[30px] bg-cover bg-center bg-no-repeat border border-gray-500 rounded bg-clip-content p-[1px]"
                                    style={{
                                      backgroundImage: `url('${card.thumbnail}')`,
                                    }}
                                  />
                                  <div className="min-w-[30px] flex items-center justify-center gap-[2px]">
                                    {new Array(card.starForce)
                                      .fill(1)
                                      .map(() => {
                                        return (
                                          <img
                                            key={createKey()}
                                            className="w-[10px] h-[10px]"
                                            src="/images/star_on.png"
                                          />
                                        )
                                      })}
                                  </div>
                                  <div>{translate(`card:${card.name}`)}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-auto text-[16px] flex justify-center items-center bg-cyan-700 text-white ff-wavve rounded py-[2px]">
                          자세한 정보는 아래 리스트 확인
                        </div>
                      </div>
                    )}
                  </div>
                  {cardSetCategory && gatchaPoint && currency && (
                    <div className="flex flex-col gap-[5px]">
                      <div className="flex gap-[5px] items-center justify-center">
                        <Tooltip content="100 청휘석을 소모합니다.">
                          <Button
                            className="w-[150px]"
                            onClick={() => pickUpCard(1)}
                          >
                            1회 뽑기
                          </Button>
                        </Tooltip>
                        <Tooltip content="900 청휘석을 소모합니다.">
                          <Button
                            className="w-[150px]"
                            onClick={() => pickUpCard(10)}
                          >
                            10회 뽑기(-10%)
                          </Button>
                        </Tooltip>
                      </div>
                      {gatchaPoint && (
                        <div className="flex items-center relative h-[40px] justify-center my-[10px]">
                          <img
                            className="absolute z-[5] w-[50px] left-0"
                            src="/images/icon_point.png"
                          />
                          <div className="w-[20px] h-[30px] bg-white skew-x-[-10deg] ml-[20px] border-t border-[#245a7e]" />
                          <div className="bg-white h-[30px] flex items-center w-[140px] skew-x-[-10deg] justify-center border-[#245a7e] border border-x-0">
                            <div className="ff-ba text-[16px] skew-x-[10.1deg] text-[#245a7e]">
                              모집 포인트
                            </div>
                          </div>
                          <div className="bg-[#245a7e] h-[30px] flex items-center w-[90px] skew-x-[-10deg] text-white justify-center border-[#245a7e] border">
                            <div className="skew-x-[10deg]">
                              {gatchaPoint.point[cardSetCategory] || 0}
                            </div>
                          </div>
                          <div
                            className="bg-white text-[#245a7e] px-[10px] h-[30px] flex items-center skew-x-[-10deg] justify-center mr-[20px] rounded-r border-[#245a7e] border hover:bg-gray-800 cursor-pointer hover:text-white"
                            onClick={() => selectGuaranteedPickUp()}
                          >
                            확정 선택
                          </div>
                        </div>
                      )}
                      {gatchaPoint && currency && (
                        <div className="ff-score-all font-bold bg-white/60 rounded flex flex-col items-center justify-center shadow-md">
                          <div className="text-[16px]">보유중인 청휘석</div>
                          <div className="flex justify-center items-center gap-[4px] min-w-[140px] h-[40px] px-[10px]">
                            <img
                              src="/images/icon_diamond.webp"
                              className="w-[22px] mr-[2px] mb-[2px]"
                            />
                            <div className="text-[24px] ff-ba text-blue-400 min-w-[100px] text-center">
                              {currency.diamond.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`${gatchaState === GatchaState.Run ? '' : 'hidden'}`}
              >
                <video
                  muted
                  autoPlay
                  loop
                  ref={videoRef}
                  onClick={() => {
                    setGatchaState(GatchaState.PickUpReady)
                  }}
                >
                  <source src="/video/pickup/arona1.mp4" type="video/mp4" />
                </video>
              </div>
              <div
                className={`${gatchaState === GatchaState.PickUpReady ? '' : 'hidden'}`}
              >
                <video
                  muted
                  autoPlay
                  loop
                  ref={videoWaitSignRef}
                  onClick={() => {
                    setGatchaState(GatchaState.Result)
                  }}
                >
                  <source
                    src="/video/pickup/wait_sign_normal.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div
                className={`relative group ${gatchaState === GatchaState.Result ? '' : 'hidden'}`}
              >
                <div className="invisible group-hover:visible absolute left-0 top-0 w-full h-full z-[5] text-blue-gray-800 flex items-center justify-center bg-gray-800/30">
                  <div className="flex flex-col items-center justify-center gap-[10px]">
                    <div
                      className="p-[1px] border border-gray-600 rounded shadow-lg shadow-gray-400 skew-x-[-10deg]"
                      onClick={() => setGatchaState(GatchaState.Init)}
                    >
                      <div className="hover:shadow-lg hover:shadow-dark-blue hover:bg-gray-800 hover:text-white text-gray-600 bg-white w-[200px] h-[50px] flex items-center justify-center cursor-pointer rounded border border-gray-600">
                        <div className="ff-ba text-[30px]">확인</div>
                      </div>
                    </div>
                    <div
                      className="p-[1px] border border-gray-600 rounded shadow-lg shadow-gray-400 skew-x-[-10deg]"
                      onClick={() => shareToChat(lastestPickUpCards)}
                    >
                      <div className="hover:shadow-lg hover:shadow-dark-blue hover:bg-gray-800 hover:text-white text-gray-600 bg-white w-[200px] h-[50px] flex items-center justify-center cursor-pointer rounded border border-gray-600">
                        <div className="ff-ba text-[30px]">공유</div>
                      </div>
                    </div>
                  </div>
                </div>
                <GatchaResultBoxComponent cards={cards} />
              </div>
            </div>
            {/* End Of Gatcha Video Area --------*/}
            {selectedCardSet && (
              <div className="flex flex-col gap-[1px]">
                <GatchaRateBoxComponent cards={selectedCardSet?.cards} />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
