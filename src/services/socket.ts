import { io } from 'socket.io-client'
import { API_SERVER_URL } from '@/constants/constant'

// "undefined" means the URL will be computed from the `window.location` object
const SOCKET_URL = API_SERVER_URL

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  extraHeaders: {
    Authorizaiton: '', // ignored
  },
})
