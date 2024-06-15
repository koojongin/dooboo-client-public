'use client'

import { Card } from '@material-tailwind/react'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Socket } from 'socket.io-client'
import { socket } from '@/services/socket'
import { fetchGetJwtToken } from '@/services/api-fetch'
import {
  EMIT_CHAT_EMOJI_EVENT,
  EMIT_CHAT_MESSAGE_EVENT,
  EMIT_GET_CHARACTERS_EVENT,
  EMIT_NOTICE_MESSAGE_EVENT,
  MESSAGE_EVENT,
  MessageType,
  ON_CHAT_EMOJI_EVENT,
  ON_CHAT_JOIN_EVENT,
  ON_CHAT_MESSAGE_EVENT,
  ON_ENHANCED_LOG_MESSAGE_EVENT,
  ON_GET_CHARACTERS_EVENT,
  ON_NOTICE_MESSAGE_EVENT,
  ON_PICKUP_LOG_MESSAGE_EVENT,
  ON_SHARE_GOLD_BOX_RESULT_EVENT,
  ON_SHARE_ITEM_EVENT,
} from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import { isExistLoginToken, parseHtml, toHHMM } from '@/services/util'
import { EmojiPopOver, EmoticonKind } from '@/components/emoji/emoji-popover'
import { ChatEnhancedLogComponent } from '@/components/chat/components/chat-enhanced-log.component'
import { ChatItemShareComponent } from '@/components/chat/components/chat-item-share.component'
import { ChatPickupLogComponent } from '@/components/chat/components/chat-pickup-log.component'
import { ChatCharacterPopOver } from '@/components/chat/components/chat-character-pop-over'
import { ConnectedCharacterWrapper } from '@/components/chat/components/chat.types'
import { ChatGoldBoxResultComponent } from '@/components/chat/components/chat-gold-box-result.component'
import { ChatRaidOpenComponent } from '@/components/chat/components/chat-raid-open.component'

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

  const onClickMessage = (message: { characterId: string }) => {
    if (!message?.characterId) return
    window?.open(`/main/profile/${message.characterId}`, '_blank')
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
        case ON_ENHANCED_LOG_MESSAGE_EVENT:
          setChatMessages((before) => {
            return [...before, data]
          })
          break
        case ON_PICKUP_LOG_MESSAGE_EVENT:
          setChatMessages((before) => {
            return [...before, data]
          })
          break
        case ON_CHAT_EMOJI_EVENT:
          setChatMessages((before) => {
            return [...before, data]
          })
          break
        case ON_SHARE_GOLD_BOX_RESULT_EVENT:
          setChatMessages((before) => {
            return [...before, data]
          })
          break
        case MessageType.RaidOpen:
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
      const { scrollTop, scrollHeight, offsetHeight } = chatElementRef.current
      if (
        scrollHeight - scrollTop - offsetHeight <= 150 ||
        scrollHeight <= offsetHeight * 2
      ) {
        chatElementRef?.current.scrollTo(0, 99999999999)
      }

      if (chatMessages.length > 50) setChatMessages(chatMessages.slice(-50))
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
                      <div className="cursor-pointer">
                        <ChatCharacterPopOver
                          connectedCharacter={connectedCharacter}
                          onClickCall={() =>
                            onClickCharacter(connectedCharacter)
                          }
                          child={<div>{nickname}</div>}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div
                className={`overflow-y-scroll w-full text-[14px] ${pathname.indexOf('main/community') >= 0 ? 'h-full' : 'wide:h-full wide:min-h-[300px]'} wide:max-h-[inherit] flex flex-col gap-[4px] wide:border-l`}
                ref={chatElementRef}
              >
                {chatMessages.map((chatMessage) => {
                  let messageType = ''

                  if (chatMessage.isSystem) {
                    messageType = MessageType.System
                  }

                  if (!chatMessage.isSystem) {
                    messageType = MessageType.Normal
                    if (chatMessage.item) {
                      messageType = MessageType.ItemShare
                    }
                  }

                  if (chatMessage.type) {
                    messageType = chatMessage.type
                  }

                  return (
                    <div
                      key={createKey()}
                      className="flex flex-wrap cursor-pointer"
                      onClick={() => {
                        onClickMessage(chatMessage)
                      }}
                    >
                      {messageType === MessageType.ItemShare && (
                        <ChatItemShareComponent chatMessage={chatMessage} />
                      )}

                      {messageType === MessageType.Normal && (
                        <div className="break-all pl-[5px]">
                          {parseHtml(
                            `[${toHHMM(new Date(chatMessage.timestamp))}] ${chatMessage.nickname}: ${chatMessage.message}`,
                          )}
                          {/* {`[${toHHMM(new Date(chatMessage.timestamp))}] `} */}
                          {/* {chatMessage.nickname}: {chatMessage.message} */}
                        </div>
                      )}

                      {messageType === MessageType.Emoji && (
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

                      {messageType === MessageType.System && (
                        <div className="break-all pl-[5px]">
                          {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
                          {chatMessage.message}
                        </div>
                      )}

                      {messageType === MessageType.Notice && (
                        <div className="break-all pl-[5px] bg-blue-gray-500 text-white py-[2px] text-[16px] w-full ff-ba ff-skew">
                          {chatMessage.message}
                        </div>
                      )}

                      {messageType === MessageType.EnhancedLog && (
                        <ChatEnhancedLogComponent chatMessage={chatMessage} />
                      )}

                      {messageType === MessageType.PickUpLog && (
                        <ChatPickupLogComponent chatMessage={chatMessage} />
                      )}

                      {messageType === MessageType.GoldBoxResultShare && (
                        <ChatGoldBoxResultComponent chatMessage={chatMessage} />
                      )}

                      {messageType === MessageType.RaidOpen && (
                        <ChatRaidOpenComponent chatMessage={chatMessage} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex items-stretch">
              <EmojiPopOver
                onSelect={(emojiSrc: string) => selectEmoji(emojiSrc)}
              />
              <input
                className="border border-l-0 p-[4px] w-full text-[14px]"
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
