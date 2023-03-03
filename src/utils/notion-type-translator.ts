//#region imports
//#region internalImports
import {
  NotionMessage,
  NotionContact,
  NotionTitle,
} from '../types/notion-types'
import { Contact, Message } from '../types/types'
//#endregion
//#endregion

export function mapNotionMessages(messages: NotionMessage[]): Message[] {
  //#region internalFunctions - layer 1
  function makeMessageObject(notionMessage: NotionMessage): Message {
    //#region internalFunctions - layer 2
    function makeMessageText(originalMessage: NotionTitle): string {
      return originalMessage.title.length
        ? originalMessage.title[0].plain_text
        : ''
    }
    //#endregion

    const { id: notionId, properties } = notionMessage
    try {
      const delivered = properties.Delivered.checkbox
      const postDate = properties['Post Date'].date.start
      const message = properties.Message.title[0].plain_text
      const contacts = properties.resolvedContacts.map(mapNotionContact)

      return {
        notionId,
        delivered,
        postDate,
        message,
        contacts,
      }
    } catch (err) {
      console.error(`Notion message ${notionId} is erroring out`)
      console.error(err)

      return
    }
  }
  //#endregion

  return messages.map(makeMessageObject).filter((obj) => obj)
}

function mapNotionContact(contact: NotionContact): Contact {
  return {
    contactName: contact.properties.contactName.title[0].plain_text,
    chatId: contact.properties.chatId.rich_text[0].plain_text,
    isGroup: contact.properties.isGroup.checkbox,
  }
}
