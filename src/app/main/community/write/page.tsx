'use client'

import { Cloudinary } from '@cloudinary/url-gen/index'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import Swal from 'sweetalert2'
import { QuillEditor } from './quill-loader'
import { fetchPostBoard } from '@/services/api-fetch'

export default function WriteBoardPage() {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const router = useRouter()
  const writePost = async () => {
    const FIVE_MEGA_BYTE = 1000 * 1000 * 5
    const error = {
      isValid: true,
      message: '',
    }

    if (title.length < 2) {
      error.isValid = false
      error.message = '글제목이 너무 짧습니다. 2글자 이상 입력하세요.'
    }

    if (title.length >= 100) {
      error.isValid = false
      error.message = '제목은 최대 100자입니다.'
    }

    if (content.length <= 4) {
      error.isValid = false
      error.message = '글 내용이 너무 짧습니다.'
    }
    if (content.length >= FIVE_MEGA_BYTE) {
      error.isValid = false
      error.message = '글 내용이 너무 깁니다.'
    }

    if (!error.isValid) {
      return Swal.fire({
        title: error.message || '알수없는 에러',
        text: '-',
        icon: 'error',
        confirmButtonText: '확인',
      })
    }

    const result = await fetchPostBoard({
      content,
      title,
    })

    await Swal.fire({
      title: '등록되었습니다.',
      icon: 'success',
      confirmButtonText: '확인',
    })

    router.back()
  }
  return (
    <div className="ff-dodoom-all">
      <div className="mb-[4px]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#cecdce] h-[40px] pl-[14px] placeholder:text-gray-700"
          placeholder="제목을 입력하세요"
        />
      </div>

      <QuillEditor value={content} onChange={setContent} />
      <div className="flex justify-end">
        <div
          className="flex justify-center items-center border border-gray-600 h-[40px] w-[100px] border-r-0 shadow-md shadow-gray-400 rounded-l cursor-pointer"
          onClick={() => router.back()}
        >
          취소
        </div>
        <div
          className="flex justify-center items-center border border-gray-600 h-[40px] w-[100px] shadow-md shadow-gray-400 rounded-r cursor-pointer"
          onClick={() => writePost()}
        >
          등록
        </div>
      </div>
    </div>
  )
}
