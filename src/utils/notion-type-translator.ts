import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import {
  NotionDelivered,
  NotionHashtag,
  NotionHashtagMultiSelect,
  NotionMessage,
  NotionPostDate,
  NotionTweet,
} from '../types/notion-types'
import { Tweet } from '../types/types'

export function mapNotionTweets(results: PageObjectResponse[]) {
  function makeTweet(originalTweet: NotionTweet): Tweet {
    function makeHashtags(originalHashtags: NotionHashtag) {
      return originalHashtags.multi_select.map(
        (selector: NotionHashtagMultiSelect) => selector.name
      )
    }
    function makeMessage(originalMessage: NotionMessage): string {
      return originalMessage.title.length
        ? originalMessage.title[0].plain_text
        : ''
    }

    const { id: notionId, properties } = originalTweet

    const delivered = properties.Delivered.checkbox
    const postDate = properties['Post Date'].date.start
    const message = makeMessage(properties.Message)
    const hashtags = makeHashtags(properties.Hashtags)
    const fullMessage = [message, ...hashtags].join(' ')

    return {
      notionId,
      delivered,
      hashtags,
      postDate,
      message,
      fullMessage,
    }
  }

  return (results as unknown as NotionTweet[]).map(
    (notionTweet: NotionTweet): Tweet => makeTweet(notionTweet)
  )
}
