import data from './data.json'

export type Item = { flag?: string; emoji?: string; answers: string[] }
export type Category = { id: string; name: string; emoji: string; items: Item[] }

export const CATEGORIES = data as Category[]

export function categoryById(id: string): Category {
  return CATEGORIES.find((c) => c.id === id)!
}
