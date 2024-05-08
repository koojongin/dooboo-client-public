import { NextResponse } from 'next/server'

export function middleware(request: {
  headers: HeadersInit | undefined
  nextUrl: { pathname: string }
}) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  const { url } = request as any
  if (url.indexOf('token') >= 0) {
    const [, params] = url.split('?')
    const splittedParams = params.split('&')
    const tokenKey = splittedParams.find(
      (param: string) => param.indexOf('token=') >= 0,
    )
    requestHeaders.set('token', tokenKey.split('=')[1])
    requestHeaders.set('url', url)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: '/admindooboo/:path*',
}
