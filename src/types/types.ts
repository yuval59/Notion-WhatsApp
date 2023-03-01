export type Tweet = {
  notionId: string
  delivered: boolean
  postDate: string
  message: string
  hashtags: string[]
  fullMessage: string
}

export type internalServiceError = {
  notionId: string
  message: string
  err: unknown
}
