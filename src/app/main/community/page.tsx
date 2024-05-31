'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchGetBoardList } from '@/services/api-fetch'
import { Board } from '@/interfaces/board.interface'
import createKey from '@/services/key-generator'
import { ago } from '@/services/util'
import { CardSetCategory } from '@/constants/cards.enum'
import { PickUpBox } from '@/app/main/gatcha/pickup-box.component'

const { env } = process
export default function CommunityPage() {
  const router = useRouter()
  const [notices, setNotices] = useState<Board[]>([])
  const [freeBoards, setFreeBoards] = useState<Board[]>([])
  const [boards, setBoards] = useState<
    { path: string; name: string; boards: Board[] }[]
  >([])
  const loadBoards = async () => {
    const [result, freeResult] = await Promise.all([
      fetchGetBoardList(
        { category: { $in: ['공지', '패치노트'] } },
        { page: 1 },
      ),
      fetchGetBoardList({ category: { $in: [null] } }, { page: 1 }),
    ])

    setNotices(result.boards)
    setFreeBoards(freeResult.boards)

    setBoards([
      {
        path: '/main/community/board?board=1&page=1',
        name: '공지 사항 및 패치 노트',
        boards: result.boards.splice(0, 10),
      },
      {
        path: '/main/community/board?board=2&page=1',
        name: '자유 게시판',
        boards: freeResult.boards.splice(0, 10),
      },
    ])
  }

  const goToGatcha = () => {
    router.push('/main/gatcha')
  }

  useEffect(() => {
    loadBoards()
  }, [])

  return (
    <div className="flex flex-wrap gap-[10px]">
      {/* BOARD ITEMS */}
      {boards.map((board) => {
        return (
          <BoardBox
            path={board.path}
            key={createKey()}
            boards={board.boards}
            name={board.name}
          />
        )
      })}

      {/* BOARD ITEMS END */}
      {/* <div className="flex flex-wrap gap-[4px]">
        {[
          CardSetCategory.All,
          CardSetCategory.HoshinoAndShiroko,
          CardSetCategory.Mashiro,
          CardSetCategory.Aru,
          CardSetCategory.Wakamo,
          CardSetCategory.ShokuhouMisaki,
        ].map((categoryName, index) => {
          return (
            <div
              key={createKey()}
              className="max-w-[150px]"
              onClick={() => goToGatcha()}
            >
              <PickUpBox event={{ categoryName }} />
            </div>
          )
        })}
      </div> */}
    </div>
  )
}

function BoardBox({
  path,
  boards,
  name,
}: {
  path: string
  boards: Board[]
  name: string
}) {
  const router = useRouter()
  const goToRoute = (pathName: string) => {
    router.push(pathName)
  }
  return (
    <div className="max-w-[400px] min-w-[400px] p-[10px] border-r border-gray-300">
      <div className="flex items-center mb-[10px]">
        <div
          className="ff-nbg text-[20px] border-b-ruliweb border-b-2 pb-[2px] cursor-pointer"
          onClick={() => goToRoute(path)}
        >
          {name}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        {boards.map((post) => {
          return (
            <div key={createKey()} className="flex items-start justify-between">
              <div
                className="text-[12px] break-all w-full cursor-pointer hover:underline"
                onClick={() => goToRoute(`/main/community/detail/${post._id}`)}
              >
                {post.title}
                <span className="font-bold">
                  {post.comments!.length > 0
                    ? ` [${post.comments?.length}]`
                    : ''}
                </span>
              </div>
              <div className="flex text-[12px] min-w-[80px] justify-end">
                <div className="bg-gray-800 text-white px-[4px] py-[1px] rounded">
                  {ago(post.createdAt!)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
