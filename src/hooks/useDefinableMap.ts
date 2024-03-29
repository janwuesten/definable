import { BaseDefinable } from "../classes/BaseDefinable"
import { DefinableData } from "../types/DefinableData"

export const useDefinableMap = () => {
  return {
    deserialize: <T extends BaseDefinable>(definableData: Record<string, DefinableData> | null, constructor: () => T): Map<string, T> => {
      const map: Map<string, T> = new Map()
      if (definableData) {
        for (const [key, val] of Object.entries(definableData)) {
          map.set(key, constructor().deserialize(val))
        }
      }
      return map
    },
    serialize: <T extends BaseDefinable>(definableMap: Map<string, T>): Record<string, DefinableData> => {
      const map: Record<string, DefinableData> = {}
      for (const [key, val] of definableMap) {
        map[key] = val.serialize()
      }
      return map
    }
  }
}