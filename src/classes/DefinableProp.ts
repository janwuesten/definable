export type DefinablePropDeserializer<T> = ((data: T | null) => void) | ((data: T | null) => Promise<void>)
export type DefinablePropSerializer<T> = (() => T) | (() => Promise<T>)

export class DefinableProp {
  private __propertieName: string
  private __serializer: DefinablePropSerializer<any> | null = null
  private __deserializer: DefinablePropDeserializer<any> | null = null

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