'use client'

import _ from 'lodash'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import createKey from '@/services/key-generator'

export default function CommunityPage() {
  const route = useRouter()
  const posts: any = [
    { title: '드레이크도 잡아봤어요' },
    { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    { title: '용만 잡고싶다고....용만...' },
    { title: '다회차 이부분은 대실망!' },
    { title: '드레이크도 잡아봤어요' },
    { title: '드레이크도 잡아봤어요' },
    {
      title:
        '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요 이름이긴제목1ㅣㅏ머ㅣㅏ;ㅅㅁㅈ더;시ㅏㅁㅈ더ㅏㅣ;섬ㅈ;디ㅏ서ㅏㅣ;ㅁㅈㄷ서;ㅣㅏㅁㅈ덧;ㅏㅣㅁㅈㄷㅅ',
    },
    { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
    // { title: '허심의 극치얻는 교란마을 퀘 꼬인건지 봐주세요' },
    // { title: '용만 잡고싶다고....용만...' },
    // { title: '다회차 이부분은 대실망!' },
    // { title: '드레이크도 잡아봤어요' },
  ]

  const onClickWriteButton = () => {
    route.push('/main/community/write')
  }

  useEffect(() => {}, [])
  return (
    <div className="">
      <div onClick={() => onClickWriteButton()}>글쓰기</div>
      <div className="text-[14px] flex flex-col ">
        <div className="bg-blue-gray-500 text-white py-1.5 border-b border-gray-300 flex gap-[1px]">
          <div className="pl-2 min-w-[100px]">구분</div>
          <div className="w-full flex gap-1">제목</div>
          <div className="min-w-[150px] max-w-[150px] ">글쓴이</div>
          <div className="min-w-[50px] text-center">추천</div>
          <div className="min-w-[50px] text-center">조회</div>
          <div className="min-w-[120px] text-center">날짜</div>
        </div>
        {posts.map((post: any) => {
          return (
            <div
              key={createKey()}
              className="bg-blue-50 py-1.5 border-b border-gray-300 flex gap-[1px] [&>*]:flex [&>*]:items-center"
            >
              <div className="pl-2 min-w-[100px]">잡담</div>
              <div className="w-full flex gap-1">
                <div className="max-w-[600px] truncate">{post.title}</div>
                <div className="font-bold">[3]</div>
              </div>
              <div className="min-w-[150px] max-w-[150px] gap-1">
                <div className="w-full max-w-[22px] rounded-full border border-white">
                  <img src="/images/profile_test.png" />
                </div>
                <div
                  className="min-w-[100px] max-w-[100px] truncate"
                  suppressHydrationWarning
                >
                  {_.shuffle(['영구', '귀차나', '긴닉네임1234ㅎㅎㅎㅎㅎ'])[0]}
                </div>
              </div>
              <div className="min-w-[50px] justify-center">1</div>
              <div className="min-w-[50px] justify-center">1</div>
              <div
                className="min-w-[120px] justify-center"
                suppressHydrationWarning
              >
                {_.shuffle(['2024/01/01', '01:05', '12:38'])[0]}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-center">페이지네이션처리..</div>
    </div>
  )
}
