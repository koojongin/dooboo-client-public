'use client'

import {
  Card,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from '@material-tailwind/react'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { socket } from '@/services/socket'
import { fetchGetJwtToken } from '@/services/api-fetch'
import {
  EMIT_CHAT_EMOJI_EVENT,
  EMIT_CHAT_MESSAGE_EVENT,
  EMIT_GET_CHARACTERS_EVENT,
  MESSAGE_EVENT,
  MESSAGE_TYPE,
  ON_CHAT_EMOJI_EVENT,
  ON_CHAT_JOIN_EVENT,
  ON_CHAT_MESSAGE_EVENT,
  ON_GET_CHARACTERS_EVENT,
  ON_SHARE_ITEM_EVENT,
} from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import { toEmojiPath, toHHMM } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import { WeaponBoxDetailComponent } from '@/app/main/inventory.component'

interface ConnectedCharacter {
  characterId: string
  exp: number
  iat: number
  nickname: string
}

interface ConnectedCharacterWrapper {
  [id: string]: ConnectedCharacter
}

export function ChatComponent() {
  const pathname = usePathname()
  const chatElementRef = useRef<HTMLDivElement>(null)
  const [enteredMessage, setEnteredMessage] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [connectedCharacters, setConnectedCharacters] =
    useState<ConnectedCharacterWrapper>({})

  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  }

  // const audioNotification = new Audio('/audio/notification.mp3')
  const sendMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    if (!enteredMessage) return
    // chatSocket.emit(EMIT_GET_CHARACTERS_EVENT, {})
    socket.emit(EMIT_CHAT_MESSAGE_EVENT, { message: enteredMessage })
    setEnteredMessage('')
  }
  const onChangeMessage = (message: string) => {
    setEnteredMessage(message)
  }

  const selectEmoji = (emojiNumber: number) => {
    triggers.onMouseLeave()
    socket.emit(EMIT_CHAT_EMOJI_EVENT, { name: emojiNumber })
  }

  const setupSocket = async () => {
    const { token: jwtToken } = await fetchGetJwtToken()
    socket.io.opts.extraHeaders!.Authorization = `Bearer ${jwtToken}`
    socket.connect()
    socket.on('connect', () => {
      console.log('connected')
      socket.emit(EMIT_GET_CHARACTERS_EVENT)
    })
    socket.on(MESSAGE_EVENT, (eventName, data) => {
      switch (eventName) {
        case ON_CHAT_MESSAGE_EVENT:
          // audioNotification.volume = 0.5
          // audioNotification.play()
          setChatMessages((before) => {
            return [...before, data]
          })
          break
        case ON_CHAT_JOIN_EVENT:
          setChatMessages((before) => {
            return [...before, data]
          })
          break
        case ON_GET_CHARACTERS_EVENT:
          // eslint-disable-next-line no-case-declarations
          const { connectedCharacters: rConnectedCharacters } = data || {}
          setConnectedCharacters({ ...rConnectedCharacters })
          break

        case ON_SHARE_ITEM_EVENT:
          setChatMessages((before) => {
            return [...before, data]
          })
          break

        case ON_CHAT_EMOJI_EVENT:
          setChatMessages((before) => {
            return [...before, data]
          })
          break
        default:
          break
      }
    })
  }

  useEffect(() => {
    // chatSocket?.emit(EMIT_CHAT_MESSAGE_EVENT, { message: enteredMessage })
    if (chatElementRef?.current) {
      chatElementRef?.current.scrollTo(0, 99999999999)
    }
  }, [chatMessages])

  useEffect(() => {
    setupSocket()
    return () => {
      socket?.removeAllListeners()
      socket?.disconnect()
    }
  }, [])

  useEffect(() => {}, [pathname])

  const getTotalFlatDamage = (weapon: any) => {
    const selectedItem = weapon
    const totalFlatDamage =
      selectedItem.damageOfPhysical +
      selectedItem.damageOfLightning +
      selectedItem.damageOfCold +
      selectedItem.damageOfFire
    return totalFlatDamage
  }
  return (
    <div
      className={`w-full min-w-[200px] ${pathname.indexOf('main/community') >= 0 ? 'hidden' : ''}`}
    >
      <Card className="rounded p-[10px] resize overflow-auto max-h-[500px]">
        <div>현재 접속자 {Object.keys(connectedCharacters).length}명</div>
        <div className="flex justify-between max-h-[200px] min-h-[150px] text-[14px] wide:flex-col wide:max-h-full wide:h-full">
          <div className="min-w-[200px] overflow-y-scroll border border-r-0 wide:min-h-[80px] wide:max-h-[80px] wide:min-w-full wide:text-start">
            {Object.entries(connectedCharacters).map((data) => {
              const [cId, connectedCharacter] = data
              const { nickname } = connectedCharacter
              return <div key={createKey()}>{nickname}</div>
            })}
          </div>
          <div
            className="overflow-y-scroll w-full text-[14px] wide:h-full wide:max-h-[inherit] flex flex-col gap-[4px] wide:border-l"
            ref={chatElementRef}
          >
            {chatMessages.map((chatMessage) => {
              let messageType = ''

              if (chatMessage.isSystem) {
                messageType = MESSAGE_TYPE.SYSTEM
              }

              if (!chatMessage.isSystem) {
                messageType = MESSAGE_TYPE.NORMAL
                if (chatMessage.item) {
                  messageType = MESSAGE_TYPE.ITEM_SHARE
                }
              }

              if (chatMessage.type) {
                messageType = chatMessage.type
              }

              return (
                <div key={createKey()} className="flex flex-wrap">
                  {messageType === MESSAGE_TYPE.ITEM_SHARE && (
                    <div className="break-all pl-[5px] w-full border-t border-dashed border-b border-amber-800 cursor-pointer">
                      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
                      {`${chatMessage.nickname}: `}
                      <Tooltip
                        className="rounded-none bg-transparent"
                        interactive
                        content={
                          <WeaponBoxDetailComponent
                            item={chatMessage.item}
                          />
                        }
                      >
                        <div className="flex justify-center gap-[2px] items-center">
                          <div className="relative">
                            <div className="absolute z-10 text-[12px] border rounded px-[2px] bg-[#424242a6] text-white ff-ba ff-skew">
                              {getTotalFlatDamage(chatMessage.item.weapon)}
                            </div>
                            <img
                              src={toAPIHostURL(
                                chatMessage.item.weapon.thumbnail,
                              )}
                              className="w-[40px] h-[40px] border rounded p-[1px] bg-white"
                            />
                          </div>
                          [{chatMessage.item.weapon.name}
                          {chatMessage.item.weapon.starForce > 0
                            ? `+${chatMessage.item.weapon.starForce}`
                            : ''}
                          ]
                        </div>
                      </Tooltip>
                    </div>
                  )}

                  {messageType === MESSAGE_TYPE.NORMAL && (
                    <div className="break-all pl-[5px]">
                      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
                      {chatMessage.nickname}: {chatMessage.message}
                    </div>
                  )}

                  {messageType === MESSAGE_TYPE.EMOJI && (
                    <div className="break-all pl-[5px] flex flex-col wide:w-full">
                      <div>
                        {`[${toHHMM(new Date(chatMessage.timestamp))}] `}{' '}
                        {chatMessage.nickname}:{' '}
                      </div>
                      <div className="wide:w-full wide:flex wide:justify-center">
                        <div className="w-[120px] h-[120px]">
                          <img src={toEmojiPath(chatMessage.emoji)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {messageType === MESSAGE_TYPE.SYSTEM && (
                    <div className="break-all pl-[5px]">
                      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
                      {chatMessage.message}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex items-stretch">
          <Popover handler={setOpenPopover} open={openPopover}>
            <PopoverHandler>
              <div className="w-[32px] h-[32px] border border-r-0 flex items-center justify-center cursor-pointer">
                <img src="/images/emoji/icon_emoji_select.png" />
              </div>
            </PopoverHandler>
            <PopoverContent className="rounded p-0 m-0 p-[10px]">
              <div className="flex flex-wrap gap-[1px] w-[404px]">
                {new Array(19).fill(1).map((v, index) => {
                  const src = `/images/emoji/ClanChat_Emoji_${`${index + 1}`.padStart(2, '0')}_kr.png`
                  return (
                    <img
                      key={createKey()}
                      src={src}
                      onClick={() => selectEmoji(index + 1)}
                      className="w-[80px] h-[80px] cursor-pointer"
                    />
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
          <input
            className="border p-[4px] w-full text-[14px]"
            placeholder="채팅 내용을 입력하세요. 입력 후 엔터"
            value={enteredMessage}
            onChange={(e) => {
              onChangeMessage(e.target.value)
            }}
            onKeyDown={(event) => sendMessage(event)}
          />
        </div>
      </Card>
    </div>
  )
}
