


document.addEventListener("DOMContentLoaded", () => {

    // songData & songKey are already defined in the template

    var container = document.getElementById("fiddle-tune-container");

    // A song part has a display name and a list of lines of chords
    var songParts = [];
    for (key in songData) {
        songParts.push(songData[key]);
    }

    // for each songPart lets create a div with the name and a row for each line of chords
    // most songs will just have an A and B part
    for (var i = 0; i < songParts.length; i++) {
        var songPart = songParts[i];
        var songPartDiv = document.createElement("div");
        songPartDiv.className = "song-part";

        var songPartHeaderContainer = document.createElement("div");
        songPartHeaderContainer.className = "song-part-header-container";
        songPartDiv.appendChild(songPartHeaderContainer);

        var songPartName = document.createElement("h3");
        songPartName.innerHTML = songPart.name;
        songPartHeaderContainer.appendChild(songPartName);

        // Each part of the song has a list of "lines"
        var lineContainer = document.createElement("div");
        lineContainer.className = "song-line-container";
        var lines = [];
        for (key in songPart.lines) {
            lines.push(songPart.lines[key]);
        }


        for (var j = 0; j < lines.length; j++) {
            var line = lines[j];
            var lineSpan = document.createElement("span");
            lineSpan.className = "song-line";
            lineContainer.appendChild(lineSpan);

            // For each chord in the line, create a div with the chord name
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
    
  });


