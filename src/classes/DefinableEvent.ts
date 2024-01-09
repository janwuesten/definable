export type DefinableEventName = "deserialize.before" | "deserialize.after" | "serialize.before" | "serialize.after"
export type DefinableEventListener = () => void
export class DefinableEvent {
  private __eventName: DefinableEventName
  private __listener: DefinableEventListener

  constructor(eventName: DefinableEventName, listener: DefinableEventListener) {
    this.__eventName = eventName
    this.__listener = listener
  }

  get _eventName() {
    return this.__eventName
  }
  get _listener() {
    return this.__listener
  }
}