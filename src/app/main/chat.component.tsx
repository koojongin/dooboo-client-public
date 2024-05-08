'use client'

import {
  Card,
  Popover,
  PopoverContent,
  PopoverHandler,
  Tooltip,
} from '@material-tailwind/react'
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
// import { useResizeDetector } from 'react-resize-detector'
import { Socket } from 'socket.io-client'
import { socket } from '@/services/socket'
import { fetchGetJwtToken } from '@/services/api-fetch'
import {
  EMIT_CHAT_EMOJI_EVENT,
  EMIT_CHAT_MESSAGE_EVENT,
  EMIT_GET_CHARACTERS_EVENT,
  EMIT_NOTICE_MESSAGE_EVENT,
  MESSAGE_EVENT,
  MESSAGE_TYPE,
  ON_CHAT_EMOJI_EVENT,
  ON_CHAT_JOIN_EVENT,
  ON_CHAT_MESSAGE_EVENT,
  ON_GET_CHARACTERS_EVENT,
  ON_NOTICE_MESSAGE_EVENT,
  ON_SHARE_ITEM_EVENT,
} from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import {
  isExistLoginToken,
  parseHtml,
  toColorByGrade,
  toEmojiPath,
  toHHMM,
} from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import WeaponBoxDetailComponent from '@/components/item/weapon-box-detail.component'

interface ConnectedCharacter {
  characterId: string
  exp: number
  iat: number
  nickname: string
}

interface ConnectedCharacterWrapper {
  [id: string]: ConnectedCharacter
}

export enum EmoticonKind {
  BlueArchive = 'BlueArchive',
  Pepe = 'Pepe',
  Mangu = 'Mangu',
  Nike = 'Nike',
}

export function ChatComponent() {
  const pathname = usePathname()
  const chatElementRef = useRef<HTMLDivElement>(null)
  const [enteredMessage, setEnteredMessage] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [connectedCharacters, setConnectedCharacters] =
    useState<ConnectedCharacterWrapper>({})
  // const { width, height, ref } = useResizeDetector()
  const [openPopover, setOpenPopover] = useState<boolean>(false)
  const [openPopoverUserAction, setOpenPopoverUserAction] =
    useState<boolean>(false)

  const [selectedEmoticonGroup, setSelectedEmoticonGroup] =
    useState<EmoticonKind>(EmoticonKind.BlueArchive)

  const audioBellRef = useRef<HTMLAudioElement>()
  const audioWhisperRef = useRef<HTMLAudioElement>()
  const audioMessageAlert = useRef<HTMLAudioElement>()

  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  }

  const [isFoldedBox, setIsFoldedBox] = useState<boolean>(false)

  const sendMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    if (!enteredMessage) return
    // chatSocket.emit(EMIT_GET_CHARACTERS_EVENT, {})
    if (enteredMessage.indexOf('/공지 ') >= 0) {
      const [, ...messages] = enteredMessage.split('/공지 ')
      socket.emit(EMIT_NOTICE_MESSAGE_EVENT, { message: messages.join('') })
    } else {
      socket.emit(EMIT_CHAT_MESSAGE_EVENT, { message: enteredMessage })
    }
    setEnteredMessage('')
  }

  const onClickCharacter = (data: any) => {
    setOpenPopoverUserAction(!openPopoverUserAction)
    setEnteredMessage(`${enteredMessage}@${data?.nickname}`)
  }
  const onChangeMessage = (message: string) => {
    setEnteredMessage(message)
  }

  const selectEmoji = (emojiSrc: string) => {
    triggers.onMouseLeave()
    socket.emit(EMIT_CHAT_EMOJI_EVENT, { src: emojiSrc })
  }
  const getTotalFlatDamage = (weapon: any) => {
    const selectedItem = weapon
    const totalFlatDamage =
      selectedItem.damageOfPhysical +
      selectedItem.damageOfLightning +
      selectedItem.damageOfCold +
      selectedItem.damageOfFire
    return totalFlatDamage
  }

  const setupSocket = async () => {
    const { token: jwtToken, character } = await fetchGetJwtToken()
    localStorage.setItem('characterId', character._id)
    localStorage.setItem('nickname', character.nickname)
    socket.io.opts.extraHeaders!.Authorization = `Bearer ${jwtToken}`
    socket.connect()
    socket.on('connect', () => {
      socket.emit(EMIT_GET_CHARACTERS_EVENT)
    })

    addMessageEvent(socket)
  }

  const addMessageEvent = (selectedSocket: Socket) => {
    selectedSocket.on(MESSAGE_EVENT, (eventName, data) => {
      const localNickName = localStorage.getItem('nickname')
      const isMe = data?.message?.indexOf(`@${localNickName}`) >= 0 || false
      switch (eventName) {
        case ON_CHAT_MESSAGE_EVENT:
          if (isMe) {
            if (audioWhisperRef.current) {
              audioWhisperRef.current.volume = 0.3
              audioWhisperRef.current.play()
            }
            const nickReplacer = new RegExp(`\\@{1}(${localNickName})`, 'g')
            // eslint-disable-next-line no-param-reassign
            data.message = data.message.replace(
              nickReplacer,
              '<span class="bg-red-300 text-white">$1</span>',
            )
          }

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
        case ON_NOTICE_MESSAGE_EVENT:
          if (audioBellRef.current) {
            audioBellRef.current.volume = 0.5
            audioBellRef.current.play()
          }
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
    if (chatElementRef?.current) {
      chatElementRef?.current.scrollTo(0, 99999999999)
    }
  }, [chatMessages])

  useEffect(() => {
    if (!isExistLoginToken()) return
    setupSocket()
    audioBellRef.current = new Audio('/audio/bell.flac')
    audioWhisperRef.current = new Audio('/audio/whisper.mp3')
    audioMessageAlert.current = new Audio('/audio/mokoko.mp3')
    return () => {
      socket?.removeAllListeners()
      socket?.disconnect()
    }
  }, [])

  useEffect(() => {}, [pathname])

  return (
    <div
      className={`w-full ${pathname.indexOf('main/community') >= 0 || isFoldedBox ? 'fixed bottom-[40px] left-0' : 'wide:w-[300px]'}`}
    >
      <div
        className="ff-wavve cursor-pointer border bg-ruliweb text-white p-[2px] rounded z-50"
        style={{ display: !isFoldedBox ? 'none' : 'flex' }}
        onClick={() => {
          setIsFoldedBox(!isFoldedBox)
        }}
      >
        채팅창 펼치기
      </div>
      <div
        style={{ display: isFoldedBox ? 'none' : 'flex' }}
        className={`w-full ${pathname.indexOf('main/community') >= 0 ? 'fixed bottom-[30px] left-0' : 'wide:w-[300px]'}`}
      >
        <div
          className={`w-full ${isFoldedBox && pathname.indexOf('main/community') < 0 ? 'min-w-[50px]' : 'min-w-[200px]'}`}
        >
          <Card
            className={`${isFoldedBox ? 'h-[50px]' : ''} ${isFoldedBox && pathname.indexOf('main/community') < 0 ? 'w-[50px]' : ''} rounded p-[10px] resize overflow-auto ${pathname.indexOf('main/community') >= 0 ? 'max-h-[initial]' : 'max-h-[500px]'}`}
          >
            <div
              className={`flex gap-[2px] items-center ${isFoldedBox && pathname.indexOf('main/community') < 0 ? 'flex-col' : ''}`}
            >
              <div
                className="ff-wavve cursor-pointer border bg-ruliweb text-white p-[2px] rounded"
                onClick={() => {
                  setIsFoldedBox(!isFoldedBox)
                }}
              >
                접기
              </div>
              <div>
                <div>
                  현재 접속자 {Object.keys(connectedCharacters).length}명
                </div>
              </div>
            </div>
            <div
              className={`flex justify-between text-[14px] ${pathname.indexOf('main/community') >= 0 ? 'wide:flex-row h-[220px]' : 'wide:h-full wide:flex-col max-h-[200px] min-h-[150px] wide:max-h-full'}`}
            >
              <div
                className={`min-w-[200px] overflow-y-scroll border border-r-0 ${pathname.indexOf('main/community') >= 0 ? '' : 'wide:min-h-[80px] wide:min-w-full wide:max-h-[80px] wide:text-start'} `}
              >
                {Object.entries(connectedCharacters).map((data, index) => {
                  const [cId, connectedCharacter] = data
                  const { nickname } = connectedCharacter
                  return (
                    <div key={createKey()} className="hover:bg-gray-100">
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          onClickCharacter(connectedCharacter)
                        }}
                      >
                        {nickname}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div
                className={`overflow-y-scroll w-full text-[14px] ${pathname.indexOf('main/community') >= 0 ? 'h-full' : 'wide:h-full'} wide:max-h-[inherit] flex flex-col gap-[4px] wide:border-l`}
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
                            <div className="flex items-center gap-[2px]">
                              <div
                                className="relative"
                                style={{
                                  borderColor: toColorByGrade(
                                    chatMessage.item.weapon.iGrade,
                                  ),
                                  borderWidth: '1px',
                                  borderRadius: '2px',
                                }}
                              >
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
                          {parseHtml(
                            `[${toHHMM(new Date(chatMessage.timestamp))}] ${chatMessage.nickname}: ${chatMessage.message}`,
                          )}
                          {/* {`[${toHHMM(new Date(chatMessage.timestamp))}] `} */}
                          {/* {chatMessage.nickname}: {chatMessage.message} */}
                        </div>
                      )}

                      {messageType === MESSAGE_TYPE.EMOJI && (
                        <div className="break-all pl-[5px] flex flex-col wide:w-full">
                          <div>
                            {`[${toHHMM(new Date(chatMessage.timestamp))}] `}{' '}
                            {chatMessage.nickname}:{' '}
                          </div>
                          <div className="">
                            <div className="w-[80px] h-[80px]">
                              <img src={chatMessage.emoji} />
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

                      {messageType === MESSAGE_TYPE.NOTICE && (
                        <div className="break-all pl-[5px] bg-blue-gray-500 text-white py-[2px] text-[16px] w-full ff-ba ff-skew">
                          {chatMessage.message}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex items-stretch">
              <Popover
                handler={setOpenPopover}
                open={openPopover}
                placement="left"
              >
                <PopoverHandler>
                  <div className="w-[32px] h-[32px] border border-r-0 flex items-center justify-center cursor-pointer">
                    <img src="/images/emoji/icon_emoji_select.png" />
                  </div>
                </PopoverHandler>
                <PopoverContent className="rounded p-0 m-0 p-[10px]">
                  <div className="flex w-full overflow-x-scroll text-[16px]">
                    {Object.keys(EmoticonKind).map(
                      (emoticonName, index, row) => {
                        return (
                          <div
                            key={`emoji_${emoticonName}`}
                            onClick={() =>
                              setSelectedEmoticonGroup(
                                emoticonName as EmoticonKind,
                              )
                            }
                            className={`${emoticonName === selectedEmoticonGroup ? 'bg-dark-blue text-white' : ''} flex items-center justify-center ff-ba ff-skew border border-gray-400 min-w-[40px] min-h-[24px] px-[2px] cursor-pointer border-b-0 ${row.length === index + 1 ? '' : 'border-r-0'}`}
                          >
                            {emoticonName}
                          </div>
                        )
                      },
                    )}
                  </div>
                  <div className="flex flex-wrap content-start gap-[1px] w-[604px] overflow-y-scroll gap-y-0 h-[300px] border-gray-500 border">
                    {selectedEmoticonGroup === EmoticonKind.BlueArchive &&
                      new Array(28).fill(1).map((v, index) => {
                        const src = `/images/emoji/ClanChat_Emoji_${`${index + 1}`.padStart(2, '0')}_Kr.png`
                        return (
                          <img
                            key={createKey()}
                            src={src}
                            onClick={() => selectEmoji(src)}
                            className="w-[80px] h-[80px] cursor-pointer"
                          />
                        )
                      })}
                    {selectedEmoticonGroup === EmoticonKind.Pepe &&
                      new Array(15).fill(1).map((v, index) => {
                        const src = `/images/emoji/pepe_${`${index + 1}`.padStart(3, '0')}.png`
                        return (
                          <img
                            key={createKey()}
                            src={src}
                            onClick={() => selectEmoji(src)}
                            className="w-[80px] h-[80px] cursor-pointer"
                          />
                        )
                      })}
                    {selectedEmoticonGroup === EmoticonKind.Mangu &&
                      new Array(10).fill(1).map((v, index) => {
                        const src = `/images/emoji/mangu_${`${index + 1}`.padStart(3, '0')}.png`
                        return (
                          <img
                            key={createKey()}
                            src={src}
                            onClick={() => selectEmoji(src)}
                            className="w-[80px] h-[80px] cursor-pointer"
                          />
                        )
                      })}
                    {selectedEmoticonGroup === EmoticonKind.Nike &&
                      new Array(24).fill(1).map((v, index) => {
                        const src = `/images/emoji/nike_${`${index + 1}`.padStart(3, '0')}.png`
                        return (
                          <img
                            key={createKey()}
                            src={src}
                            onClick={() => selectEmoji(src)}
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
      </div>
    </div>
  )
}
