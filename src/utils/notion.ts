//#region imports
//#region externalImports
import { Client, isFullPage } from '@notionhq/client'
import day from 'dayjs'
//#endregion

//#region internalImports
import { internalServiceError, Tweet } from '../types/types'
import {
  NotionPageObjectResponse,
  NotionQueryDatabaseParameters,
  NotionQueryFilter,
  NotionTweet,
} from '../types/notion-types'
import { mapNotionTweets } from './notion-type-translator'
//#endregion
//#endregion

const client = new Client({
  auth: process.env.NOTION_KEY,
})

export async function getTweetsWithFilter(
  filter: NotionQueryFilter
): Promise<NotionTweet[]> {
  const notionQuery: NotionQueryDatabaseParameters = {
    database_id: `${process.env.NOTION_DB}`,
  }

  if (filter) notionQuery.filter = filter

  return (await client.databases.query(notionQuery)).results.filter((result) =>
    isFullPage(result)
  ) as NotionPageObjectResponse[] as any as NotionTweet[]
  // Step by step
  // Query the database, get everything
  // Filter with provided typeguard to leave only full pages (NotionPageObjectResponse)
  // Cast to internal NotionTweet type, have to go through any or unknown first
}

export async function getUnsentScheduledTweets(): Promise<Tweet[]> {
  const notionTweetFilter: NotionQueryFilter = {
    and: [
      {
        property: 'Delivered',
        checkbox: { does_not_equal: true }, // Not true seemed more fitting here - I want a tweet that _wasn't sent_
      },
      {
        property: 'Post Date',
        date: {
          on_or_before: day().toISOString(),
        },
      },
    ],
  }

  return mapNotionTweets(await getTweetsWithFilter(notionTweetFilter))
}

export async function setTweetDelivered(notionId: string, Delivered: boolean) {
  try {
    await client.pages.update({
      page_id: notionId,
      properties: {
        Delivered,
      },
    })
  } catch (err) {
    const errorObject: internalServiceError = {
      notionId,
      err,
      message: `Failed to set delivered status of tweet ${notionId}`,
    }

    throw errorObject
  }
}
