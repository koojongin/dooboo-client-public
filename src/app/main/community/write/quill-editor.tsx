'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Delta from 'quill-delta'
import { Cloudinary } from '@cloudinary/url-gen/index'
import { ImageResize } from 'quill-image-resize-module-ts'
import createKey from '@/services/key-generator'
import { dataURLtoFile } from '@/services/util'

Quill.register('modules/ImageResize', ImageResize as any)
export default function QuillEditorBase({
  value,
  onChange,
  imageHandler,
}: any) {
  const reactQuillRef = useRef<ReactQuill>(null)
  const cld = new Cloudinary({ cloud: { cloudName: 'dqihpypxi' } })
  const uploadToCloudinaryFromFile = async (file: any) => {
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
  const defaultImageHandler = useCallback(() => {
    if (!reactQuillRef.current) return
    const quill = reactQuillRef.current.getEditor()
    if (!quill) return
    const input = document?.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        const { secure_url } = await uploadToCloudinaryFromFile(file)
        const range = quill.getSelection()
        quill.insertEmbed(range!.index, 'image', secure_url)
      }
    }
  }, [uploadToCloudinaryFromFile])
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
          image: imageHandler || defaultImageHandler,
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

                const filename = createKey()
                const file = dataURLtoFile((node as any).src, `${filename}.png`)
                const imageAttributes = {
                  ...op.attributes,
                  alt: `${filename}`,
                }
                // eslint-disable-next-line no-param-reassign
                op.insert.image = '/images/uploading.gif'
                setTimeout(async () => {
                  if (!reactQuillRef.current) return
                  const editorRef: any = reactQuillRef.current
                  const editor = editorRef.getEditor()
                  if (!editor) return
                  console.log(editor.getSelection())
                  const data = await uploadToCloudinaryFromFile(file)
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

  return (
    <ReactQuill
      ref={reactQuillRef}
      onChange={onChange}
      modules={modules}
      // formats={formats}
      value={value}
      placeholder="이곳에 글 내용을 작성하세요"
      theme="snow"
    />
  )
}
