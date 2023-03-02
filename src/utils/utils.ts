//#region imports
//#region internalImports
import { getUnsentScheduledMessages, setMessageDelivered } from './notion'
import { Message, internalServiceError } from '../types/types'
import { sendMesssage } from './whatsapp'
//#endregion
//#endregion

export async function getRelevantMessagesAndSend() {
  let messagesToSend: Message[]

  try {
    messagesToSend = await getUnsentScheduledMessages()
  } catch (err) {
    console.error('Error while getting relevant messages')
    console.error(err)

    return
  }

  console.log(`Found ${messagesToSend.length} new messages to send`)

  const errors = (
    await Promise.allSettled(
      messagesToSend.map((message) => updateNotionMessageAndSend(message))
    )
  ).filter((task) => task.status == 'rejected')

  console.log(errors)
}

async function updateNotionMessageAndSend(
  messageToSend: Message
): Promise<void> {
  const { notionId } = messageToSend

  console.log('Attempting to update & send')
  console.log(messageToSend)

  await updateNotionMessageDelivered(notionId, true)

  await attemptToSendMessage(messageToSend)
}

async function updateNotionMessageDelivered(
  notionId: string,
  delivered: boolean
) {
  try {
    await setMessageDelivered(notionId, delivered)
  } catch (err) {
    const rejectionObject: internalServiceError = {
      notionId,
      message: `Error while updating notion message ${notionId}`,
      err,
    }

    throw rejectionObject
  }
}

async function attemptToSendMessage(messageToSend: Message) {
  try {
    await sendMesssage(messageToSend)

    console.log(`Successfully sent message ${messageToSend.notionId}`)
  } catch (err) {
    try {
      await updateNotionMessageDelivered(messageToSend.notionId, false)
    } catch (err) {}

    const rejectionObject: internalServiceError = {
      notionId: messageToSend.notionId,
      message: `Error while sending message ${messageToSend.notionId}`,
      err,
    }

    throw rejectionObject
  }
}
