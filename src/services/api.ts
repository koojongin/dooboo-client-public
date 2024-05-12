import axios from 'axios'
import Swal from 'sweetalert2'

const api = axios.create({
  baseURL: `https://dooboo.online:${process.env.NEXT_PUBLIC_SERVER_PORT}`,
})

// 요청 인터셉터
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token')
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = token
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { code, message, response, request } = error
    const { status, data } = response || {}

    if (status === 600) {
      return Promise.reject(error)
    }

    await Swal.fire({
      text: code,
      title: data?.message || message,
      icon: 'error',
      confirmButtonText: '확인',
    })
    return Promise.reject(error)
  },
)

export default api
