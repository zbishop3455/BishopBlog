


document.addEventListener("DOMContentLoaded", () => {

    // songData is being passed in from the template
    // songKey is being passed in from the template

    // Div for the chord chart
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

        // Create a div for the lines of chords
        var lineContainer = document.createElement("div");
        lineContainer.className = "song-line-container";

        // Extract lines from the song part
        var lines = [];
        for (key in songPart.lines) {
            lines.push(songPart.lines[key]);
        }

        console.log(lines);

        // For each line of chords
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


