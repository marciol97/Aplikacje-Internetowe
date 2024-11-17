let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

// Funkcja do sprawdzenia zgody na powiadomienia
async function requestNotificationPermission() {
    if (Notification.permission === "granted") {
        return true;
    } else if (Notification.permission !== "denied") {
        return Notification.requestPermission().then(permission => {
            return permission === "granted";
        });
    }
    return false;
}

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");

        rasterContext.drawImage(canvas, 0, 0, 300, 150);

        createPuzzlePieces(canvas);
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);

        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
            new Notification("Twoja lokalizacja została zaktualizowana.");
        } else {
            console.log("Powiadomienia są zablokowane.");
        }
    }, positionError => {
        console.error(positionError);
    });
});

// Pociecie mapy i wymieszanie
function createPuzzlePieces(canvas) {
    let pieceSize = 75;
    let pieces = [];

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            let pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceSize;
            pieceCanvas.height = pieceSize;

            let context = pieceCanvas.getContext("2d");
            context.drawImage(canvas, x * pieceSize, y * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);

            pieceCanvas.classList.add("puzzlepiece");
            pieceCanvas.draggable = true;
            pieceCanvas.dataset.index = y * 4 + x;

            // drag & drop
            pieceCanvas.addEventListener("dragstart", dragStart);
            pieceCanvas.addEventListener("dragover", dragOver);
            pieceCanvas.addEventListener("drop", drop);
            pieceCanvas.addEventListener("dragend", dragEnd);

            pieces.push(pieceCanvas);
        }
    }

    pieces = shuffleArray(pieces);

    let puzzleContainer = document.getElementById("puzzlecontainer");
    puzzleContainer.innerHTML = "";
    pieces.forEach(piece => {
        puzzleContainer.appendChild(piece);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let draggedPiece = null;

function dragStart(event) {
    draggedPiece = event.target;
    setTimeout(() => {
        event.target.style.visibility = "hidden";
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();

    if (event.target.classList.contains("puzzlepiece") && event.target !== draggedPiece) {
        // Zamiana elementów miejscami
        let puzzleContainer = document.getElementById("puzzlecontainer");
        let draggedIndex = Array.from(puzzleContainer.children).indexOf(draggedPiece);
        let targetIndex = Array.from(puzzleContainer.children).indexOf(event.target);

        if (draggedIndex > -1 && targetIndex > -1) {
            puzzleContainer.insertBefore(draggedPiece, puzzleContainer.children[targetIndex]);
            puzzleContainer.insertBefore(event.target, puzzleContainer.children[draggedIndex]);
        }

        checkPuzzleCompletion();
    }
}

function dragEnd(event) {
    event.target.style.visibility = "visible";
    draggedPiece = null;
}

// funkcja do sprawdzania czy puzzle zostały poprawnie ułożone
async function checkPuzzleCompletion() {
    let puzzleContainer = document.getElementById("puzzlecontainer");
    let pieces = puzzleContainer.children;
    let isComplete = true;

    for (let i = 0; i < pieces.length; i++) {
        if (parseInt(pieces[i].dataset.index) !== i) {
            isComplete = false;
            break;
        }
    }

    if (isComplete) {
        alert("Brawo udało ci się ułożyć układankę!");

        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
            new Notification("Gratulacje!", {
                body: "Ułożyłeś układankę poprawnie!",
            });
        } else {
            console.log("Powiadomienia są zablokowane.");
        }
    }
}
