import { test } from "@jest/globals"
import { Definable, DefinableDefinition } from "../src"

class Country extends Definable {
  name: string = ""
  code: string = ""

  definition({ prop }: DefinableDefinition): void {
    prop<string>("name")
      .useDeserializer((data) => this.name = data ?? "")
      .useSerializer(() => this.name)
    prop<string>("code")
      .useValidator(() => {
        if (!this.code) {
          return "code-must-be-set"
        }
        return null
      })
      .useDeserializer((data) => this.code = data ?? "")
      .useSerializer(() => this.code)
  }
}
test("validate props", async () => {
  const county = new Country()
  const isValid = county.validate()
  console.log(isValid)
})