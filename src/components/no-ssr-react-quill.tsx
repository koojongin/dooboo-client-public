import dynamic from 'next/dynamic'

export const QuillNoSSRWrapper =
  typeof window !== 'object'
    ? () => null
    : dynamic(
        async () => {
          'use client'

          console.log(typeof Node, '1111')
          const { default: RQ } = await import('react-quill')

          return function nameless({ forwardedRef, ...props }: any) {
            return <RQ ref={forwardedRef} {...props} />
          }
        },
        {
          ssr: false,
        },
      )

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

// export default function Home() {
//   return <QuillNoSSRWrapper modules={modules} formats={formats} theme="snow" />
// }
