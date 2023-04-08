import path from 'path'
import { logging } from '../logging/winston.js'
import { type Client, type Interaction } from 'discord.js'
import { type Properties } from '../types/properties.js'
import { isActiveSession } from '../modules/validation.js'
import { fileURLToPath } from 'url'
import { type PlootEvent } from 'types/plootevent.js'
// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
const logger = logging(path.basename(__filename))

export const event: PlootEvent = {
  name: 'interactionCreate',
  async execute (interaction: Interaction, client: Client, properties: Properties) {
    if (!interaction.isCommand()) return

    const command = properties.commands.get(interaction.commandName)

    if (!command) return
    if (
      command.requiresActiveSession &&
      !await isActiveSession(properties, interaction.guild!.id)
    ) {
      await interaction.reply(
        'You have not started a session yet! Please run the /newsession command.'
      )
      return
    }

    try {
      logger.info(`Running command: ${command.data.name as string}`)
      await command.execute(interaction, properties)
    } catch (error) {
      logger.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
