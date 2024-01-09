import { DefinableProp } from "./DefinableProp"
import { DefinableData } from "../types/DefinableData"
import { DefinableEvent, DefinableEventListener, DefinableEventName } from "./DefinableEvent"

export type DefinableDefinitionUseDefine = (field: string) => DefinableProp
export type DefinableDefinitionUseEvent = (event: DefinableEventName, listener: DefinableEventListener) => DefinableEvent
export type DefinableDefinition = {
  useProp: DefinableDefinitionUseDefine
  useEvent: DefinableDefinitionUseEvent
}
export abstract class Definable {
  protected _propDefinitions: DefinableProp[] = []
  protected _propEvents: DefinableEvent[] = []
  
  constructor() {
    this.definition({
      useProp: (field) => {
        const _definition = new DefinableProp(field)
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
  
  deserialize(data: DefinableData): this {
    const beforeEvents = this._propEvents.filter((event) => event._eventName == "deserialize:before")
    for (const event of beforeEvents) {
      event._listener()
    }
    for (const definition of this._propDefinitions) {
      if (definition._deserializer) {
        if (definition._propertieName in data) {
          definition._deserialize(data[definition._propertieName])
        } else {
          definition._deserializer(null)
        }
      }
    }
    const afterEvents = this._propEvents.filter((event) => event._eventName == "deserialize:after")
    for (const event of afterEvents) {
      event._listener()
    }
    return this
  }
  serialize(): DefinableData {
    const beforeEvents = this._propEvents.filter((event) => event._eventName == "serialize:before")
    for (const event of beforeEvents) {
      event._listener()
    }
    const data: DefinableData = {}
    for (const definition of this._propDefinitions) {
      if (definition._serializer) {
        data[definition._propertieName] = definition._serialize()
      }
    }
    const afterEvents = this._propEvents.filter((event) => event._eventName == "serialize:after")
    for (const event of afterEvents) {
      event._listener()
    }
    return data
  }
}