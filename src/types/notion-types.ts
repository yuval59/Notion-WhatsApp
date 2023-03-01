//#region imports
//#region externalImports
import {
  PageObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'
//#endregion
//#endregion

//#region NotionQueryStuff
export type NotionPageObjectResponse = PageObjectResponse
export type NotionQueryDatabaseParameters = QueryDatabaseParameters
export type NotionQueryFilter = QueryDatabaseParameters['filter']
//#endregion

//#region NotionTweet
export type NotionTweet = {
  id: string
  properties: NotionProperties
}

export type NotionProperties = {
  Hashtags: NotionHashtag
  Delivered: NotionDelivered
  'Post Date': NotionPostDate
  Message: NotionMessage
}
export type NotionHashtag = {
  id: string
  type: string
  multi_select: NotionHashtagMultiSelect[]
}
export type NotionHashtagMultiSelect = {
  id: string
  name: string
  color: string
}
export type NotionDelivered = {
  id: string
  type: string
  checkbox: boolean
}
export type NotionPostDate = {
  id: string
  type: string
  date: {
    start: string
  }
}
export type NotionMessage = {
  id: string
  title: NotionMessageTitle[]
}
export type NotionMessageTitle = {
  plain_text: string
}
//#endregion
