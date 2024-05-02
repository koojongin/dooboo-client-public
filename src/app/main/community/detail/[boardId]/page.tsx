'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { Board } from '@/interfaces/board.interface'
import {
  fetchDeleteBoardOne,
  fetchGetBoardOne,
  fetchPostBoardComment,
} from '@/services/api-fetch'
import { ago, parseHtml, toYYYYMMDDHHMMSS } from '@/services/util'
import toAPIHostURL from '@/services/image-name-parser'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import createKey from '@/services/key-generator'

export default function BoardDetail({
  params,
}: {
  params: { boardId: string }
}) {
  const router = useRouter()
  const [board, setBoard] = useState<Board>()
  const [commentContent, setCommentContent] = useState<string>('')
  const [commentSubContent, setCommentSubContent] = useState<string>('')
  const [selectedCommentBoxIndex, setSelectedCommentBoxIndex] =
    useState<number>(-1)

  const loadBoard = async () => {
    const result = await fetchGetBoardOne(params.boardId)
    setBoard(result.board)
  }

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

  const writeComment = async () => {
    if (!board) return
    const result = await fetchPostBoardComment(board._id!, {
      content: commentContent,
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
  const writeSubComment = async (parentCommentId: string) => {
    if (!board) return
    const element: any =
      document.querySelector('textarea.comment-textarea') || {}
    const commentText = element?.value
    if (!commentText)
      return Swal.fire({
        title: '내용을 입력하세요.',
        icon: 'error',
        confirmButtonText: '확인',
      })

    const result = await fetchPostBoardComment(board._id!, {
      content: commentText,
      parentCommentId,
    })

    await Promise.all([
      Swal.fire({
        title: '댓글이 등록되었습니다',
        icon: 'success',
        confirmButtonText: '확인',
      }),
      loadBoard(),
    ])
  }

  const editPost = async () => {
    console.log(localStorage.getItem('token'))
    router.push(`/main/community/edit/${board?._id}`)
  }
  const deletePost = async () => {
    const { isConfirmed } = await Swal.fire({
      title: '정말로 삭제하시겠습니까?',
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
  }

  useEffect(() => {
    loadBoard()
  }, [])
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
            {board.title}a
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
        {board?.comments?.map((comment, index) => {
          // COMMENT START----------------------------------
          return (
            <div key={createKey()}>
              <div
                className={`w-full flex items-stretch border border-t-gray-400 border-dotted ${index === 0 ? 'border-t-0' : ''}`}
              >
                <div className="w-[200px] p-[8px] bg-gray-100 flex items-center gap-[4px]">
                  <div className="w-[40px] h-[40px]">
                    <img
                      className="w-full h-full"
                      src={comment.character.thumbnail || DEFAULT_THUMBNAIL_URL}
                    />
                  </div>
                  <div className="font-bold flex gap-[2px] items-start flex-col">
                    <div className="text-[11px] border rounded-[2px] px-[4px] py-[1px] bg-ruliweb text-white border-blue-900 ff-dodoom">
                      Lv.{comment.character.level}
                    </div>
                    <div>{comment.character.nickname}</div>
                  </div>
                </div>
                <div className="w-full flex justify-between items-stretch">
                  <div className="w-full h-full p-[10px] text-[12px] focus-visible:outline-0 flex flex-col items-center">
                    <div className="flex flex-wrap items-center w-full h-full">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: comment.content,
                        }}
                      />
                      <span className="pl-[10px]">
                        <span
                          className="text-ruliweb text-[12px] flex items-center gap-[2px] py-[4px] cursor-pointer"
                          onClick={() => {
                            setSelectedCommentBoxIndex(index)
                          }}
                        >
                          <i className="fa-solid fa-turn-up rotate-90" />
                          답글
                        </span>
                      </span>
                    </div>
                    {selectedCommentBoxIndex === index && (
                      <div
                        className={`border border-gray-400 flex min-h-[80px] text-[12px] mt-[10px] w-full ${selectedCommentBoxIndex === index ? '' : 'hidden'}`}
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
                    )}
                  </div>
                  <div className="text-[12px] flex items-center justify-center text-center bg-gray-100 min-w-[110px]">
                    {toYYYYMMDDHHMMSS(comment.createdAt)}
                  </div>
                </div>
              </div>
              {/* SUB COMMENT START ----------------------------------*/}
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
                          {/* <span className="pl-[10px]">
                            <span
                              className="text-ruliweb text-[12px] flex items-center gap-[2px] py-[4px] cursor-pointer"
                              onClick={() => {
                                setSelectedCommentBoxIndex(index)
                              }}
                            >
                              <i className="fa-solid fa-turn-up rotate-90" />
                              답글
                            </span>
                          </span> */}
                        </div>
                        {/* {selectedCommentBoxIndex === index && (
                          <div
                            className={`border border-gray-400 flex min-h-[80px] text-[12px] mt-[10px] w-full ${selectedCommentBoxIndex === index ? '' : 'hidden'}`}
                          >
                            <textarea
                              className="w-full focus-visible:outline-0 overflow-y-scroll comment-textarea"
                              placeholder="인터넷은 우리가 함께 만들어가는 소중한 공간입니다. 댓글 작성 시 타인에 대한 배려와 책임을 담아주세요."
                            />
                            <div
                              className="min-w-[100px] flex items-center justify-center bg-ruliweb text-white cursor-pointer"
                              onClick={() => writeSubComment(subComment._id)}
                            >
                              등록
                            </div>
                          </div>
                        )} */}
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
          // COMMENT END----------------------------------------
        })}
      </div>
      <div className="border border-gray-400 flex min-h-[80px] text-[12px] mt-[10px]">
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
