import { NextResponse } from 'next/server'

export function middleware(request: {
  headers: HeadersInit | undefined
  nextUrl: { pathname: string }
}) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  requestHeaders.set('test', 'HI~')
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
