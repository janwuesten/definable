import { BaseDefinable } from "../classes/BaseDefinable"
import { DefinableData } from "../types/DefinableData"

export const useDefinableArray = () => {
  return {
    deserialize<T extends BaseDefinable>(array: DefinableData[] | null, constructor: () => T) {
      const arr: T[] = []
      if (array) {
        for (const data of array) {
          const obj = constructor()
          obj.deserialize(data)
          arr.push(obj)
        }
      }
      return arr
    },
    serialize<T extends BaseDefinable>(array: T[]) {
      const data: DefinableData[] = []
      if (array) {
        for (const item of array) {
          data.push(item.serialize())
        }
      }
      return data
    }
  }
}