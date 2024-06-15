const download = require('image-downloader')
const downPromises = [
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_1.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_2.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_3.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_4.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_5.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_6.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_7.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_8.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_9.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_10.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_11.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_12.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_13.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_14.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_15.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_16.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_17.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_18.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_19.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_20.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_21.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_22.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_23.png?type=m240_240',
  'https://storep-phinf.pstatic.net/ogq_6130afcc65fc5/original_24.png?type=m240_240',
].map((src) => {
  return download.image({
    url: src,
    dest: 'C:\\Users\\koo\\Downloads\\네이버 OGQ마켓',
  })
})

;(async () => {
  console.log(downPromises)
  await Promise.all(downPromises)
})()
