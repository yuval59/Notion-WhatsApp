import { Tweet } from '../types/types'

export async function sendTweet(tweetToSend: Tweet) {
  return new Promise((resolve, reject) =>
    setTimeout(() => reject('Not implemented'), 1000)
  )
}
