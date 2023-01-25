import { chunk } from './functions'

describe(chunk.name, () => {
  it('should return an array of arrays of the specified chunk size', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const chunkSize = 3
    const chunks = chunk(arr, chunkSize)

    expect(chunks).toHaveLength(4)
    expect(chunks[0]).toHaveLength(3)
    expect(chunks[1]).toHaveLength(3)
    expect(chunks[2]).toHaveLength(3)
    expect(chunks[3]).toHaveLength(1)
  })

  it('should return an array with the last chunk of size less than chunk size if not divisible', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const chunkSize = 4
    const chunks = chunk(arr, chunkSize)

    expect(chunks).toHaveLength(3)
    expect(chunks[2]).toHaveLength(1)
  })

  it('should return an empty array if the input array is empty', () => {
    const arr: number[] = []
    const chunkSize = 4
    const chunks = chunk(arr, chunkSize)

    expect(chunks).toEqual([])
  })
})
