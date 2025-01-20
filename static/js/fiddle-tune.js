

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

    // Translate the song data to the selected key
    // We always start with the roman numerals and then transpose to the selected key
    // Previous states are not saved
    if (songKey !== "Roman") {
        alert("Transposing to key of " + songKey);
        transposeSong(song, songKey);
    }

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


function transposeSong(song, songKey) {

    const keyRoots = keyMap[songKey];

    if (!keyRoots) {
        alert("Key not supported: " + songKey);
        return
    }


    for (partId in song) {
        var songPart = song[partId];
        for (lineId in songPart.lines) {
            var line = songPart.lines[lineId];
            for (var k = 0; k < line.length; k++) {
                var chordValue = line[k];
                
                // Push the entire chordValue onto a stack in reverse order
                var stack = [];
                for (var i = chordValue.length - 1; i >= 0; i--) {
                    stack.push(chordValue[i]);
                }

                // Pop the stack to get the roman numeral and chord quality
                var romanNumber = "";
                var chordQuality = "";


                while (stack.length > 0) {
                    var c = stack.pop();
                    if (romanNumeralsChars.includes(c)) {
                        romanNumber += c;
                    } else {
                        chordQuality = c;
                        break;
                    }
                }

                // Note if the chord is major or minor
                var isMinor = romanNumber === romanNumber.toLocaleLowerCase();

                // Translate the roman numeral to the scale degree
                var scaleDegree = romanNumeralMap[romanNumber.toUpperCase()];
                if (!scaleDegree) {
                    alert("Could not map chord to scale degree: " + chordValue);
                    return
                }

                // Translate the scale degree to the new key
                var newRoot = keyRoots[scaleDegree - 1];

                // Construct the new chord value
                var newChordValue = newRoot;
                if (isMinor) {
                    newChordValue += "m";
                }
                newChordValue += chordQuality;

                // Replace the chord value in the line
                line[k] = newChordValue;
            }
        }
    }
}

