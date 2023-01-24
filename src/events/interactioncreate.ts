import path from 'path'
import { logging } from '../logging/winston'
import { Client, Interaction } from 'discord.js'
import { Properties } from 'src/types/properties'
import { isActiveSession } from '../modules/validation'

const logger = logging(path.basename(__filename))

module.exports = {
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
