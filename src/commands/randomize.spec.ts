import { Collection, Guild, GuildMember, Role } from 'discord.js'
import {
  createTeams,
  fillPlayerPool,
  setNextRoundGuaranteedPlayers
} from './randomize'
import { jest } from '@jest/globals'
import { Properties } from '../types/properties'

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

  it('should just put the player in one team if there is only one player', async () => {
    players = players.slice(0, 1)
    const promises = createTeams(players, firstTeamRoleId, secondTeamRoleId)

    await Promise.all(promises)

    expect(players[0].roles.add).toHaveBeenCalledWith(firstTeamRoleId)
  })

  it('should exit gracefully when there are no players', async () => {
    players = []
    await expect(
      Promise.all(createTeams(players, firstTeamRoleId, secondTeamRoleId))
    ).resolves.not.toThrowError()
  })

  it('should work even if playerpool is larger than MAX_AMOUNT_OF_PLAYERS', async () => {
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
    expect(players[10].roles.add).not.toHaveBeenCalled()
  })
})

describe('fillPlayerPool', () => {
  const player1 = {
    user: { id: 'player1', username: 'Player 1' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player2 = {
    user: { id: 'player2', username: 'Player 2' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player3 = {
    user: { id: 'player3', username: 'Player 3' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player4 = {
    user: { id: 'player4', username: 'Player 4' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player5 = {
    user: { id: 'player5', username: 'Player 5' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player6 = {
    user: { id: 'player6', username: 'Player 6' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player7 = {
    user: { id: 'player7', username: 'Player 7' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player8 = {
    user: { id: 'player8', username: 'Player 8' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player9 = {
    user: { id: 'player9', username: 'Player 9' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player10 = {
    user: { id: 'player10', username: 'Player 10' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const player11 = {
    user: { id: 'player11', username: 'Player 11' },
    roles: { cache: new Collection<string, Role>() }
  } as unknown as GuildMember
  const botPlayer = {
    user: { username: 'bot', id: '6', bot: true },
    roles: { cache: { some: () => false } }
  } as unknown as GuildMember
  const spectatorPlayer = {
    user: { username: 'spectator', id: '7' },
    roles: { cache: { some: () => true } }
  } as unknown as GuildMember
  const mockGuild = {
    id: 'guildId',
    channels: {
      cache: {
        get: jest.fn(() => ({
          members: new Collection<string, GuildMember>([
            [player1.user.id, player1],
            [player2.user.id, player2],
            [player3.user.id, player3],
            [player4.user.id, player4],
            [player5.user.id, player5],
            [player6.user.id, player6],
            [player7.user.id, player7],
            [player8.user.id, player8],
            [player9.user.id, player9],
            [player10.user.id, player10],
            [botPlayer.user.id, botPlayer],
            [spectatorPlayer.user.id, spectatorPlayer]
          ])
        }))
      }
    }
  } as unknown as Guild

  const mockProperties: Properties = {
    spectatorRoleIds: {
      get: jest.fn().mockResolvedValue('spectatorRoleId' as never)
    },
    guaranteedPlayersNextRoundIds: {
      set: jest.fn().mockResolvedValue(null as never)
    },
    currentSpectators: undefined,
    currentPlayers: undefined,
    commands: undefined,
    config: {
      token: '',
      loggingLevel: '',
      testGuildId: ''
    },
    lobbies: undefined,
    firstTeamVcs: undefined,
    secondTeamVcs: undefined,
    firstTeamRoleIds: undefined,
    secondTeamRoleIds: undefined
  }

  const mockPlayerPool = [
    player1,
    player2,
    player3,
    player4,
    player5,
    player6,
    player7,
    player8,
    player9,
    player10
  ]

  const mockLobbyVcId = 'lobbyVcId'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the input player pool if it already contains the maximum amount of players', async () => {
    // Arrange
    const expectedPlayerPool = [...mockPlayerPool]

    // Act
    const result = await fillPlayerPool(
      mockGuild,
      mockProperties,
      mockPlayerPool,
      mockLobbyVcId
    )

    // Assert
    expect(result).toEqual(expectedPlayerPool)
  })

  it('should add up to the max amount if it the amount of players is lower than the maximum', async () => {
    // Arrange
    const expectedPlayerPool = [...mockPlayerPool]
    const mockSpectatorRoleId = 'spectatorRoleId'
    const playerPool = [player1, player2, player3]
    mockProperties.spectatorRoleIds.get.mockResolvedValue(mockSpectatorRoleId)

    // Act
    const result = await fillPlayerPool(
      mockGuild,
      mockProperties,
      playerPool,
      mockLobbyVcId
    )

    // Assert
    expect(result).toContain(player1)
    expect(result).toContain(player2)
    expect(result).toContain(player3)
    expect(result).toContain(player4)
    expect(result).toContain(player5)
    expect(result).toContain(player6)
    expect(result).toContain(player7)
    expect(result).toContain(player8)
    expect(result).toContain(player9)
    expect(result).toContain(player10)
    expect(result).not.toContain(botPlayer)
    expect(result).not.toContain(spectatorPlayer)
  })
})

describe('setNextRoundGuaranteedPlayers', () => {
  let mockPlayerPool: GuildMember[]
  let mockLobbyVcMembers: Collection<string, GuildMember>
  let mockSpectatorRoleId: string
  let mockProperties: Properties
  let mockGuild: Guild

  beforeEach(() => {
    mockPlayerPool = [
      {
        user: { id: 'player1', username: 'Player One' },
        roles: { cache: new Collection<string, Role>() }
      } as unknown as GuildMember,
      {
        user: { id: 'player2', username: 'Player Two' },
        roles: { cache: new Collection<string, Role>() }
      } as unknown as GuildMember,
      {
        user: { id: 'player3', username: 'Player Three' },
        roles: { cache: new Collection<string, Role>() }
      } as unknown as GuildMember
    ]
    mockLobbyVcMembers = new Collection<string, GuildMember>([
      [
        'player4',
        {
          user: { id: 'player4', username: 'Player Four' },
          roles: { cache: new Collection<string, Role>() }
        } as unknown as GuildMember
      ],
      [
        'player5',
        {
          user: { id: 'player5', username: 'Player Five' },
          roles: { cache: new Collection<string, Role>() }
        } as unknown as GuildMember
      ]
    ])
    mockSpectatorRoleId = 'spectatorRoleId'
    mockProperties = {
      guaranteedPlayersNextRoundIds: {
        set: jest.fn()
      }
    } as unknown as Properties
    mockGuild = {
      id: 'guildId'
    } as unknown as Guild
  })

  it('should set the guaranteed players for next round correctly', async () => {
    // Arrange
    jest.spyOn(Math, 'random').mockReturnValue(0.5)

    // Act
    await setNextRoundGuaranteedPlayers(
      mockPlayerPool,
      mockLobbyVcMembers,
      mockSpectatorRoleId,
      mockProperties,
      mockGuild
    )

    // Assert
    expect(
      mockProperties.guaranteedPlayersNextRoundIds.set
    ).toHaveBeenCalledWith(mockGuild.id, ['player4', 'player5'])
  })

  it('should set the guaranteed players for next round to an empty array if there are no available players', async () => {
    // Arrange
    mockLobbyVcMembers = new Collection<string, GuildMember>()
    jest.spyOn(Math, 'random').mockReturnValue(0.5)

    // Act
    await setNextRoundGuaranteedPlayers(
      mockPlayerPool,
      mockLobbyVcMembers,
      mockSpectatorRoleId,
      mockProperties,
      mockGuild
    )

    // Assert
    expect(
      mockProperties.guaranteedPlayersNextRoundIds.set
    ).toHaveBeenCalledWith(mockGuild.id, [])
  })
})
