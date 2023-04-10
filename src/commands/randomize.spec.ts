import { GuildMember } from 'discord.js'
import { createTeams } from './randomize'
import {jest} from '@jest/globals'

describe('createTeams', () => {
  let players: GuildMember[]
  const firstTeamRoleId = 'first_team_role'
  const secondTeamRoleId = 'second_team_role'

  beforeEach(() => {
    players = [
      {
        user: { username: 'player1' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player2' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player3' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player4' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player5' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player6' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player7' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player8' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player9' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember,
      {
        user: { username: 'player10' },
        roles: { add: jest.fn().mockResolvedValue(null as never) }
      } as unknown as GuildMember
    ]
  })

  it('should add the correct team roles to both all', async () => {
    const promises = createTeams(players, firstTeamRoleId, secondTeamRoleId)

    await Promise.all(promises)

    expect(players[0].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[1].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[2].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[3].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[4].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[5].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[6].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[7].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[8].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[9].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
  })

  it('should add the correct team roles to both all even if amount of players is uneven', async () => {
    players = players.slice(0, 9)
    const promises = createTeams(players, firstTeamRoleId, secondTeamRoleId)

    await Promise.all(promises)

    expect(players[0].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[1].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[2].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[3].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[4].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[5].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[6].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[7].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[8].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
  })

  it('should just put the players in opposite teams if there are only two players', async () => {
    players = players.slice(0, 2)
    const promises = createTeams(players, firstTeamRoleId, secondTeamRoleId)
    
    await Promise.all(promises)

    expect(players[0].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[1].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
  })

  it('should just put the player in one team if there is only one player', async() => {
    players = players.slice(0, 1)
    const promises = createTeams(players, firstTeamRoleId, secondTeamRoleId)
    
    await Promise.all(promises)

    expect(players[0].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
  })

  it('should exit gracefully when there are no players', async() => {
    players = []
    await expect(Promise.all(createTeams(players, firstTeamRoleId, secondTeamRoleId))).resolves.not.toThrowError()
  })

  it('should work even if playerpool is larger than MAX_AMOUNT_OF_PLAYERS', async() => {
    players.push({
      user: { username: 'player11' },
      roles: { add: jest.fn().mockResolvedValue(null as never) }
    } as unknown as GuildMember)
    const promises = createTeams(players, firstTeamRoleId, secondTeamRoleId)

    await Promise.all(promises)

    expect(players[0].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[1].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[2].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[3].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[4].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
    expect(players[5].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[6].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[7].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[8].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[9].roles.add).toHaveBeenCalledWith(secondTeamRoleId)
    expect(players[10].roles.add).not.toHaveBeenCalled();
  })
})
