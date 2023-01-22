import { Client } from "discord.js"
import { Properties } from "../types/properties"

import path from 'path'
import {logging} from '../logging/winston'
const logger = logging(path.basename(__filename))
import {REST} from '@discordjs/rest'
import {Routes} from 'discord-api-types/v9'
const config = require('../../config.json')
const TOKEN = config.token
const TEST_GUILD_ID = config.testGuildId
const fs = require('fs')

module.exports = {
  name: 'ready',
  once: true,
  execute (client: Client, properties: Properties) {
    const commands = []
    // Take commands
    const commandFiles = fs
      .readdirSync('./src/commands')
      .filter((file: any) => file.endsWith('.ts'))
    for (const file of commandFiles) {
      const command = require('../commands/' + file)
      commands.push(command.data.toJSON())
      properties.commands.set(command.data.name, command)
      logger.info(`Loaded command ${command.data.name}`)
    }

    // Registering the commands in the client
    const CLIENT_ID = client.user!.id
    const rest = new REST({
      version: '9'
    }).setToken(TOKEN)
    ;(async () => {
      try {
        if (!TEST_GUILD_ID) {
          await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands
          })
          logger.info('Successfully registered application commands globally')
        } else {
          await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
            {
              body: commands
            }
          )
          logger.info(
            'Successfully registered application commands for development guild'
          )
        }
      } catch (error) {
        if (error) logger.error(error)
      }
    })()
    // Log that the bot is online.
    logger.info(
      `${client.user!.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
    )
    client.user!.setActivity(' everyone 👀', { type: 'WATCHING' })
  }
}