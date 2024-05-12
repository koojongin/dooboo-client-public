'use client'

import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { Pagination } from '@/interfaces/common.interface'
import { Tooltip } from '@material-tailwind/react'
import { getJobIconBgColor, getJobIconUrl, translate } from '@/services/util'
import { useState } from 'react'
import { socket } from '@/services/socket'
import { EmojiPopOver } from '@/components/emoji/emoji-popover'
import {
  EMIT_CHAT_EMOJI_EVENT,
  EMIT_CHAT_MESSAGE_EVENT,
} from '@/interfaces/chat.interface'
import createKey from '@/services/key-generator'

interface IProfileCommentProps {
  character: { nickname: string; level: string; job: string }
}

export function ProfileCommentComponent({ character }: IProfileCommentProps) {
  const [pagination, setPagination] = useState<Pagination>()
  const [enteredMessage, setEnteredMessage] = useState<string>('')

  const sendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    if (!enteredMessage) return

    socket.emit(EMIT_CHAT_MESSAGE_EVENT, { message: enteredMessage })

    setEnteredMessage('')
  }

  const onChangeMessage = (message: string) => {
    setEnteredMessage(message)
  }

  const selectEmoji = (emojiSrc: string) => {
    socket.emit(EMIT_CHAT_EMOJI_EVENT, { src: emojiSrc })
  }

  return (
    <div className="flex flex-col w-2/3 h-full">
      {/* 코멘트 */}
      {new Array(4).fill(1).map(() => {
        return <CommentBox character={character} />
      })}
      {/* 댓글 입력 창 */}
      <div className="flex items-stretch">
        <EmojiPopOver onSelect={(emojiSrc: string) => selectEmoji(emojiSrc)} />
        <input
          className="border border-l-0 p-[4px] w-full text-[14px]"
          placeholder="댓글 내용을 입력하세요. 입력 후 엔터"
          value={enteredMessage}
          onChange={(e) => {
            onChangeMessage(e.target.value)
          }}
          onKeyDown={(event) => sendMessage(event)}
        />
      </div>
      {/* 페이지네이션 */}
      <div className="w-full flex justify-center mt-[15px]">
        {pagination && (
          <div className="flex gap-[4px]">
            {new Array(pagination.totalPages).fill(1).map((value, index) => {
              return (
                <div
                  className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                  // onClick={() => loadCharacters(index + 1)}
                  key={createKey()}
                >
                  {index + 1}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CommentBox({ character }: IProfileCommentProps) {
  return (
    <div className="border border-black w-full h-1/5 flex">
      {/* 댓글 작성자 */}
      <div className="flex items-center gap-1 bg-blue-gray-50 w-1/5 h-full p-4">
        <div className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] border border-gray-600 rounded p-[1px] flex items-center justify-center">
          <img className="w-full" src={DEFAULT_THUMBNAIL_URL} />
        </div>
        <div className="w-full flex flex-col gap-[2px]">
          <Tooltip
            content={`[${translate(`job:${character.job ? character.job : 'novice'}`)}]${
              character.nickname
            }`}
          >
            <div className="flex items-center gap-[2px]">
              <div
                className="w-[20px] h-[20px] min-w-[20px] min-h-[20px]"
                style={{
                  background: getJobIconBgColor(character.job),
                }}
              >
                <img
                  src={getJobIconUrl(character.job)}
                  className="w-full h-full"
                />
              </div>
              <div className="ff-score font-bold leading-[100%] overflow-ellipsis truncate ">
                {character.nickname}
              </div>
            </div>
          </Tooltip>
          <div className="w-full flex justify-between ">
            <div>Lv.{character.level}</div>
          </div>
        </div>
      </div>
      {/* 댓글 내용 */}
      <div className="bg-orange-50 w-3/5 h-full flex items-center p-4">
        이모지 or 댓글내용
      </div>
      {/* 댓글 작성 날짜 */}
      <div className="bg-orange-100 w-1/5 h-full flex items-center justify-center">
        {new Date().toLocaleString()}
      </div>
    </div>
  )
}
