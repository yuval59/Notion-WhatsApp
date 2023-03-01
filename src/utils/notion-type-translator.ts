//#region imports
//#region internalImports
import {
  NotionHashtag,
  NotionHashtagMultiSelect,
  NotionMessage,
  NotionTweet,
} from '../types/notion-types'
import { Tweet } from '../types/types'
//#endregion
//#endregion

export function mapNotionTweets(results: NotionTweet[]) {
  //#region internalFunctions - layer 1
  function makeTweet(originalTweet: NotionTweet): Tweet {
    //#region internalFunctions - layer 2
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
    //#endregion

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
  //#endregion

  return results.map(
    (notionTweet: NotionTweet): Tweet => makeTweet(notionTweet)
  )
}
