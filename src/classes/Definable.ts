import { DefinableProp } from "./DefinableProp"
import { DefinableData } from "../types/DefinableData"
import { DefinableEvent, DefinableEventListener, DefinableEventName } from "./DefinableEvent"

export type DefinableDefinitionUseDefine = (field: string) => DefinableProp
export type DefinableDefinitionUseEvent = (event: DefinableEventName, listener: DefinableEventListener) => DefinableEvent
export type DefinableDefinition = {
  useProp: DefinableDefinitionUseDefine
  useEvent: DefinableDefinitionUseEvent
}
interface SerializeDeserializeOptions {
  props?: string[]
}
export interface DeserializeOptions extends SerializeDeserializeOptions {
  
}
export interface SerializeOptions extends SerializeDeserializeOptions {

}
export type DefinableValidateResponse = {} & (
  | { valid: true }
  | { valid: false, code: string, prop: string }
)
export abstract class Definable {
  protected _propDefinitions: DefinableProp[] = []
  protected _propEvents: DefinableEvent[] = []
  
  constructor() {
    this.definition({
      useProp: (field) => {
        const _definition = this._propDefinitions.find((a) => a._propertieName == field) ?? new DefinableProp(field)
        this._propDefinitions.push(_definition)
        return _definition
      },
      useEvent: (event, listener) => {
        const _event = new DefinableEvent(event, listener)
        this._propEvents.push(_event)
        return _event
      }
    })
  }

  abstract definition({ useProp }: DefinableDefinition): void
  
  validate(props?: string[]): DefinableValidateResponse {
    for (const definition of this._propDefinitions) {
      if (definition._deserializer && (!props || props.includes(definition._propertieName))) {
        const response = definition._validate()
        if (!response.valid) {
          return {
            valid: false,
            code: response.code,
            prop: definition._propertieName
          }
        }
      }
    }
    return {
      valid: true
    }
  }
  deserialize(data: DefinableData, options: DeserializeOptions = {}): this {
    const beforeEvents = this._propEvents.filter((event) => event._eventName == "deserialize.before")
    for (const event of beforeEvents) {
      event._listener()
    }
    for (const definition of this._propDefinitions) {
      if (definition._deserializer && (!options.props || options.props.includes(definition._propertieName))) {
        if (definition._propertieName in data) {
          definition._deserialize(data[definition._propertieName])
        } else {
          definition._deserializer(null)
        }
      }
    }
    const afterEvents = this._propEvents.filter((event) => event._eventName == "deserialize.after")
    for (const event of afterEvents) {
      event._listener()
    }
    return this
  }
  serialize(options: DeserializeOptions = {}): DefinableData {
    const validateResponse = this.validate()
    if (!validateResponse.valid) {
      throw new Error(validateResponse.code)
    }
    const beforeEvents = this._propEvents.filter((event) => event._eventName == "serialize.before")
    for (const event of beforeEvents) {
      event._listener()
    }
    const data: DefinableData = {}
    for (const definition of this._propDefinitions) {
      if (definition._serializer && (!options.props || options.props.includes(definition._propertieName))) {
        data[definition._propertieName] = definition._serialize()
      }
    }
    const afterEvents = this._propEvents.filter((event) => event._eventName == "serialize.after")
    for (const event of afterEvents) {
      event._listener()
    }
    return data
  }
}