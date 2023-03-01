//#region imports
//#region internalImports
import { Tweet } from '../types/types'
//#endregion
//#endregion

export async function sendTweet(tweetToSend: Tweet) {
  return new Promise((resolve, reject) =>
    setTimeout(() => reject('Not implemented'), 1000)
  )
}
