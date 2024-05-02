/*



이건 안쓰지만 나중에 https갈때를 위해서 남겨둔다.........



*/

import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
}
const isProduction = process.env.NODE_ENV === 'production'
const port = isProduction ? 3002 : 3003
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  // https
  //   .createServer(httpsOptions, (req, res) => {
  //     const parsedUrl = parse(req.url!, true)
  //     handle(req, res, parsedUrl)
  //   })
  //   .listen(3004)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  )
})
