

document.addEventListener("DOMContentLoaded", () => {

    var songKeyDropdown = document.getElementById("chart-key-select");

    // handle song key change
    songKeyDropdown.addEventListener("change", function() {
        renderCordChart(songKeyDropdown.value);
    });

    renderCordChart(songKeyDropdown.value);
  });



function renderCordChart(songKey) {

    // Clear the container
    var container = document.getElementById("fiddle-tune-container");
    container.innerHTML = "";

    // copy the song data
    var song = JSON.parse(JSON.stringify(songData));

    // Parses the song data and transposes it to the selected key if needed.
    // Converts roman numerals into display-ready html
    processSong(song, songKey);

    // For each part of the song (e.g. A-part or B-part) we draw the chords by line
    for (partId in song) {
        var songPart = song[partId];
        var songPartDiv = document.createElement("div");
        songPartDiv.className = "song-part";

        var songPartHeaderContainer = document.createElement("div");
        songPartHeaderContainer.className = "song-part-header-container";
        songPartDiv.appendChild(songPartHeaderContainer);

        var songPartName = document.createElement("h3");
        songPartName.innerHTML = songPart.name;
        songPartHeaderContainer.appendChild(songPartName);

        var lineContainer = document.createElement("div");
        lineContainer.className = "song-line-container";

        // Create the lines
        for (lineId in songPart.lines) {
            var line = songPart.lines[lineId];
            var lineSpan = document.createElement("span");
            lineSpan.className = "song-line";
            lineContainer.appendChild(lineSpan);

            // Create the chords 
            for (var k = 0; k < line.length; k++) {
                var chordContainer = document.createElement("span");
                chordContainer.className = "song-chord-container";
                lineSpan.appendChild(chordContainer);

                var chord = document.createElement("p");
                chord.className = "song-chord";
                chord.innerHTML = line[k];
                chordContainer.appendChild(chord);
            }
        }

        songPartDiv.appendChild(lineContainer);
        container.appendChild(songPartDiv);
    }
}

// All Notes - this is for easily applying sharps and flats
const allNotesSharp = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
const allNotesFlat = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];

// Map of keys to their chord root notes
const keyMap = {
    "A": ["A", "B", "C#", "D", "E", "F#", "G#"],
    "B": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    "C": ["C", "D", "E", "F", "G", "A", "B"],
    "D": ["D", "E", "F#", "G", "A", "B", "C#"],
    "E": ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "F": ["F", "G", "A", "Bb", "C", "D", "E"],
    "G": ["G", "A", "B", "C", "D", "E", "F#"]
}

// Valid roman numerals for chords
const romanNumeralsChars = ["I", "i", "V", "v"];

const romanNumeralMap = {
    "I": 1,
    "II": 2,
    "III": 3,
    "IV": 4,
    "V": 5,
    "VI": 6,
    "VII": 7
}


function processSong(song, songKey) {

    for (partId in song) {
        var songPart = song[partId];
        for (lineId in songPart.lines) {
            var line = songPart.lines[lineId];
            for (var k = 0; k < line.length; k++) {

                const chord = new Chord(line[k]);

                if (songKey !== "Roman") {
                    chord.transpose(songKey);
                }

                line[k] = chord.getDisplayText();
            }
        }
    }
}

class Chord {

    constructor(romanNumeralExpr) {
        this.romanNumeralExpr = romanNumeralExpr;

        // Parse the roman numeral into its components
        this.parseRomanNumeral();
    }

    parseRomanNumeral() {

        // Push the entire chordValue onto a stack in reverse order
        var stack = [];
        for (var i = this.romanNumeralExpr.length - 1; i >= 0; i--) {
            stack.push(this.romanNumeralExpr[i]);
        }

        // Pop the stack to get the roman numeral and chord quality
        this.sharpOrFlat = "";
        this.chordRoot = "";
        this.chordQuality = "";

        while (stack.length > 0) {
            var c = stack.pop();

            if (c === "#" || c === "b") {
                this.sharpOrFlat = c;
            } else if (romanNumeralsChars.includes(c)) {
                this.chordRoot += c;
            } else {
                this.chordQuality += c;
            }
        }

        // minor chords are all lowercase
        this.isMinor = this.chordRoot === this.chordRoot.toLocaleLowerCase();

        // Translate the roman numeral to the scale degree integer
        this.scaleDegree = romanNumeralMap[this.chordRoot.toUpperCase()];

        if (!this.scaleDegree) {
            alert("Could not map chord to scale degree: " + this.chordRoot);
            return
        }

    }

    transpose(key) {
        
        this.isTransposed = true;

        // Transpose from roman numeral to actual chord value
        var keyRoots = keyMap[key];

        if (!keyRoots) {
            alert("Unsupported Key: " + key);
            return;
        }

        // Translate the scale degree to the new key
        var newRoot = keyRoots[this.scaleDegree - 1];

        // Extract the sharp or flat modifier from the new root (+1 note or -1 note)
        var sharpOrFlatModifier = 0;
        if (this.sharpOrFlat === "#") {
            sharpOrFlatModifier = 1;
        } else if (this.sharpOrFlat === "b") {
            sharpOrFlatModifier = -1;
        }
        
        // Determine which list of notes to use (sharp or flat)
        var noteList = allNotesSharp;
        if (newRoot.includes("b")) {
            noteList = allNotesFlat;
        }

        // Find the index of the new root note
        var idx = noteList.indexOf(newRoot);
        idx += sharpOrFlatModifier;

        if (idx < 0) { // wrap around
            idx = noteList.length - 1;
        } else if (idx >= noteList.length) {
            idx = 0;
        }

        newRoot = noteList[idx];

        this.chordRoot = newRoot;
    }

    getDisplayText() {

        if (! this.isTransposed) {
            var prefix = "";
            if (this.sharpOrFlat === "#") {
                prefix = "&#9839;";
            } else if (this.sharpOrFlat === "b") {
                prefix = "&#9837;";
            }

            return prefix + this.chordRoot + "<sup>" + this.chordQuality + "</sup>";
        }

        var s = this.chordRoot;
        if (this.isMinor) {
            s += "m";
        }
        
        s += "<sup>" + this.chordQuality + "</sup>";

        return s;
    }

}
