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
  
  async deserialize(data: DefinableData): Promise<this> {
    await Promise.all(this._propDefinitions.map(async (definition) => {
      if (definition._deserializer) {
        if (definition._propertieName in data) {
          await definition._deserialize(data[definition._propertieName])
        } else {
          await definition._deserializer(null)
        }
      }
    }))
    return this
  }
  async serialize(): Promise<DefinableData> {
    const data: DefinableData = {}
    await Promise.all(this._propDefinitions.map(async (definition) => {
      if (definition._serializer) {
        data[definition._propertieName] = await definition._serialize()
      }
    }))
    return data
  }
}