import dynamic from 'next/dynamic'

export const QuillEditor = dynamic(() => import('./quill-editor'), {
  ssr: false,
})
