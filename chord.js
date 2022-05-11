var currentChord = 0;
var chordList;
var keys;
var key;
var chords;
var chordkey;
var parentChord;
var childChord;
var fillColor = 'rgb(0,176,189)';

class Fretboard {
    constructor(width, height, posx, posy, barre) {
        this.height = height;
        this.width = width;
    }
}
class Chord {
    constructor(data, name) {
        // this.E2 = data.E2;
        // this.A2 = data.A2;
        // this.D3 = data.D3;
        // this.G3 = data.G3;
        // this.B3 = data.B3;
        // this.E4 = data.E4;
        this.array = [data.E2, data.A2, data.D3, data.G3, data.B3, data.E4];
        this.barre = data.Barre;
        this.name = name;
    }
}

async function getChords() {
    const request = new Request('chords.json', {
        headers: {
            'Accept': 'application/json'
        }
    });
    const data = await fetch(request)
        .then(response => response.json())
    return data;
}

function generateButtons() {

    var btndiv = document.getElementById("buttons")

    keys.forEach((element) => {

        let btn = document.createElement("button");
        btn.innerHTML = element;
        btn.name = "parentbutton";
        btn.style.border = "5px solid";
        btn.style.borderRadius = "20%";
        btn.style.backgroundColor = "white";
        btn.style.fontSize = "48px";
        btn.style.padding = "10px 20px"
        btn.style.margin = "10px"
        btn.onclick = function () {
            document.getElementsByName("parentbutton").forEach((element) => {
                element.style.backgroundColor = "white";
            });
            btn.style.backgroundColor = fillColor;
            parentChord = btn.innerHTML;
            chords = Object.keys(chordList[parentChord])
            var btndiv = document.getElementById("chords")
            btndiv.innerHTML = "";
            chords.forEach((element) => {
                let btn = document.createElement("button");
                btn.innerHTML = element;
                btn.name = "childbutton";
                btn.style.border = "5px solid";
                btn.style.borderRadius = "20%";
                btn.style.backgroundColor = "white";
                btn.style.fontSize = "36px";
                btn.style.margin = "10px"

                btn.onclick = function () {
                    document.getElementsByName("childbutton").forEach((element) => {
                        element.style.backgroundColor = "white";
                    });
                    btn.style.backgroundColor = fillColor;

                    currentChord = 0;
                    childChord = btn.innerHTML;

                    const chord = new Chord(chordList[parentChord][childChord][currentChord], childChord);
                    console.log(chord)
                    drawLeftButton()
                    drawRightButton()
                    drawBalls();
                    drawFretBoard(chord);
                }
                btndiv.appendChild(btn);
            });
        }
        btndiv.appendChild(btn);
    }
    );


}

async function draw() {
    chordList = await getChords();
    keys = Object.keys(chordList);

    generateButtons();
    document.getElementsByName("parentbutton")[0].click();
    document.getElementsByName("childbutton")[0].click();


}

function drawBalls() {
    var canvas = document.getElementById('nav');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var width = canvas.width;
        var height = canvas.height;
        var qnty = chordList[parentChord][childChord].length;


        chordList[parentChord][childChord].forEach((chord, index) => {

            if (index == currentChord) {
                ctx.beginPath();
                ctx.arc(index / qnty * width + width / (qnty * 2), height / 2, 15, 0, 2 * Math.PI, true);
                // ctx.fillStyle = fillColor;
                ctx.fill();
            }
            else {
                ctx.beginPath();
                ctx.arc(index / qnty * width + width / (qnty * 2), height / 2, 9, 0, 2 * Math.PI, true);
                ctx.lineWidth = 5;
                ctx.stroke();
            }
        });

    }
}

async function drawNextChrod() {
    currentChord = (currentChord + 1) % chordList[parentChord][childChord].length;

    const chord = new Chord(chordList[parentChord][childChord][currentChord], childChord);
    drawFretBoard(chord);
    drawBalls();

}
async function drawPreviousChrod() {
    currentChord = (currentChord + chordList[parentChord][childChord].length - 1) % chordList[parentChord][childChord].length;

    const chord = new Chord(chordList[parentChord][childChord][currentChord], childChord);
    drawFretBoard(chord);
    drawBalls();
}

function drawLeftButton() {
    var canvas = document.getElementById('leftButton');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.fill();
        canvas.onclick = function () {
            drawPreviousChrod();
        }
    }

}
function drawRightButton() {

    var canvas = document.getElementById('rightButton');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(0, 0);
        ctx.fill();
        canvas.onclick = function () {
            drawNextChrod();
        }
    }
}

function drawFretBoard(chord) {

    var canvas = document.getElementById('chord1');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const fretboard = new Fretboard(canvas.width, canvas.height);
        var width = fretboard.width * 2 / 3;
        var height = fretboard.height * 3 / 4;

        var posx = fretboard.width / 6;
        var posy = fretboard.height / 6;

        var fingerSize = width / 15;

        var barresize = height / 50;

        // Name
        ctx.font = fingerSize * 2 + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillText(chord.name, canvas.width / 2, fingerSize);

        // Vertical Lines
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(posx + i / 5 * width, posy);
            ctx.lineTo(posx + i / 5 * width, posy + height);
            ctx.lineWidth = 5;

            ctx.stroke();
        }

        // Neck
        ctx.fillStyle = fillColor;
        ctx.fillRect(posx - 3, posy - barresize / 2, width + 6, barresize);

        // Horizontal Lines
        for (let i = 1; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(posx, posy + height * i / 5);
            ctx.lineTo(width + posx, posy + height * i / 5);
            ctx.lineWidth = 5;

            ctx.stroke();
        }

        // Fingers
        var fingers = [];
        for (var i = 0; i < chord.array.length; i++) {
            if (chord.array[i] > 0) {
                fingers.push(chord.array[i]);
            }
        }
        var minFret = Math.min.apply(Math, fingers);
        var maxFret = Math.max.apply(Math, fingers);

        if (minFret > 1 && maxFret > 4) {
            ctx.font = posx * 4 / 8 + 'px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillText(minFret, posx / 3, posy + height / 10);
        }

        if (chord.barre > 0) {
            ctx.beginPath();
            ctx.arc(posx, posy + height / 10, fingerSize, 0, 2 * Math.PI, true);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.fillRect(posx, posy + height / 10 - fingerSize, width, fingerSize * 2);

            ctx.beginPath();
            ctx.arc(posx + width, posy + height / 10, fingerSize, 0, 2 * Math.PI, true);
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        chord.array.forEach((finger, index) => {
            var fingerPos = (minFret > 0 && maxFret > 3) ? finger - minFret : finger - 1;
            if (fingerPos >= 0) {
                ctx.beginPath();
                ctx.arc(posx + index / 5 * width, posy + height / 10 + height * fingerPos / 5, fingerSize, 0, 2 * Math.PI, true);
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            else if (finger == 0) {
                ctx.beginPath();
                ctx.arc(posx + index / 5 * width, posy - fingerSize * 1.6, fingerSize * 0.8, 0, 2 * Math.PI, true);
                ctx.lineWidth = 5;
                ctx.stroke();
            }
            else if (finger == -1) {
                ctx.beginPath();
                console.log(fingerSize)
                ctx.moveTo(posx + index / 5 * width - fingerSize / 2, posy - fingerSize * 1.5 - fingerSize / 2);
                ctx.lineTo(posx + index / 5 * width + fingerSize / 2, posy - fingerSize * 1.5 + fingerSize / 2);
                ctx.moveTo(posx + index / 5 * width + fingerSize / 2, posy - fingerSize * 1.5 - fingerSize / 2);
                ctx.lineTo(posx + index / 5 * width - fingerSize / 2, posy - fingerSize * 1.5 + fingerSize / 2);
                ctx.lineWidth = 5;
                ctx.stroke();
            }

        });
    }



}
