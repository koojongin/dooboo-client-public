'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import Swal from 'sweetalert2'
import { Cloudinary } from '@cloudinary/url-gen'
import Delta from 'quill-delta'
import { fetchPostBoard } from '@/services/api-fetch'
import { QuillNoSSRWrapper } from '@/components/no-ssr-react-quill'
import { dataURLtoFile } from '@/services/util'
import createKey from '@/services/key-generator'

export default function CommunityWritePage() {
  const reactQuillRef = useRef<ReactQuill>(null)
  const cld = new Cloudinary({ cloud: { cloudName: 'dqihpypxi' } })
  const [imageUrl, setImageUrl] = useState()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

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
      clipboard: {
        matchVisual: false,
        matchers: [
          [
            Node.ELEMENT_NODE,
            (node: Node, delta: any) => {
              const fixedOps = delta?.ops.map((op: any) => {
                const isImage = op?.insert?.image
                if (!isImage) {
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
                  console.log(editor.getSelection())
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
      text: `${result}`,
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
          onClick={() => writePost()}
        >
          등록
        </div>
      </div>
    </div>
  )
}
