import { Definable } from "./Definable"
import { DefinableData } from "../types/DefinableData"

export type DefinablePropDeserializer<T> = ((data: T | null) => void) | ((data: T | null) => Promise<void>)
export type DefinablePropSerializer<T> = (() => T) | (() => Promise<T>)
export type DefinablePropParserType = "definable" | "map" | "array"

export class DefinablePropParser<T extends Definable> {
  construct: (data: DefinableData) => T
  type: DefinablePropParserType = "array"

  constructor(type: DefinablePropParserType, construct: (data: DefinableData) => T) {
    this.type = type
    this.construct = construct
  }
}
export class DefinableProp {
  private __propertieName: string
  private __serializer: DefinablePropSerializer<any> | null = null
  private __deserializer: DefinablePropDeserializer<any> | null = null
  private __parser: DefinablePropParser<Definable> | null = null

  constructor(propertieName: string) {
    this.__propertieName = propertieName
  }

  useSerializer<T>(serializer: DefinablePropSerializer<T>) {
    this.__serializer = serializer
    return this
  }
  useDeserializer<T>(deserializer: DefinablePropDeserializer<T>) {
    this.__deserializer = deserializer
    return this
  }

  useDefinable<T extends Definable>(constructor: (data: DefinableData) => T) {
    if (this.__parser) {
      throw new Error("cannot define multiple parsers")
    }
    this.__parser = new DefinablePropParser("definable", constructor)
    return this
  }
  useDefinableArray<T extends Definable>(constructor: (data: DefinableData) => T) {
    if (this.__parser) {
      throw new Error("cannot define multiple parsers")
    }
    this.__parser = new DefinablePropParser("array", constructor)
    return this
  }
  useDefinableMap<T extends Definable>(constructor: (data: DefinableData) => T) {
    if (this.__parser) {
      throw new Error("cannot define multiple parsers")
    }
    this.__parser = new DefinablePropParser("map", constructor)
    return this
  }

  async _serialize(): Promise<any> {
    if (!this.__serializer) {
      return
    }
    if (this.__parser) {
      const data = await this.__serializer()
      switch (this.__parser.type) {
        case "definable":
          if (typeof data != "object" || typeof data.serialize != "function") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          return (data as Definable).serialize()
        case "array":
          if (!Array.isArray(data)) {
            throw new Error(`field ${this.__propertieName} is not an array of a Definable class`)
          }
          const items: DefinableData[] = []
          for (const item of data as Definable[]) {
            if (typeof item.serialize != "function") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            items.push(await item.serialize())
          }
          return items
        case "map":
          if (typeof data != "object") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          const map: Record<string, DefinableData> = {}
          for (const [key, val] of data as Map<string, Definable>) {
            if (typeof val.serialize != "function") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            map[key] = await val.serialize()
          }
          return map
        default:
          return data
      }
    } else {
      return this.__serializer()
    }
  }
  async _deserialize(data: any | null): Promise<void> {
    if (!this.__deserializer) {
      return
    }
    if (this.__parser) {
      switch (this.__parser.type) {
        case "definable":
          if (typeof data != "object") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          return this.__deserializer(await this.__parser.construct(data).deserialize(data as DefinableData))
        case "array":
          if (!Array.isArray(data)) {
            throw new Error(`field ${this.__propertieName} is not an array of a Definable class`)
          }
          const items: Definable[] = []
          for (const item of data as DefinableData[]) {
            if (typeof item != "object") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            items.push(await this.__parser.construct(item).deserialize(item))
          }
          return this.__deserializer(items)
        case "map":
          if (typeof data != "object") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          const map: Map<string, Definable> = new Map()
          for (const [key, val] of Object.entries(data as Record<string, DefinableData>)) {
            if (typeof val != "object") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            map.set(key, await this.__parser.construct(val).deserialize(val))
          }
          return this.__deserializer(map)
        default:
          return this.__deserializer(data)
      }
      
    } else {
      return this.__deserializer(data)
    }
  }

  get _propertieName() {
    return this.__propertieName
  }
  get _serializer() {
    return this.__serializer
  }
  get _deserializer() {
    return this.__deserializer
  }
}