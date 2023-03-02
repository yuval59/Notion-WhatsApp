//#region imports
//#region externalImports
import { Client, isFullPage } from '@notionhq/client'
import day from 'dayjs'
//#endregion

//#region internalImports
import { internalServiceError, Message } from '../types/types'
import {
  NotionPageObjectResponse,
  NotionQueryDatabaseParameters,
  NotionQueryFilter,
  NotionMessage,
  NotionContact,
  NotionQueryPageParameters,
} from '../types/notion-types'
import { mapNotionMessages } from './notion-type-translator'
//#endregion
//#endregion

const client = new Client({
  auth: process.env.NOTION_KEY,
})

async function performNotionDatabaseQuery(
  notionQuery: NotionQueryDatabaseParameters
): Promise<NotionPageObjectResponse[]> {
  const { results } = await client.databases.query(notionQuery)

  return results.filter(isFullPage) as NotionPageObjectResponse[]
}

async function performNotionPageQuery(notionQuery: NotionQueryPageParameters) {
  return (await client.pages.retrieve(notionQuery)) as any as NotionContact
}

async function getMessagesWithFilter(
  filter: NotionQueryFilter
): Promise<NotionMessage[]> {
  const notionQuery: NotionQueryDatabaseParameters = {
    database_id: `${process.env.NOTION_DB}`,
  }

  if (filter) notionQuery.filter = filter

  return (await performNotionDatabaseQuery(
    notionQuery
  )) as any as NotionMessage[]
  // Step by step
  // Query the database, get everything
  // Filter with provided typeguard to leave only full pages (NotionPageObjectResponse)
  // Cast to internal NotionMessage type, have to go through any or unknown first
}

export async function getUnsentScheduledMessages(): Promise<Message[]> {
  const notionMessageFilter: NotionQueryFilter = {
    and: [
      {
        property: 'Delivered',
        checkbox: { does_not_equal: true }, // Not true seemed more fitting here - I want a message that wasn't "sent" and a mesage that is "not sent"
      },
      {
        property: 'Post Date',
        date: {
          on_or_before: day().toISOString(),
        },
      },
    ],
  }

  const messagesWithContacts = await Promise.all(
    (
      await getMessagesWithFilter(notionMessageFilter)
    ).map(mapNotionMessageContacts)
  )

  return mapNotionMessages(messagesWithContacts)
}

export async function setMessageDelivered(
  notionId: string,
  Delivered: boolean
) {
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
      message: `Failed to set delivered status of message ${notionId}`,
    }

    throw errorObject
  }
}

async function getContact(contactId: string): Promise<NotionContact> {
  const notionQuery: NotionQueryPageParameters = {
    page_id: contactId,
  }

  return await performNotionPageQuery(notionQuery)
}

async function getRelevantContacts(
  contactIds: string[]
): Promise<NotionContact[]> {
  return await Promise.all(contactIds.map(getContact))
}

async function mapNotionMessageContacts(
  notionMessage: NotionMessage
): Promise<NotionMessage> {
  return {
    id: notionMessage.id,
    properties: {
      ...notionMessage.properties,
      resolvedContacts: await getRelevantContacts(
        notionMessage.properties.Contacts.relation.map((idObj) => idObj.id)
      ),
    },
  }
}
