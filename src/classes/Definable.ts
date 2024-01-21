import { BaseDefinable } from "./BaseDefinable"
import { DefinableEvent } from "./DefinableEvent"
import { DefinableProp } from "./DefinableProp"

export abstract class Definable extends BaseDefinable {
  constructor() {
    super()
    this.definition({
      prop: (field) => {
        const _definition = this._propDefinitions.find((a) => a._propertieName == field) ?? new DefinableProp(field)
        this._propDefinitions.push(_definition)
        return _definition
      },
      event: (event, listener) => {
        const _event = new DefinableEvent(event, listener)
        this._propEvents.push(_event)
        return _event
      }
    })
  }
}