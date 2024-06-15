'use client'

import { Cloudinary } from '@cloudinary/url-gen/index'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ReactQuill, { Quill } from 'react-quill'
import Swal from 'sweetalert2'
import Delta from 'quill-delta'
import { ImageResize } from 'quill-image-resize-module-ts'
import { fetchGetBoardOne, fetchPutBoard } from '@/services/api-fetch'
import { dataURLtoFile } from '@/services/util'
import createKey from '@/services/key-generator'
import 'react-quill/dist/quill.snow.css'
import { QuillNoSSRWrapper } from '@/components/no-ssr-react-quill'
import { ADMIN_CHARACTER_IDS } from '@/constants/constant'

Quill.register('modules/ImageResize', ImageResize as any)
export default function CommunityBoardEditPage({
  params,
}: {
  params: { boardId: string }
}) {
  const reactQuillRef = useRef<ReactQuill>(null)
  const cld = new Cloudinary({ cloud: { cloudName: 'dqihpypxi' } })
  const [imageUrl, setImageUrl] = useState()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('공지')
  const [myCharacterId, setMyCharacterId] = useState<string>()

  const imageHandler = useCallback(() => {
    const quill = reactQuillRef.current?.getEditor()
    if (!quill) return
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        const { secure_url } = await uploadUploadToCloudinaryFromFile(file)
        const range = quill.getSelection()
        quill.insertEmbed(range!.index, 'image', secure_url)
      }
    }
  }, [])

  const uploadUploadToCloudinaryFromFile = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'broyhm4t')
    return fetch(
      `https://api.cloudinary.com/v1_1/${cld.getConfig().cloud!.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )
      .then((response) => response.json())
      .then((data) => {
        return data
      })
      .catch((err) => {
        console.error('Error:', err)
        alert('Upload failed')
      })
  }

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      ImageResize: {
        modules: ['Resize', 'DisplaySize'],
      },
      clipboard: {
        matchVisual: false,
        matchers: [
          [
            1,
            (node: Node, delta: any) => {
              const fixedOps = delta?.ops.map((op: any) => {
                const isImage = op?.insert?.image
                if (!isImage) {
                  return op
                }

                if (op.insert.image.indexOf('//res.cloudinary.com') >= 0) {
                  return op
                }

                const filename = createKey()
                const file = dataURLtoFile((node as any).src, `${filename}.png`)
                const imageAttributes = {
                  ...op.attributes,
                  alt: `${filename}`,
                }
                // eslint-disable-next-line no-param-reassign
                op.insert.image = '/images/uploading.gif'
                setTimeout(async () => {
                  const editor = reactQuillRef.current?.getEditor()
                  if (!editor) return
                  const data = await uploadUploadToCloudinaryFromFile(file)
                  const targetElement = editor.root.querySelector(
                    `img[alt='${filename}']`,
                  )
                  if (!targetElement) return
                  targetElement.setAttribute('src', data?.secure_url)
                }, 1)

                return {
                  ...op,
                  attributes: imageAttributes,
                }
              })

              // eslint-disable-next-line no-param-reassign
              delta.ops = fixedOps
              const newDelta = new Delta().retain(delta.length(), {
                header: 3,
              })
              return delta.compose(newDelta)
            },
          ],
        ],
      },
    }
  }, [])

  const router = useRouter()
  const updatePost = async () => {
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

    const result = await fetchPutBoard(params.boardId, {
      content,
      title,
      category,
    })

    await Swal.fire({
      title: '수정 되었습니다.',
      icon: 'success',
      confirmButtonText: '확인',
    })

    router.back()
  }

  const loadBoard = useCallback(async () => {
    const result = await fetchGetBoardOne(params.boardId)
    setContent(result.board.content)
    setTitle(result.board.title)
  }, [params.boardId])

  useEffect(() => {
    loadBoard()
  }, [loadBoard])

  useEffect(() => {
    setMyCharacterId(window.localStorage.getItem('characterId') || '')
  }, [])

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
      {ADMIN_CHARACTER_IDS.includes(myCharacterId!) && (
        <div className="border border-gray-300 p-[10px] mb-[4px]">
          <div className="flex items-stretch h-[30px]">
            <div className="flex items-center px-[10px] bg-blue-gray-400 text-white ff-wavve">
              카테고리
            </div>
            <select
              className="border border-blue-gray-400"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
              }}
            >
              {['공지', '패치노트'].map((key) => {
                return (
                  <option key={createKey()} value={key}>
                    {key}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      )}
      <QuillNoSSRWrapper
        forwardedRef={reactQuillRef}
        // ref={reactQuillRef}
        theme="snow"
        value={content}
        placeholder="이곳에 글 내용을 작성하세요"
        onChange={setContent}
        modules={modules}
        className="mb-[4px]"
      />
      <div className="flex justify-end">
        <div
          className="flex justify-center items-center border border-gray-600 h-[40px] w-[100px] border-r-0 shadow-md shadow-gray-400 rounded-l cursor-pointer"
          onClick={() => router.back()}
        >
          취소
        </div>
        <div
          className="flex justify-center items-center border border-gray-600 h-[40px] w-[100px] shadow-md shadow-gray-400 rounded-r cursor-pointer"
          onClick={() => updatePost()}
        >
          수정
        </div>
      </div>
    </div>
  )
}
