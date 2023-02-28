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

  console.log(tweetsToSend)

  const results = await Promise.allSettled(
    tweetsToSend.map((tweet) => updateNotionTweetAndSend(tweet))
  )

  console.log(results)
}

async function updateNotionTweetAndSend(tweetToSend: Tweet): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const { notionId } = tweetToSend

    try {
      await setTweetDelivered(notionId, true)
    } catch (err) {
      const rejectionObject: internalServiceError = {
        notionId,
        message: `Error while updating notion tweet ${notionId}`,
        err,
      }

      reject(rejectionObject)
    }

    try {
      await sendTweet(tweetToSend)
    } catch (err) {
      const rejectionObject: internalServiceError = {
        notionId,
        message: `Error while sending tweet ${notionId}`,
        err,
      }

      reject(rejectionObject)
    }

    resolve()
  })
}
