import { API_SERVER_URL } from '@/constants/constant'

export default function toAPIHostURL(url: string | undefined) {
  if (!url) return url
  if (url.includes(API_SERVER_URL)) return url
  return `${API_SERVER_URL}/${url}`
}
