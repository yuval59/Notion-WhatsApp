//#region imports
//#region internalImports
import { getUnsentScheduledTweets, setTweetDelivered } from './notion'
import { Tweet, internalServiceError } from '../types/types'
import { sendTweet } from './twitter'
//#endregion
//#endregion

export async function getRelevantTweetsAndSend() {
  let tweetsToSend: Tweet[]

  try {
    tweetsToSend = await getUnsentScheduledTweets()
  } catch (err) {
    console.error('Error while getting relevant tweets')
    console.error(err)

    return
  }

  console.log(`Found ${tweetsToSend.length} new tweets to send`)

  const results = await Promise.allSettled(
    tweetsToSend.map((tweet) => updateNotionTweetAndSend(tweet))
  )

  console.log(results)
}

async function updateNotionTweetAndSend(tweetToSend: Tweet): Promise<void> {
  const { notionId } = tweetToSend

  await updateNotionTweetDelivered(notionId, true)

  await attemptToSendTweet(tweetToSend)
}

async function updateNotionTweetDelivered(
  notionId: string,
  delivered: boolean
) {
  try {
    await setTweetDelivered(notionId, delivered)
  } catch (err) {
    const rejectionObject: internalServiceError = {
      notionId,
      message: `Error while updating notion tweet ${notionId}`,
      err,
    }

    throw rejectionObject
  }
}

async function attemptToSendTweet(tweetToSend: Tweet) {
  try {
    await sendTweet(tweetToSend)
  } catch (err) {
    try {
      await updateNotionTweetDelivered(tweetToSend.notionId, false)
    } catch (err) {}

    const rejectionObject: internalServiceError = {
      notionId: tweetToSend.notionId,
      message: `Error while sending tweet ${tweetToSend.notionId}`,
      err,
    }

    throw rejectionObject
  }
}
