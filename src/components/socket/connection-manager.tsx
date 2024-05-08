import { socket } from '@/services/socket'
import { EMIT_GET_CHARACTERS_EVENT } from '@/interfaces/chat.interface'

export function ConnectionManager() {
  function connect(data: {
    characterId: number
    nickname: string
    wsToken: string
  }) {
    socket.io.opts.extraHeaders!.Authorization = `Bearer ${data.wsToken}`
    socket.connect()
    socket.on('connect', () => {
      socket.emit(EMIT_GET_CHARACTERS_EVENT)
    })
  }

  function disconnect() {
    socket.disconnect()
  }

  return <></>
}
