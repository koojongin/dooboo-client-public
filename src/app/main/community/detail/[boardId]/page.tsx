'use client'

import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { Board } from '@/interfaces/board.interface'
import {
  fetchDeleteBoardOne,
  fetchDeleteCommentOne,
  fetchGetBoardOne,
  fetchPostBoardComment,
} from '@/services/api-fetch'
import { toYYYYMMDDHHMMSS } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { BoardCommentListBlock } from '@/app/main/community/detail/[boardId]/board-blocks'
import { EmojiPopOver } from '@/components/emoji/emoji-popover'

export default function BoardDetail({
  params,
}: {
  params: { boardId: string }
}) {
  const router = useRouter()
  const [board, setBoard] = useState<Board>()
  const [commentContent, setCommentContent] = useState<string>('')
  const [commentSubContent, setCommentSubContent] = useState<string>('')

  const loadBoard = useCallback(async () => {
    setBoard(undefined)
    const result = await fetchGetBoardOne(params.boardId)
    setBoard(result.board)
  }, [params.boardId])

  const goToRoute = (path: string) => {
    router.push(path)
  }

  const goBack = () => {
    router.back()
  }

  const recommend = async () => {
    await Swal.fire({
      title: '미지원',
      text: '관리자에게 문의하세요',
      icon: 'info',
      confirmButtonText: '확인',
    })
  }

  const onSelectEmoji = async (src: string) => {
    await writeComment(`<img class="w-[90px]" src='${src}'/>`)
  }

  const writeComment = async (customContent?: string) => {
    if (!board) return
    const result = await fetchPostBoardComment(board._id!, {
      content: customContent || commentContent,
    })

    await Promise.all([
      Swal.fire({
        title: '댓글이 등록되었습니다',
        icon: 'success',
        confirmButtonText: '확인',
      }),
      loadBoard(),
    ])

    setCommentContent('')
  }
  const editPost = async () => {
    router.push(`/main/community/edit/${board?._id}`)
  }
  const deletePost = async () => {
    const { isConfirmed } = await Swal.fire({
      title: '게시글을 정말로 삭제하시겠습니까?',
      text: '삭제 후엔 복구 할 수 없습니다.',
      confirmButtonText: '예',
      denyButtonText: `닫기`,
      showDenyButton: true,
    })

    if (isConfirmed) {
      if (!board) return
      const result = await fetchDeleteBoardOne(board._id!)
      router.back()
    }
  }

  const onClickWriteButton = () => {
    router.push('/main/community/write')
    // router.push('/main/community')
  }

  useEffect(() => {
    loadBoard()
  }, [loadBoard])

  return (
    <div>
      <div className="flex mt-[10px] mb-[10px] gap-[1px]">
        <div
          onClick={() => goBack()}
          className="bg-ruliweb text-white py-[4px] px-[6px] font-bold text-[14px] cursor-pointer"
        >
          목록으로
        </div>
        <div
          className="bg-blue-300 text-white py-[4px] px-[6px] font-bold text-[14px] cursor-pointer"
          onClick={() => onClickWriteButton()}
        >
          글쓰기
        </div>
        <div
          onClick={() => editPost()}
          className="bg-white border-ruliweb border text-ruliweb py-[4px] px-[6px] font-bold text-[14px] cursor-pointer"
        >
          수정
        </div>
        <div
          onClick={() => deletePost()}
          className="bg-white border-ruliweb border text-ruliweb py-[4px] px-[6px] font-bold text-[14px] cursor-pointer"
        >
          삭제
        </div>
      </div>
      {board && (
        <div className="border border-gray-400">
          <div className="border-b border-b-gray-400 p-[10px] font-bold bg-gray-100">
            {board.title}
          </div>
          <div className="flex p-[10px] border-b border-b-gray-400 gap-[4px]">
            <div className="w-[100px] h-[100px] border-b-gray-400 border p-[2px]">
              <img
                src={
                  toAPIHostURL(board.character?.thumbnail) ||
                  DEFAULT_THUMBNAIL_URL
                }
              />
            </div>
            <div className="flex flex-col gap-[4px] justify-center">
              <div className="font-bold">
                [Lv.{board.character?.level}]{board.character?.nickname}
              </div>
              <div className="flex items-center gap-[4px] text-[12px]">
                <div>조회 {board.reads.toLocaleString()}</div>
                <div>추천 {board.recommends.toLocaleString()}</div>
              </div>
              <div className="text-[12px]">
                작성일 {toYYYYMMDDHHMMSS(new Date(board.createdAt!))}
              </div>
            </div>
          </div>
          <div
            className="p-[10px] text-[14px] ql-editor"
            dangerouslySetInnerHTML={{
              __html: board.content,
            }}
          >
            {/* {parseHtml(board.content)} */}
          </div>
          <div className="w-full flex justify-center my-[30px]">
            <div
              className="flex flex-col justify-center items-center border border-gray-500 rounded px-[20px] py-[10px] cursor-pointer"
              onClick={() => recommend()}
            >
              <div className="text-[12px] text-red-300 font-bold">
                {board.recommends}
              </div>
              <i className="far fa-thumbs-up text-ruliweb" />
            </div>
          </div>
        </div>
      )}
      <div
        className={`w-full border border-gray-400 my-[10px] text-[14px] ${board?.comments!.length === 0 ? 'invisible' : ''}`}
      >
        <BoardCommentListBlock board={board} refresh={loadBoard} />
      </div>
      <div className="mt-[10px]">
        <EmojiPopOver
          onSelect={(emojiSrc: string) => onSelectEmoji(emojiSrc)}
        />
        <div className="border border-gray-400 flex min-h-[80px] text-[12px]">
          <textarea
            className="w-full focus-visible:outline-0 overflow-y-scroll"
            placeholder="인터넷은 우리가 함께 만들어가는 소중한 공간입니다. 댓글 작성 시 타인에 대한 배려와 책임을 담아주세요."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <div
            className="min-w-[100px] flex items-center justify-center bg-ruliweb text-white cursor-pointer"
            onClick={() => writeComment()}
          >
            등록
          </div>
        </div>
      </div>
      <div className="flex gap-[4px] mt-[10px]">
        <div
          onClick={() => goBack()}
          className="bg-ruliweb text-white py-[4px] px-[6px] font-bold text-[14px] cursor-pointer"
        >
          목록으로
        </div>
      </div>
    </div>
  )
}
