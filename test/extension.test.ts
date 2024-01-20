import { Definable, DefinableDefinition } from "../src"
import { expect, test } from "@jest/globals"

class BaseClass extends Definable {
  testProp: string = ""
  
  definition({ prop }: DefinableDefinition): void {
    prop("testProp")
      .useSerializer<string>(() => this.testProp)
      .useDeserializer<string>((data) => this.testProp = data ?? "")
  }
}
class ExtendedClass extends BaseClass {
  definition({ prop, event }: DefinableDefinition): void {
    super.definition({ prop, event })
    prop("testProp")
      .useSerializer(() => this.testProp.toUpperCase())
  }
}

test("BaseClass", async () => {
  const baseClass = new BaseClass()
  baseClass.testProp = "Test propertie value"
  const data = baseClass.serialize()
  expect(data.testProp).toBe("Test propertie value")
})
test("ExtendedClass", async () => {
  const extendedClass = new ExtendedClass()
  extendedClass.testProp = "Test propertie value"
  const data = extendedClass.serialize()
  expect(data.testProp).toBe("TEST PROPERTIE VALUE")
})