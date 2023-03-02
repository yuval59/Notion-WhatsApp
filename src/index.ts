//#region imports
//#region externalImports
import 'dotenv/config'
//#endregion

//#region internalImports
import { getRelevantMessagesAndSend } from './utils/utils'
import initializeWhatsApp from './utils/whatsapp'
//#endregion
//#endregion

async function main() {
  await initializeWhatsApp()

  getRelevantMessagesAndSend()
}

main()
