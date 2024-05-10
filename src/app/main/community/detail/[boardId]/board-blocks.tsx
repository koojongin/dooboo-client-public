import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { toYYYYMMDDHHMMSS } from '@/services/util'
import createKey from '@/services/key-generator'
import { Board } from '@/interfaces/board.interface'
import {
  fetchDeleteCommentOne,
  fetchPostBoardComment,
} from '@/services/api-fetch'
import { EmojiPopOver } from '@/components/emoji/emoji-popover'

export function BoardCommentListBlock({
  board,
  refresh = async () => {},
}: {
  board: Board | undefined
  refresh?: () => void
}) {
  const [selectedCommentBoxIndex, setSelectedCommentBoxIndex] =
    useState<number>(-1)
  const [characterId, setCharacterId] = useState<string>()
  const deleteComment = async (commentId: string) => {
    const { isConfirmed } = await Swal.fire({
      title: '댓글을 정말로 삭제하시겠습니까?',
      text: '삭제 후엔 복구 할 수 없습니다.',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      await fetchDeleteCommentOne(commentId)
      if (refresh) refresh()
    }
  }

  const onSelectEmoji = async (parentCommentId: string, src: string) => {
    await writeSubComment(
      parentCommentId,
      `<img class="w-[90px]" src='${src}'/>`,
    )
  }

  const writeSubComment = async (
    parentCommentId: string,
    customContent?: string,
  ) => {
    if (!board) return
    const element: any =
      document.querySelector('textarea.comment-textarea') || {}
    const commentText = customContent || element?.value
    if (!commentText)
      return Swal.fire({
        title: '내용을 입력하세요.',
        icon: 'error',
        confirmButtonText: '확인',
      })

    await fetchPostBoardComment(board._id!, {
      content: commentText,
      parentCommentId,
    })

    await Promise.all([
      Swal.fire({
        title: '댓글이 등록되었습니다',
        icon: 'success',
        confirmButtonText: '확인',
      }),
      refresh(),
    ])
  }

  useEffect(() => {
    setCharacterId(localStorage.getItem('characterId') || '')
  }, [])

  return (
    <>
      {board?.comments?.map((comment, index) => {
        // COMMENT START----------------------------------
        return (
          <div key={createKey()}>
            <div
              className={`w-full flex items-stretch border border-t-gray-400 border-dotted ${index === 0 ? 'border-t-0' : ''}`}
            >
              <div className="w-[200px] p-[8px] bg-gray-100 flex items-center gap-[4px]">
                {!comment.isDeleted && (
                  <>
                    <div className="w-[40px] h-[40px]">
                      <img
                        className="w-full h-full"
                        src={
                          comment.character.thumbnail || DEFAULT_THUMBNAIL_URL
                        }
                      />
                    </div>
                    <div className="font-bold flex gap-[2px] items-start flex-col">
                      <div className="text-[11px] border rounded-[2px] px-[4px] py-[1px] bg-ruliweb text-white border-blue-900 ff-dodoom">
                        Lv.{comment.character.level}
                      </div>
                      <div>{comment.character.nickname}</div>
                    </div>
                  </>
                )}
                {comment.isDeleted && (
                  <div className="w-full h-full text-blue-gray-300 flex items-center justify-center">
                    x
                  </div>
                )}
              </div>
              <div className="w-full flex justify-between items-stretch">
                {!comment.isDeleted && (
                  <div className="w-full h-full p-[10px] text-[12px] focus-visible:outline-0 flex flex-col items-center">
                    <div className="flex flex-wrap items-center w-full h-full">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: comment.content,
                        }}
                      />
                      <span className="pl-[10px] flex items-center gap-[10px]">
                        <span
                          className="text-ruliweb text-[12px] flex items-center gap-[2px] py-[4px] cursor-pointer"
                          onClick={() => {
                            setSelectedCommentBoxIndex(index)
                          }}
                        >
                          <i className="fa-solid fa-turn-up rotate-90" />
                          답글
                        </span>
                        {characterId === comment.character._id && (
                          <div
                            className="flex items-center cursor-pointer text-red-600"
                            onClick={() => deleteComment(comment._id)}
                          >
                            <i className="fa-solid fa-xmark" />
                            <div className="font-bold">삭제</div>
                          </div>
                        )}
                      </span>
                    </div>
                    {selectedCommentBoxIndex === index && (
                      <div className="w-full border-t border-dashed border-t-gray-200 mt-[10px]">
                        <div className="flex justify-start w-full border-r border-dashed border-r-gray-200">
                          <EmojiPopOver
                            onSelect={(emojiSrc: string) =>
                              onSelectEmoji(comment._id, emojiSrc)
                            }
                          />
                        </div>
                        <div
                          className={`border border-gray-400 flex min-h-[80px] text-[12px] w-full ${selectedCommentBoxIndex === index ? '' : 'hidden'}`}
                        >
                          <textarea
                            className="w-full focus-visible:outline-0 overflow-y-scroll comment-textarea"
                            placeholder="인터넷은 우리가 함께 만들어가는 소중한 공간입니다. 댓글 작성 시 타인에 대한 배려와 책임을 담아주세요."
                          />
                          <div
                            className="min-w-[100px] flex items-center justify-center bg-ruliweb text-white cursor-pointer"
                            onClick={() => writeSubComment(comment._id)}
                          >
                            등록
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {comment.isDeleted && (
                  <div className="w-full h-full p-[10px] text-[12px] flex flex-col items-start text-gray-00">
                    작성자에 의해 삭제된 댓글입니다.
                  </div>
                )}
                <div className="text-[12px] flex items-center justify-center text-center bg-gray-100 min-w-[110px]">
                  {toYYYYMMDDHHMMSS(comment.createdAt)}
                </div>
              </div>
            </div>
            {comment.subComments.map((subComment: any) => {
              return (
                <div
                  className="w-full flex items-stretch border border-t-gray-400 border-dotted"
                  key={createKey()}
                >
                  <div className="w-[200px] p-[8px] bg-gray-100 flex items-center gap-[4px]">
                    <span
                      className="text-ruliweb text-[12px] flex items-center gap-[2px] py-[4px] cursor-pointer"
                      onClick={() => {
                        setSelectedCommentBoxIndex(index)
                      }}
                    >
                      <i className="fa-solid fa-turn-up rotate-90 text-[20px]" />
                    </span>
                    <div className="w-[40px] h-[40px]">
                      <img
                        className="w-full h-full"
                        src={
                          subComment.character.thumbnail ||
                          DEFAULT_THUMBNAIL_URL
                        }
                      />
                    </div>
                    <div className="font-bold flex gap-[2px] items-start flex-col">
                      <div className="text-[11px] border rounded-[2px] px-[4px] py-[1px] bg-ruliweb text-white border-blue-900">
                        Lv.{subComment.character.level}
                      </div>
                      <div>{subComment.character.nickname}</div>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-stretch">
                    <div className="w-full p-[10px] text-[13px] focus-visible:outline-0 flex flex-col items-start justify-center">
                      <div className="pl-[10px] font-bold text-[11px] text-[#999]">
                        {comment.character.nickname}
                      </div>
                      <div className="flex flex-wrap items-center w-full pl-[10px]">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: subComment.content,
                          }}
                        />
                        <div className="gap-[10px] ml-[10px]">
                          {characterId === subComment.character._id && (
                            <div
                              className="flex items-center cursor-pointer text-red-600"
                              onClick={() => deleteComment(subComment._id)}
                            >
                              <i className="fa-solid fa-xmark" />
                              <div className="font-bold">삭제</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-[12px] flex items-center justify-center text-center bg-gray-100 min-w-[110px]">
                      {toYYYYMMDDHHMMSS(comment.createdAt)}
                    </div>
                  </div>
                </div>
              )
            })}
            {/* SUB COMMENT END ----------------------------------*/}
          </div>
        )
      })}
    </>
  )
}
