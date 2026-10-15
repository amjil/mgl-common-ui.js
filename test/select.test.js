import assert from "node:assert/strict"
import test from "node:test"
import {readFileSync} from "node:fs"
import {fileURLToPath} from "node:url"
import {dirname, join} from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")

test("select module exports enhanceSelect and MnSelect", async () => {
  const mod = await import("../src/select.js")
  assert.equal(typeof mod.enhanceSelect, "function")
  assert.equal(typeof mod.MnSelect, "function")
  assert.equal(typeof mod.defineMnSelect, "function")
})

test("index re-exports select helpers", async () => {
  const mod = await import("../src/index.js")
  assert.equal(typeof mod.enhanceSelect, "function")
  assert.equal(typeof mod.MnSelect, "function")
})

test("stylesheet defines mn-select-host / list", () => {
  const css = readFileSync(join(root, "styles/mgl-common-ui.css"), "utf8")
  assert.match(css, /\.mn-select-host\b/)
  assert.match(css, /\.mn-select-list\b/)
  assert.match(css, /\.mn-select-option\b/)
})
