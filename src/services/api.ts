import axios from 'axios'
import Swal from 'sweetalert2'

const api = axios.create({
  baseURL: 'http://dooboo.online:3001',
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
    const { code, message, response } = error
    const { status, data } = response || {}
    await Swal.fire({
      title: code,
      text: data?.message || message,
      icon: 'error',
      confirmButtonText: '확인',
    })

    if (status === 400) {
      // localStorage.removeItem('token')
    }
    return Promise.reject(error)
  },
)

export default api
