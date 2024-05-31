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
  const [selectedCardSet, setSelectedCardSet] = useState<any[]>([])
  const [cardSetCategory, setCardSetCategory] = useState<CardSetCategory>()
  const [lastestPickUpCards, setLastestPickUpCards] = useState<GatchaCard[]>([])
  const [currency, setCurrency] = useState<CurrencyResponse>()
  const [gatchaPoint, setGatchaPoint] = useState<{ point: any }>()
  const guaranteedSelectDialogRef = useRef<GuaranteedSelectDialogRef>()

  const loadCardSet = useCallback(async (categoryName: CardSetCategory) => {
    const result = await fetchGetCardSet(categoryName)
    setSelectedCardSet(result.cardSet)
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
          <div className="w-[1000px] flex gap-[4px]">
            {[
              CardSetCategory.All,
              CardSetCategory.HoshinoAndShiroko,
              CardSetCategory.Mashiro,
              CardSetCategory.Aru,
              CardSetCategory.Wakamo,
              CardSetCategory.ShokuhouMisaki,
              CardSetCategory.AzusaSwimsuit,
            ].map((categoryName, index) => {
              return (
                <div
                  key={createKey()}
                  className="max-w-[150px]"
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
                    <div className="ff-ba-all ff-skew text-[18px] text-red-500 flex flex-col gap-[4px] items-center">
                      <div>1회 모집 시 모집 포인트를 1획득합니다.</div>
                      <div>
                        100포인트 누적시 해당 픽업의 3성 카드 1장을 확정 선택할
                        수 있습니다.
                      </div>
                      <div>픽업별로 모집 포인트는 별로도 누적됩니다.</div>
                      <div className="text-[16px] text-gray-900">
                        아래있는 <span className="text-red-500">확정 선택</span>{' '}
                        클릭시 모집포인트로 선택하는 카드 확인 가능
                      </div>
                    </div>
                  )}
                  <div className="bg-white ff-ba ff-skew text-[20px] rounded border-gray-300 border shadow-lg shadow-gray-400 w-[500px]">
                    {!cardSetCategory && (
                      <div className="bg-transparent">데이터 불러오는중...</div>
                    )}
                    <PickUpBox event={{ categoryName: cardSetCategory! }} />
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
            <div className="flex flex-col gap-[1px]">
              <GatchaRateBoxComponent cardSet={selectedCardSet} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
