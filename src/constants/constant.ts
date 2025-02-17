// eslint-disable-next-line @typescript-eslint/no-unused-expressions
const host =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'
    ? 'localhost'
    : 'dooboo.online'
export const API_SERVER_URL = `http://${host}:${process.env.NEXT_PUBLIC_SERVER_PORT}`

export const DEFAULT_THUMBNAIL_URL = '/images/question_mark.webp'

export const BA_COLOR = '#245a7e'
export const BA_FAMILY = 'BlueArchive'

export const ADMIN_CHARACTER_IDS = ['6603b3d5b7868c3b327f4c53']
