import { Definable } from "../classes/Definable"
import { DefinableData } from "../types/DefinableData"

export const useDefinableArray = () => {
  return {
    async deserialize<T extends Definable>(array: DefinableData[] | null, constructor: () => T) {
      const arr: T[] = []
      if (array) {
        for (const data of array) {
          const obj = constructor()
          await obj.deserialize(data)
          arr.push(obj)
        }
      }
      return arr
    },
    async serialize<T extends Definable>(array: T[]) {
      const data: DefinableData[] = []
      if (array) {
        for (const item of array) {
          data.push(await item.serialize())
        }
      }
      return data
    }
  }
}