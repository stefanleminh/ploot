/* eslint-env mocha */
const randomize = require('./randomize')
const functions = require('../modules/functions')

jest.mock('../modules/functions')

const messageMock = {
  guild: {},
  channel: {
    send: jest.fn()
  }
}
const client = {
  lastRoundSpectators: [],
  currentSpectators: [],
  voiceChannels: [
    {
      name: 'Spectating'
    },
    {
      name: 'Team1'
    },
    {
      name: 'Team2'
    }
  ],
  currentPlayers: [
    { username: 'Player1' },
    { username: 'Player2' },
    { username: 'Player3' },
    { username: 'Player4' },
    { username: 'Player5' },
    { username: 'Player6' },
    { username: 'Player7' },
    { username: 'Player8' },
    { username: 'Player9' },
    { username: 'Player10' },
    { username: 'Player11' },
    { username: 'Player12' }]
}

test('should randomize teams correctly with 12 players', () => {
  functions.purge.mockImplementation(jest.fn())
  functions.chunk.mockReturnValue([])

  randomize.execute(messageMock, {}, client)

  expect(client.firstTeam.concat(client.secondTeam).map(player => player.username).sort()).toEqual(client.currentPlayers.map(player => player.username).sort())
  expect(client.lastRoundSpectators.length).toBe(0)
  expect(client.spectatorTeam.length).toBe(0)
})

test('should randomize teams correctly with 13 players and last and currentRound spectators', () => {
  functions.purge.mockImplementation(jest.fn())
  functions.chunk.mockReturnValue([])
  const messageMock = {
    guild: {},
    channel: {
      send: jest.fn()
    }
  }
  client.lastRoundSpectators = [{ username: 'Player14' }]
  client.currentSpectators = [{ username: 'Spectator1' }]
  client.currentPlayers = [
    { username: 'Player1' },
    { username: 'Player2' },
    { username: 'Player3' },
    { username: 'Player4' },
    { username: 'Player5' },
    { username: 'Player6' },
    { username: 'Player7' },
    { username: 'Player8' },
    { username: 'Player9' },
    { username: 'Player10' },
    { username: 'Player11' },
    { username: 'Player12' },
    { username: 'Player13' }]

  randomize.execute(messageMock, {}, client)

  expect(client.firstTeam.concat(client.secondTeam)).toContainEqual({ username: 'Player14' })
  expect(client.lastRoundSpectators.length).toBe(2)
  expect(client.spectatorTeam.length).toBe(3)
})

test('should randomize teams correctly with 13 players with the last round spectator always being in the next round', () => {
  client.lastRoundSpectators = []
  client.currentSpectators = []
  functions.purge.mockImplementation(jest.fn())
  functions.chunk.mockReturnValue([])
  const messageMock = {
    guild: {},
    channel: {
      send: jest.fn()
    }
  }
  client.currentPlayers = [
    { username: 'Player1' },
    { username: 'Player2' },
    { username: 'Player3' },
    { username: 'Player4' },
    { username: 'Player5' },
    { username: 'Player6' },
    { username: 'Player7' },
    { username: 'Player8' },
    { username: 'Player9' },
    { username: 'Player10' },
    { username: 'Player11' },
    { username: 'Player12' },
    { username: 'Player13' },
    { username: 'Player14' },
    { username: 'Player15' },
    { username: 'Player16' },
    { username: 'Player17' },
    { username: 'Player18' }]

  randomize.execute(messageMock, {}, client)
  let guaranteedPlayers = client.lastRoundSpectators

  randomize.execute(messageMock, {}, client)
  expect(client.firstTeam.concat(client.secondTeam)).toEqual(expect.arrayContaining(guaranteedPlayers))
  expect(client.lastRoundSpectators.length).toBe(6)
  guaranteedPlayers = client.lastRoundSpectators

  randomize.execute(messageMock, {}, client)
  expect(client.firstTeam.concat(client.secondTeam)).toEqual(expect.arrayContaining(guaranteedPlayers))
  expect(client.lastRoundSpectators.length).toBe(6)
})
