//#region imports
//#region externalImports
import 'dotenv/config'
import cron from 'node-cron'
//#endregion

//#region internalImports
import { getRelevantMessagesAndSend } from './utils/utils'
import initializeWhatsApp from './utils/whatsapp'
import constants from './constants'
//#endregion
//#endregion

async function main() {
  await initializeWhatsApp()

  cron.schedule(constants.SCHEDULES.MAIN_FUNCTION, getRelevantMessagesAndSend)
}

main()
