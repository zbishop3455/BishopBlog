const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const { Chord, keyMap } = require("../static/js/fiddle-tune.js");

const TUNE_DIR = path.join(__dirname, "..", "content", "resources", "fiddle-tunes");

// Pull every chord token out of the `line_N: ['I','IV',...]` rows of the
// songData frontmatter, so a typo in a chart fails the build instead of
// quietly rendering the wrong chord.
function chordTokens() {
  const found = [];
  for (const file of fs.readdirSync(TUNE_DIR)) {
    if (!file.endsWith(".md") || file === "_index.md") continue;
    const text = fs.readFileSync(path.join(TUNE_DIR, file), "utf8");
    for (const line of text.split("\n")) {
      const match = line.match(/^\s*line_\d+:\s*\[(.*)\]\s*$/);
      if (!match) continue;
      for (const raw of match[1].match(/'[^']*'/g) || []) {
        found.push({ file, token: raw.slice(1, -1) });
      }
    }
  }
  return found;
}

test("the tune files actually contain chord data to check", () => {
  assert.ok(chordTokens().length > 100, "expected to find chord tokens");
});

test("every chord in every tune parses to a real scale degree", () => {
  for (const { file, token } of chordTokens()) {
    assert.strictEqual(
      new Chord(token).isValid,
      true,
      `${file}: "${token}" does not parse to a scale degree`
    );
  }
});

test("no chord mixes upper and lower case in its numeral", () => {
  // Case carries meaning here: uppercase is major, lowercase is minor.
  // A token like "iV" is always a typo, and it silently reads as major.
  for (const { file, token } of chordTokens()) {
    const numeral = token.replace(/[^IiVv]/g, "");
    const consistent =
      numeral === numeral.toUpperCase() || numeral === numeral.toLowerCase();
    assert.ok(consistent, `${file}: "${token}" mixes upper and lower case`);
  }
});

test("every key offered by a tune is one the transposer supports", () => {
  for (const file of fs.readdirSync(TUNE_DIR)) {
    if (!file.endsWith(".md") || file === "_index.md") continue;
    const text = fs.readFileSync(path.join(TUNE_DIR, file), "utf8");
    const block = text.split("songKeys:")[1];
    if (!block) continue;
    for (const raw of block.split("songData:")[0].match(/'[^']*'/g) || []) {
      const key = raw.slice(1, -1);
      assert.ok(keyMap[key], `${file}: key "${key}" is not in keyMap`);
    }
  }
});
