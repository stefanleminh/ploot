import { CommandInteraction, GuildMember, Interaction } from "discord.js"
import { Properties } from "../types/properties"

const path = require('path')
const logger = require('../logging/winston')(path.basename(__filename))
const { SlashCommandBuilder } = require('@discordjs/builders')
const functions = require('../modules/functions')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription(
      'Remove any roles from every participant and clears last round spectators.'
    ),
  args: '',
  requiresActiveSession: true,
  async execute (interaction: CommandInteraction, client: any, properties: Properties) {
    if(interaction.guild === null || interaction.guild === undefined) {
      throw new Error("Interaction is not part of a guild!")
    }
    await interaction.deferReply()
    const promises: Promise<GuildMember>[] = []
    const spectatorRoleId = await properties.spectatorRoleIds.get(
      interaction.guild.id
    )
    const firstTeamRoleId = await properties.firstTeamRoleIds.get(
      interaction.guild.id
    )
    const secondTeamRoleId = await properties.secondTeamRoleIds.get(
      interaction.guild.id
    )

    if (spectatorRoleId) {
      interaction.guild.roles.cache
        .get(spectatorRoleId)!
        .members.forEach(member => {
          promises.push(
            member.roles.remove(
              interaction.guild!.roles.cache.get(spectatorRoleId)!
            )
          )
        })
    }

    promises.concat(
      functions.clearTeamRoles(interaction, firstTeamRoleId, secondTeamRoleId)
    )

    await properties.lastRoundSpectatorIds.set(interaction.guild.id, [])
    await Promise.all(promises)
    logger.debug('Cleared data and roles from participants!')
    await interaction.editReply(
      'I cleared all data and roles from participants!'
    )
  }
}
