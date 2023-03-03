//#region imports
//#region externalImports
import qrcode from 'qrcode-terminal'
import { Client, LocalAuth } from 'whatsapp-web.js'
import fs from 'fs'
//#endregion

//#region internalImports
import { Message, WhatsAppGroup } from '../types/types'
import constants from '../constants'
//#endregion

let whatsappGroups: WhatsAppGroup[] = []

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
})

client.on('qr', (qr: string) => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', getAllChats)

client.on('group_join', async (message) => {
  const chat = await message.getChat()

  console.log('Group join event')
  console.log(`${chat.name} => ${chat.id}`)

  addGroup({
    name: chat.name,
    chatId: chat.id._serialized,
  })
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

function addGroup(groupToAdd: WhatsAppGroup) {
  whatsappGroups.push(groupToAdd)
  fs.writeFileSync(
    constants.LOCATIONS.GROUPS,
    JSON.stringify(whatsappGroups, null, 2)
  )
}
function writeAllGroups(overrideGroups: WhatsAppGroup[]) {
  whatsappGroups = overrideGroups

  fs.writeFileSync(
    constants.LOCATIONS.GROUPS,
    JSON.stringify(whatsappGroups, null, 2)
  )
}

async function getAllChats() {
  console.log('WhatsApp client ready')

  const allChats = await client.getChats()

  writeAllGroups(
    allChats
      .filter((chat) => chat.isGroup)
      .map((chat) => ({
        name: chat.name,
        chatId: chat.id._serialized,
      }))
  )
}
