const { test } = require("node:test");
const assert = require("node:assert");

const { Chord, processSong, keyMap } = require("../static/js/fiddle-tune.js");

// Helper: parse a roman-numeral token and render it in a concrete key.
function render(token, key) {
  const chord = new Chord(token);
  if (key !== "Roman") chord.transpose(key);
  return chord.getDisplayText();
}

// ---------------------------------------------------------------- bad data

test("an unparseable chord renders its raw token, flagged for the reader", () => {
  const chord = new Chord("H7");
  chord.transpose("A");
  const html = chord.getDisplayText();
  assert.match(html, /H7/, "the raw token must still be shown");
  assert.match(html, /song-chord-invalid/, "and must be marked as unrecognized");
  assert.doesNotMatch(html, /undefined/);
});

test("an unparseable chord is flagged invalid rather than throwing", () => {
  const chord = new Chord("nonsense");
  assert.strictEqual(chord.isValid, false);
});

test("a valid chord is flagged valid", () => {
  assert.strictEqual(new Chord("IV").isValid, true);
});

test("an unsupported key leaves the chord untransposed, not half-transposed", () => {
  const chord = new Chord("vi");
  chord.transpose("Q");
  // Must still read as the roman numeral, NOT as "vim".
  assert.strictEqual(chord.getDisplayText(), "vi<sup></sup>");
});

// ------------------------------------------------------- the scale degrees

test("every scale degree maps to the right root in the key of A", () => {
  const expected = ["A", "B", "C#", "D", "E", "F#", "G#"];
  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII"];
  numerals.forEach((numeral, i) => {
    assert.strictEqual(render(numeral, "A"), expected[i] + "<sup></sup>", numeral);
  });
});

test("lowercase numerals render as minor chords", () => {
  assert.strictEqual(render("vi", "A"), "F#m<sup></sup>");
  assert.strictEqual(render("iv", "A"), "Dm<sup></sup>");
  assert.strictEqual(render("ii", "G"), "Am<sup></sup>");
});

test("uppercase numerals do not pick up a minor suffix", () => {
  assert.strictEqual(render("VI", "A"), "F#<sup></sup>");
});

test("a chord quality suffix survives transposition", () => {
  assert.strictEqual(render("V7", "A"), "E<sup>7</sup>");
  assert.strictEqual(render("V7", "G"), "D<sup>7</sup>");
  assert.strictEqual(render("I7", "D"), "D<sup>7</sup>");
});

// --------------------------------------------------- flats, sharps, wrapping

test("bVII resolves a semitone below the seventh in every supported key", () => {
  // These are the enharmonic spellings the current note tables produce.
  const expected = { A: "G", B: "A", C: "A#", D: "C", E: "D", F: "D#", G: "F" };
  Object.keys(keyMap).forEach((key) => {
    assert.strictEqual(render("bVII", key), expected[key] + "<sup></sup>", key);
  });
});

test("flattening the root of the note table wraps down an octave", () => {
  // I in A is the first note in the sharp table; bI must wrap to the last.
  assert.strictEqual(render("bI", "A"), "G#<sup></sup>");
});

test("sharpening the last note of the note table wraps up an octave", () => {
  // VII in A is G#, the final sharp-table entry; #VII must wrap to A.
  assert.strictEqual(render("#VII", "A"), "A<sup></sup>");
});

test("a sharpened degree moves up one semitone", () => {
  assert.strictEqual(render("#IV", "A"), "D#<sup></sup>");
  assert.strictEqual(render("#I", "G"), "G#<sup></sup>");
});

// ------------------------------------------------- untransposed roman display

test("untransposed chords render roman numerals with musical accidentals", () => {
  assert.strictEqual(render("bVII", "Roman"), "&#9837;VII<sup></sup>");
  assert.strictEqual(render("#IV", "Roman"), "&#9839;IV<sup></sup>");
  assert.strictEqual(render("V7", "Roman"), "V<sup>7</sup>");
});

test("untransposed minor chords stay lowercase instead of gaining an m", () => {
  assert.strictEqual(render("vi", "Roman"), "vi<sup></sup>");
});

// ------------------------------------------------------------- whole chart

test("processSong transposes every chord of every line in place", () => {
  const song = {
    "a-part": {
      name: "Part A",
      lines: { line_1: ["I", "IV", "V7", "vi"] },
    },
  };

  processSong(song, "A");

  assert.deepStrictEqual(song["a-part"].lines.line_1, [
    "A<sup></sup>",
    "D<sup></sup>",
    "E<sup>7</sup>",
    "F#m<sup></sup>",
  ]);
});

test("processSong leaves chords as roman numerals when no key is chosen", () => {
  const song = {
    "b-part": { name: "Part B", lines: { line_1: ["I", "bVII"] } },
  };

  processSong(song, "Roman");

  assert.deepStrictEqual(song["b-part"].lines.line_1, [
    "I<sup></sup>",
    "&#9837;VII<sup></sup>",
  ]);
});
