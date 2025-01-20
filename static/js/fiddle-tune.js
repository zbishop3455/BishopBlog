


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
    // We always start with the Nashville key and then transpose to the selected key
    // Previous states are not saved
    if (songKey !== "Nashville") {
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



function transposeSong(song, songKey) {
    for (partId in song) {
        var songPart = song[partId];
        for (lineId in songPart.lines) {
            var line = songPart.lines[lineId];
            for (var k = 0; k < line.length; k++) {
                line[k] = "A";
            }
        }
    }
}