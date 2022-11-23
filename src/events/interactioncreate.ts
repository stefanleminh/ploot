const path = require('path')
const log = require('../logging/winston')(path.basename(__filename))
const validation = require('../modules/validation')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction: any, client: any) {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return
    if (
      command.requiresActiveSession &&
      !validation.isActiveSession(client, interaction.guild.id)
    ) {
      await interaction.reply(
        'You have not started a session yet! Please run the /newsession command.'
      )
      return
    }

    try {
      log.info(`Running command: ${command.data.name}`)
      await command.execute(interaction, client)
    } catch (error) {
      log.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
