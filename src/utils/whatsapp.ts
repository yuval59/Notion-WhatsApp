import qrcode from 'qrcode-terminal'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { Message } from '../types/types'

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
})

client.on('qr', (qr: string) => {
  qrcode.generate(qr, { small: true })
})

client.on(
  'ready',
  async () =>
    (await client.getChats())
      .filter((chat) => chat.isGroup)
      .forEach((chat) => console.log(`${chat.name} => ${chat.id._serialized}`))
  // Printing to console a list of all groups the user is currently in
)

client.on('group_join', async (message) => {
  const chat = await message.getChat()
  console.log(`${chat.name} => ${message.id}`)
})

export default function () {
  return client.initialize()
}

export async function sendMesssage(messageToSend: Message) {
  return await Promise.all(
    messageToSend.contacts.map((contact) =>
      client.sendMessage(contact.chatId, messageToSend.message)
    )
  )
}
