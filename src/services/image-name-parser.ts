import { API_SERVER_URL } from '@/constants/constant'

export default function toAPIHostURL(url: string) {
  return `${API_SERVER_URL}/${url}`
}
