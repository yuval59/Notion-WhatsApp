import qrcode from 'qrcode-terminal'
import { Client, NoAuth } from 'whatsapp-web.js'
import { Contact, Message } from '../types/types'

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

export async function sendMesssage(messageToSend: Message) {
  return await Promise.all(
    messageToSend.contacts.map((contact: Contact) =>
      client.sendMessage(contact.chatId, messageToSend.message)
    )
  )
}
