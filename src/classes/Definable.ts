import { DefinableProp } from "./DefinableProp"
import { DefinableData } from "../types/DefinableData"

export type DefinableDefinitionDefine = (field: string) => DefinableProp
export type DefinableDefinition = {
  useProp: DefinableDefinitionDefine
}
export abstract class Definable {
  protected _propDefinitions: DefinableProp[] = []
  
  constructor() {
    this.definition({
      useProp: (field) => {
        const _definition = new DefinableProp(field)
        this._propDefinitions.push(_definition)
        return _definition
      }
    })
  }

  abstract definition({ useProp }: DefinableDefinition): void
  
  deserialize(data: DefinableData): this {
    this._propDefinitions.map((definition) => {
      if (definition._deserializer) {
        if (definition._propertieName in data) {
          definition._deserialize(data[definition._propertieName])
        } else {
          definition._deserializer(null)
        }
      }
    })
    return this
  }
  serialize(): DefinableData {
    const data: DefinableData = {}
    this._propDefinitions.map((definition) => {
      if (definition._serializer) {
        data[definition._propertieName] = definition._serialize()
      }
    })
    return data
  }
}