'use client'

import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Pagination } from '@/interfaces/common.interface'
import { EmojiPopOver } from '@/components/emoji/emoji-popover'
import createKey from '@/services/key-generator'
import { Character } from '@/interfaces/user.interface'
import { CommentListComponent } from '@/app/main/community/detail/[boardId]/board-blocks'
import {
  fetchGetProfileComments,
  fetchWriteProfileComment,
} from '@/services/api/api.profile'

export function ProfileCommentComponent({
  character,
  profileId,
}: {
  character: Character
  profileId: string
}) {
  const [pagination, setPagination] = useState<Pagination>()
  const [commentContent, setCommentContent] = useState<string>('')
  const [characterId, setCharacterId] = useState<string>()
  const [comments, setComments] = useState<any[]>([])

  const selectEmoji = (emojiSrc: string) => {
    writeComment(`<img class="w-[90px]" src='${emojiSrc}'/>`)
  }

  const loadComments = useCallback(
    async (page = 1) => {
      const result = await fetchGetProfileComments(profileId!, {
        condition: {},
        opts: { page },
      })
      setComments(
        result.comments.map((comment: any) => {
          // eslint-disable-next-line no-param-reassign
          comment.character = comment.owner
          return comment
        }) || [],
      )
      setPagination({ ...result })
    },
    [profileId],
  )

  const writeComment = useCallback(
    async (comment?: string) => {
      if (!comment && !commentContent) return
      await fetchWriteProfileComment(character._id, {
        content: comment || commentContent,
      })
      await Promise.all([
        Swal.fire({
          title: '댓글이 등록되었습니다',
          icon: 'success',
          confirmButtonText: '확인',
        }),
        loadComments(),
      ])

      setCommentContent('')
    },
    [character._id, commentContent, loadComments],
  )

  useEffect(() => {
    setCharacterId(localStorage.getItem('characterId') || '')
    if (profileId) loadComments()
  }, [loadComments, profileId])

  return (
    <div className="flex flex-col h-full w-full">
      {/* 코멘트 */}
      <div className="w-full border border-gray-400 text-[14px]">
        {comments.length === 0 && (
          <div className="min-h-[200px] flex items-center justify-center">
            등록된 댓글이 없습니다.
          </div>
        )}
        <CommentListComponent
          comments={comments}
          characterId={characterId}
          onRefresh={loadComments}
          disableSubComment
        />
      </div>

      {/* 댓글 입력 창 */}
      <div className="mt-[10px]">
        <EmojiPopOver onSelect={(emojiSrc: string) => selectEmoji(emojiSrc)} />
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
      {/* 페이지네이션 */}
      <div className="w-full flex justify-center mt-[15px]">
        {pagination && (
          <div className="flex gap-[4px]">
            {new Array(pagination.totalPages).fill(1).map((value, index) => {
              return (
                <div
                  className={`cursor-pointer flex justify-center items-center w-[24px] h-[24px] text-[14px] font-bold ${index + 1 === pagination.page ? 'border text-[#5795dd]' : ''} hover:text-[#5795dd] hover:border`}
                  onClick={() => loadComments(index + 1)}
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
