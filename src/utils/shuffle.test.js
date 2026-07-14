import { describe, expect, it } from 'vitest'
import { shuffleArray } from './shuffle'

describe('shuffleArray', () => {
  it('returns a new array with the same items and does not mutate the original', () => {
    const original = ['A', 'B', 'C', 'D']

    const shuffled = shuffleArray(original)

    expect(shuffled).toHaveLength(original.length)
    expect(shuffled).toEqual(expect.arrayContaining(original))
    expect([...shuffled].sort()).toEqual([...original].sort())
    expect(original).toEqual(['A', 'B', 'C', 'D'])
  })
})
