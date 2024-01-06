import { Definable } from "../classes/Definable";
import { DefinableData } from "../types/DefinableTypes";

export const useDefinableMap = () => {
  return {
    deserialize: async <T extends Definable>(definableData: Record<string, DefinableData> | null, constructor: () => T): Promise<Map<string, T>> => {
      const map: Map<string, T> = new Map()
      if (definableData) {
        for (const [key, val] of Object.entries(definableData)) {
          map.set(key, await constructor().deserialize(val))
        }
      }
      return map
    },
    serialize: async <T extends Definable>(definableMap: Map<string, T>): Promise<Record<string, DefinableData>> => {
      const map: Record<string, DefinableData> = {}
      for (const [key, val] of definableMap) {
        map[key] = await val.serialize()
      }
      return map
    }
  }
}