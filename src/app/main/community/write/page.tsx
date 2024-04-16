'use client'

import { useState } from 'react'
import ReactQuill from 'react-quill'

export default function CommunityWritePage() {
  const [value, setValue] = useState('')

  return (
    <div>
      <div>글쓰기페이지</div>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
    </div>
  )
}
