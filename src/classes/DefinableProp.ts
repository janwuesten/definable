import { BaseDefinable } from "./BaseDefinable"
import { DefinableData } from "../types/DefinableData"

export type DefinablePropDeserializer<T> = (data: T | null) => void
export type DefinablePropSerializer<T> = (() => T)
export type DefinablePropValidator = (() => string | null)
export type DefinablePropParserType = "definable" | "map" | "array"
export type DefinablePropValidateResponse = {} & (
  | { valid: true }
  | { valid: false, code: string }
)

export class DefinablePropParser<T extends BaseDefinable> {
  construct: (data: DefinableData) => T
  type: DefinablePropParserType = "array"

  constructor(type: DefinablePropParserType, construct: (data: DefinableData) => T) {
    this.type = type
    this.construct = construct
  }
}
export class DefinableProp<T> {
  private __propertieName: string
  private __serializer: DefinablePropSerializer<any> | null = null
  private __validator: DefinablePropValidator | null = null
  private __deserializer: DefinablePropDeserializer<any> | null = null
  private __parser: DefinablePropParser<BaseDefinable> | null = null

  constructor(propertieName: string) {
    this.__propertieName = propertieName
  }

  useSerializer(serializer: DefinablePropSerializer<T>) {
    this.__serializer = serializer
    return this
  }
  useDeserializer(deserializer: DefinablePropDeserializer<T>) {
    this.__deserializer = deserializer
    return this
  }

  useValidator(validator: DefinablePropValidator) {
    this.__validator = validator
    return this
  }

  useDefinable<T extends BaseDefinable>(constructor: (data: DefinableData) => T) {
    if (this.__parser) {
      throw new Error("cannot define multiple parsers")
    }
    this.__parser = new DefinablePropParser("definable", constructor)
    return this
  }
  useDefinableArray<T extends BaseDefinable>(constructor: (data: DefinableData) => T) {
    if (this.__parser) {
      throw new Error("cannot define multiple parsers")
    }
    this.__parser = new DefinablePropParser("array", constructor)
    return this
  }
  useDefinableMap<T extends BaseDefinable>(constructor: (data: DefinableData) => T) {
    if (this.__parser) {
      throw new Error("cannot define multiple parsers")
    }
    this.__parser = new DefinablePropParser("map", constructor)
    return this
  }

  _validate(): DefinablePropValidateResponse {
    if (!this.__validator) {
      return {
        valid: true
      }
    }
    const response = this.__validator()
    if (response == null) {
      return {
        valid: true
      }
    }
    return {
      valid: false,
      code: response
    }
  }
  _serialize(): any {
    if (!this.__serializer) {
      return
    }
    if (this.__parser) {
      const data = this.__serializer()
      switch (this.__parser.type) {
        case "definable":
          if (typeof data != "object" || typeof data.serialize != "function") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          return (data as BaseDefinable).serialize()
        case "array":
          if (!Array.isArray(data)) {
            throw new Error(`field ${this.__propertieName} is not an array of a Definable class`)
          }
          const items: DefinableData[] = []
          for (const item of data as BaseDefinable[]) {
            if (typeof item.serialize != "function") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            items.push(item.serialize())
          }
          return items
        case "map":
          if (typeof data != "object") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          const map: Record<string, DefinableData> = {}
          for (const [key, val] of data as Map<string, BaseDefinable>) {
            if (typeof val.serialize != "function") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            map[key] = val.serialize()
          }
          return map
        default:
          return data
      }
    } else {
      return this.__serializer()
    }
  }
  _deserialize(data: any | null): void {
    if (!this.__deserializer) {
      return
    }
    if (this.__parser) {
      switch (this.__parser.type) {
        case "definable":
          if (typeof data != "object") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          return this.__deserializer(this.__parser.construct(data).deserialize(data as DefinableData))
        case "array":
          if (!Array.isArray(data)) {
            throw new Error(`field ${this.__propertieName} is not an array of a Definable class`)
          }
          const items: BaseDefinable[] = []
          for (const item of data as DefinableData[]) {
            if (typeof item != "object") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            items.push(this.__parser.construct(item).deserialize(item))
          }
          return this.__deserializer(items)
        case "map":
          if (typeof data != "object") {
            throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
          }
          const map: Map<string, BaseDefinable> = new Map()
          for (const [key, val] of Object.entries(data as Record<string, DefinableData>)) {
            if (typeof val != "object") {
              throw new Error(`field ${this.__propertieName} is not an object of a Definable class`)
            }
            map.set(key, this.__parser.construct(val).deserialize(val))
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