'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import moment from 'moment'
import createKey from '@/services/key-generator'
import { fetchGetBoardList } from '@/services/api-fetch'
import { Board } from '@/interfaces/board.interface'
import { DEFAULT_THUMBNAIL_URL } from '@/constants/constant'
import { parseHtml } from '@/services/util'

export default function CommunityBoardPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [boards, setBoards] = useState<Board[]>([])
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const onClickWriteButton = () => {
    router.push('/main/community/write')
    // router.push('/main/community')
  }

  const loadBoards = async (pageNumber: number) => {
    const selectedBoardNumber = searchParams.get('board') || 2

    let condition = {}
    if (selectedBoardNumber === '1') {
      condition = {
        category: { $in: ['공지', '패치노트'] },
      }
    }
    if (selectedBoardNumber === '2') {
      condition = {
        category: { $in: [null] },
      }
    }

    const result = await fetchGetBoardList(condition, { page: pageNumber })
    setBoards(result.boards)
    setPage(result.page)
    setTotalPages(result.totalPages)
  }

  const goToDetailPage = (boardId: string) => {
    router.push(`/main/community/detail/${boardId}`)
  }

  const formatDate = (dateString: string) => {
    const targetDate = new Date(dateString)
    const now = new Date()
    // const ONE_DAY_MILLISECONDS = 1000 * 60 * 60 * 24
    if (
      moment(targetDate).isSame(moment(), 'day') &&
      moment(targetDate).isSame(moment(), 'date') &&
      moment(targetDate).isSame(moment(), 'year')
    ) {
      return moment(targetDate).format('HH:mm')
    }
    return moment(targetDate).format('YYYY.MM.DD')
  }

  const goToPage = (pageNumber: number | string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set('page', String(pageNumber))
    router.push(`${pathname}?${current.toString()}`)
    // router.push(`/main/community?page=${pageNumber}`)
  }

  const initPage = async () => {
    try {
      const pageNumber = parseInt(searchParams.get('page') || '', 10) || 1
      // searchParams.set('page')
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      current.set('page', String(pageNumber))
      router.push(`${pathname}?${current.toString()}`)
      await loadBoards(pageNumber)
    } catch (error) {
      console.error('?')
    }
  }

  useEffect(() => {
    const sPage = searchParams.get('page')
    if (sPage) {
      initPage()
    }
  }, [searchParams])

  useEffect(() => {
    initPage()
  }, [])
  return (
    <div className="flex flex-col gap-[4px] text-[14px]">
      <div className="flex items-center">
        <div
          className="flex items-center justify-center bg-ruliweb px-[9px] py-[4px] text-white font-bold cursor-pointer"
          onClick={() => onClickWriteButton()}
        >
          글쓰기
        </div>
      </div>
      <div className="text-[12px] flex flex-col">
        <div className="bg-blue-gray-500 text-white py-1.5 border-b border-gray-300 flex gap-[1px]">
          <div className="pl-2 min-w-[100px]">구분</div>
          <div className="w-full flex gap-1 w-[400px] wide:w-full">제목</div>
          <div className="min-w-[150px] max-w-[150px]">글쓴이</div>
          <div className="min-w-[50px] text-center">조회</div>
          <div className="min-w-[50px] text-center">추천</div>
          <div className="min-w-[120px] text-center">날짜</div>
        </div>
        {boards.length === 0 && (
          <div className="w-full min-h-[100px] flex justify-center items-center border border-gray-600 text-[18px]">
            작성된 글이 없습니다.
          </div>
        )}
        {boards.map((board: any) => {
          return (
            <div
              key={createKey()}
              className="bg-blue-50 py-1.5 border-b border-gray-300 flex gap-[1px] [&>*]:flex [&>*]:items-center"
            >
              <div className="pl-2 min-w-[100px]">
                {board.category || '자유'}
              </div>
              <div className="w-full flex gap-[1px] truncate overflow-ellipsis wide:w-full">
                <div
                  className="max-w-[600px] truncate cursor-pointer hover:underline"
                  onClick={() => goToDetailPage(board._id)}
                >
                  {board.title}
                  {board.content.indexOf('<img') >= 0
                    ? parseHtml(
                        '<i class="ml-1 text-ruliweb fa-solid fa-image"></i>',
                      )
                    : ''}
                </div>
                {board.comments?.length > 0 && (
                  <div className="font-bold">
                    [{board.comments?.length || 0}]
                  </div>
                )}
              </div>
              <div
                className="min-w-[150px] max-w-[150px] gap-[2px] cursor-pointer"
                onClick={() =>
                  router.push(`/main/profile/${board.character._id}`)
                }
              >
                <div className="flex items-center justify-between min-w-[40px] min-h-[40px] w-[40px] h-[40px] rounded border border-gray-200 overflow-hidden p-[2px] bg-white">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${board.character.thumbnail || DEFAULT_THUMBNAIL_URL}')`,
                    }}
                  />
                </div>
                <div className="min-w-[100px] max-w-[100px] truncate">
                  {board.character.nickname}
                </div>
              </div>
              <div className="min-w-[50px] justify-center">
                {board.reads.toLocaleString()}
              </div>
              <div className="min-w-[50px] justify-center">
                {board.recommends.toLocaleString()}
              </div>

              <div className="min-w-[120px] justify-center">
                {formatDate(board.createdAt)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-center">
        <div className="flex gap-[2px]">
          {new Array(totalPages).fill(1).map((value, index) => {
            return (
              <div
                onClick={() => goToPage(index + 1)}
                className={`flex justify-center items-center w-[24px] h-[24px] text-[12px] font-bold ${index + 1 === page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                key={createKey()}
              >
                {index + 1}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
