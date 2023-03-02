//#region imports
//#region externalImports
import {
  PageObjectResponse,
  QueryDatabaseParameters,
  GetPageParameters,
} from '@notionhq/client/build/src/api-endpoints'
//#endregion
//#endregion

//#region NotionQueryStuff
export type NotionPageObjectResponse = PageObjectResponse
export type NotionQueryDatabaseParameters = QueryDatabaseParameters
export type NotionQueryFilter = QueryDatabaseParameters['filter']
export type NotionQueryPageParameters = GetPageParameters
//#endregion

//#region NotionGeneral
export type NotionInnerText = {
  type: string
  plain_text: string
}
export type NotionTitle = {
  id: string
  type: string
  title: NotionInnerText[]
}
export type NotionText = {
  id: string
  type: string
  rich_text: NotionInnerText[]
}
export type NotionCheckbox = {
  id: string
  type: string
  checkbox: boolean
}
export type NotionDate = {
  id: string
  type: string
  date: {
    start: string
    end?: string
  }
}
export type NotionRelation = {
  id: string
  type: string
  relation: { id: string }[]
  has_more: boolean
}
//#endregion

//#region NotionMessage
export type NotionMessage = {
  id: string
  properties: NotionMessageProperties
}
export type NotionMessageProperties = {
  Delivered: NotionCheckbox
  'Post Date': NotionDate
  Message: NotionTitle
  Contacts: NotionRelation
  resolvedContacts?: NotionContact[]
  Attachment: any
}
//#endregion

//#region NotionContact
export type NotionContact = {
  id: string
  properties: NotionContactProperties
}
export type NotionContactProperties = {
  contactName: NotionTitle
  chatId: NotionText
  isGroup: NotionCheckbox
}
//#endregion
