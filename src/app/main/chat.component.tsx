'use client'

import { Card } from '@material-tailwind/react'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { socket } from '@/services/socket'
import { fetchGetJwtToken } from '@/services/api-fetch'
import {
  EMIT_CHAT_JOIN_EVENT,
  EMIT_CHAT_MESSAGE_EVENT,
  EMIT_GET_CHARACTERS_EVENT,
  MESSAGE_EVENT,
  ON_CHAT_JOIN_EVENT,
  ON_CHAT_MESSAGE_EVENT,
  ON_GET_CHARACTERS_EVENT,
} from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'
import { toHHMM, toMMDDHHMM } from '@/services/util'

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
  const chatElementRef = useRef<HTMLDivElement>(null)
  const [enteredMessage, setEnteredMessage] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [connectedCharacters, setConnectedCharacters] =
    useState<ConnectedCharacterWrapper>({})
  const [chatSocket, setChatSocket] = useState<Socket>()
  const sendMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    if (!chatSocket) return
    if (!enteredMessage) return
    // chatSocket.emit(EMIT_GET_CHARACTERS_EVENT, {})
    chatSocket?.emit(EMIT_CHAT_MESSAGE_EVENT, { message: enteredMessage })
    setEnteredMessage('')
  }
  const onChangeMessage = (message: string) => {
    setEnteredMessage(message)
  }

  const setupSocket = async () => {
    const { token: jwtToken } = await fetchGetJwtToken()
    socket.io.opts.extraHeaders!.Authorization = `Bearer ${jwtToken}`
    const cSocket = socket.connect()
    cSocket.on(MESSAGE_EVENT, (eventName, data) => {
      console.log(eventName, data)
      switch (eventName) {
        case ON_CHAT_MESSAGE_EVENT:
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
        default:
          break
      }
    })

    cSocket?.emit(EMIT_CHAT_JOIN_EVENT)
    setChatSocket(cSocket)
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

  return (
    <div className="w-full">
      <Card className="rounded p-[10px]">
        <div>현재 접속자 {Object.keys(connectedCharacters).length}명</div>
        <div className="flex justify-between max-h-[200px] min-h-[150px]">
          <div className="min-w-[200px] overflow-y-scroll border border-r-0">
            {Object.entries(connectedCharacters).map((data) => {
              const [cId, connectedCharacter] = data
              const { nickname } = connectedCharacter
              return <div key={createKey()}>{nickname}</div>
            })}
          </div>
          <div className="overflow-y-scroll w-full" ref={chatElementRef}>
            {chatMessages.map((chatMessage) => {
              return (
                <div key={createKey()} className="flex flex-wrap">
                  {!chatMessage.isSystem && (
                    <div className="break-all pl-[5px]">
                      {`[${toHHMM(new Date(chatMessage.timestamp))}] `}
                      {chatMessage.nickname}: {chatMessage.message}
                    </div>
                  )}

                  {chatMessage.isSystem && (
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
        <div>
          <input
            className="border p-[4px] w-full"
            placeholder="채팅 내용을 이곳에 입력하세요. 입력 후 엔터"
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
