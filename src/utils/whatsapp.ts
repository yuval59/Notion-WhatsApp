import qrcode from 'qrcode-terminal'
import { Client, NoAuth } from 'whatsapp-web.js'
import { Message } from '../types/types'

const client = new Client({
  authStrategy: new NoAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
})

client.on('qr', (qr: string) => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('Client is ready!')
})

export default function () {
  return client.initialize()
}

export async function sendMesssage(messagesToSend: Message) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      reject('Not implemented')
    }, 0)
  )
}
