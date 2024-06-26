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
    // eslint-disable-next-line no-param-reassign
    config.headers.GameKey = localStorage.getItem('gameKey')
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

    if ([502].includes(status)) {
      window.location.href = `/register?accessToken=${localStorage.getItem('token')}`
    }

    if ([600, 429, 601].includes(status)) {
      return Promise.reject(error)
    }

    if ([510].includes(status)) {
      Swal.fire({
        // text: code,
        title: data?.message || message,
        icon: 'error',
        confirmButtonText: '확인',
      })
      return Promise.reject(error)
    }

    await Swal.fire({
      // text: code,
      title: data?.message || message,
      icon: 'error',
      confirmButtonText: '확인',
    })
    return Promise.reject(error)
  },
)

export default api
