export type Message = {
  notionId: string
  delivered: boolean
  postDate: string
  message: string
  contacts: Contact[]
}

export type Contact = {
  contactName: string
  chatId: string
  isGroup: boolean
}

export type WhatsAppGroup = {
  name: string
  chatId: string
}

export type internalServiceError = {
  notionId: string
  message: string
  err: unknown
}
