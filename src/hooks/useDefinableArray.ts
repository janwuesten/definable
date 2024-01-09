import { Definable } from "../classes/Definable"
import { DefinableData } from "../types/DefinableData"

export const useDefinableArray = () => {
  return {
    deserialize<T extends Definable>(array: DefinableData[] | null, constructor: () => T) {
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
    serialize<T extends Definable>(array: T[]) {
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