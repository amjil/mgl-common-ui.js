import assert from "node:assert/strict"
import test from "node:test"
import {wrapEmoji, containsEmoji, isEmojiText, escapeHtml} from "../src/emoji.js"

test("wrapEmoji leaves plain Mongolian alone", () => {
  const text = "ᠮᠣᠩᠭᠣᠯ"
  assert.equal(wrapEmoji(text), text)
  assert.equal(containsEmoji(text), false)
})

test("wrapEmoji wraps a color emoji", () => {
  const html = wrapEmoji("ᠰᠠᠶᠢᠨ 😀")
  assert.match(html, /<span class="mn-emoji">/)
  assert.match(html, /😀/)
  assert.equal(containsEmoji("ᠰᠠᠶᠢᠨ 😀"), true)
})

test("isEmojiText requires pictographs", () => {
  assert.equal(isEmojiText("😀"), true)
  assert.equal(isEmojiText("12"), false)
  assert.equal(isEmojiText(""), false)
})

test("escapeHtml is applied around emoji runs", () => {
  const html = wrapEmoji("<hi>😀")
  assert.equal(html.startsWith("&lt;hi&gt;"), true)
  assert.equal(escapeHtml("<a>"), "&lt;a&gt;")
})
