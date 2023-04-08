import { User } from 'discord.js'
import { chunk } from './functions'
import {jest} from '@jest/globals'

jest.mock('../logging/winston.js', () => ({
  logging: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('chunk', () => {
  test('correctly chunks an array of users into chunks of specified size', () => {
    const users = [
      { id: '1', username: 'user1' },
      { id: '2', username: 'user2' },
      { id: '3', username: 'user3' },
      { id: '4', username: 'user4' },
      { id: '5', username: 'user5' },
    ] as User[];
    const chunkedUsers = chunk(users, 2);
    expect(chunkedUsers).toEqual([
      [
        { id: '1', username: 'user1' },
        { id: '2', username: 'user2' },
      ],
      [
        { id: '3', username: 'user3' },
        { id: '4', username: 'user4' },
      ],
      [
        { id: '5', username: 'user5' },
      ],
    ]);
  });

  test('handles chunk size larger than array length', () => {
    const users = [
      { id: '1', username: 'user1' },
      { id: '2', username: 'user2' },
    ] as User[];
    const chunkedUsers = chunk(users, 10);
    expect(chunkedUsers).toEqual([users]);
  });

  test('handles empty array', () => {
    const users: User[] = [];
    const chunkedUsers = chunk(users, 2);
    expect(chunkedUsers).toEqual([]);
  });
});