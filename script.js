// ========================================
// CUBE TIMER 3x3
// FULL SCRIPT - BUTTON STOP FIX
// ========================================


// ========================================
// ELEMENTS
// ========================================

const timer =
    document.getElementById("timer");

const statusText =
    document.getElementById("status");

const scrambleText =
    document.getElementById("scrambleText");

const bestTime =
    document.getElementById("bestTime");

const averageTime =
    document.getElementById("averageTime");

const scrambleBtn =
    document.getElementById("scrambleBtn");

const historyBtn =
    document.getElementById("historyBtn");

const resetBtn =
    document.getElementById("resetBtn");

const leftHand =
    document.getElementById("leftHand");

const rightHand =
    document.getElementById("rightHand");

const historyPanel =
    document.getElementById("historyPanel");

const closeHistory =
    document.getElementById("closeHistory");

const historyList =
    document.getElementById("historyList");

const clearHistory =
    document.getElementById("clearHistory");


// ========================================
// TIMER VARIABLES
// ========================================

let startTime = 0;
let elapsedTime = 0;

let timerInterval = null;

let running = false;
let ready = false;

let leftPressed = false;
let rightPressed = false;

let stopPressed = false;


// ========================================
// SCRAMBLE MOVES
// ========================================

const moves = [
    "R", "R'", "R2",
    "L", "L'", "L2",
    "U", "U'", "U2",
    "D", "D'", "D2",
    "F", "F'", "F2",
    "B", "B'", "B2"
];


// ========================================
// HISTORY
// ========================================

let solveHistory = [];

try {

    solveHistory =
        JSON.parse(
            localStorage.getItem(
                "cubeTimerHistory"
            )
        ) || [];

} catch (error) {

    solveHistory = [];

}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(milliseconds) {

    return (
        milliseconds / 1000
    ).toFixed(2);

}


// ========================================
// UPDATE BEST + AVERAGE
// ========================================

function updateStats() {

    if (
        solveHistory.length === 0
    ) {

        bestTime.textContent = "--";
        averageTime.textContent = "--";

        return;
    }


    let best =
        solveHistory[0].time;


    let total = 0;


    for (
        const solve of solveHistory
    ) {

        if (
            solve.time < best
        ) {

            best = solve.time;

        }

        total += solve.time;

    }


    const average =
        total / solveHistory.length;


    bestTime.textContent =
        formatTime(best) + "s";


    averageTime.textContent =
        formatTime(average) + "s";

}


// ========================================
// UPDATE TIMER
// ========================================

function updateTimer() {

    if (!running) return;


    elapsedTime =
        Date.now() - startTime;


    timer.textContent =
        formatTime(elapsedTime);

}


// ========================================
// START TIMER
// ========================================

function startTimer() {

    if (running) return;


    running = true;

    stopPressed = false;


    startTime =
        Date.now();


    elapsedTime = 0;


    timerInterval =
        setInterval(
            updateTimer,
            10
        );


    statusText.textContent =
        "SOLVING";


    document.body.classList.remove(
        "timer-ready",
        "timer-stopped",
        "stop-pressed"
    );


    document.body.classList.add(
        "timer-running"
    );

}


// ========================================
// STOP TIMER
// ========================================

function stopTimer() {

    if (!running) return;


    running = false;


    clearInterval(
        timerInterval
    );


    timerInterval = null;


    elapsedTime =
        Date.now() - startTime;


    timer.textContent =
        formatTime(elapsedTime);


    addSolveToHistory();


    statusText.textContent =
        "SOLVED";


    stopPressed = false;


    document.body.classList.remove(
        "timer-running",
        "timer-ready",
        "stop-pressed"
    );


    document.body.classList.add(
        "timer-stopped"
    );

}


// ========================================
// RESET TIMER
// ========================================

function resetTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval = null;


    running = false;
    ready = false;

    stopPressed = false;


    leftPressed = false;
    rightPressed = false;


    startTime = 0;
    elapsedTime = 0;


    timer.textContent =
        "0.00";


    statusText.textContent =
        "HOLD BOTH";


    document.body.classList.remove(
        "timer-running",
        "timer-stopped",
        "timer-ready",
        "stop-pressed"
    );


    updateButtonStates();

}


// ========================================
// CHECK BOTH BUTTONS
// ========================================

function checkBothPressed() {

    if (running) return;


    if (
        leftPressed &&
        rightPressed
    ) {

        ready = true;


        statusText.textContent =
            "READY";


        document.body.classList.add(
            "timer-ready"
        );


        updateButtonStates();

    }

}


// ========================================
// HANDLE RELEASE BEFORE START
// ========================================

function handleRelease() {

    if (running) return;

    if (!ready) return;


    if (
        !leftPressed &&
        !rightPressed
    ) {

        ready = false;

        startTimer();

    }

}


// ========================================
// LEFT BUTTON
// ========================================

function leftDown(event) {

    event.preventDefault();
    event.stopPropagation();


    // ------------------------------------
    // IF SOLVING
    // Pressing button prepares to stop
    // ------------------------------------

    if (running) {

        stopPressed = true;


        document.body.classList.add(
            "stop-pressed"
        );


        statusText.textContent =
            "RELEASE TO STOP";


        return;
    }


    // ------------------------------------
    // BEFORE START
    // ------------------------------------

    leftPressed = true;


    checkBothPressed();

    updateButtonStates();

}


function leftUp(event) {

    event.preventDefault();
    event.stopPropagation();


    // ------------------------------------
    // IF SOLVING
    // Release button = STOP
    // ------------------------------------

    if (running && stopPressed) {

        stopTimer();

        return;
    }


    // ------------------------------------
    // BEFORE START
    // ------------------------------------

    leftPressed = false;

    handleRelease();

    updateButtonStates();

}


// ========================================
// RIGHT BUTTON
// ========================================

function rightDown(event) {

    event.preventDefault();
    event.stopPropagation();


    // ------------------------------------
    // IF SOLVING
    // Pressing button prepares to stop
    // ------------------------------------

    if (running) {

        stopPressed = true;


        document.body.classList.add(
            "stop-pressed"
        );


        statusText.textContent =
            "RELEASE TO STOP";


        return;
    }


    // ------------------------------------
    // BEFORE START
    // ------------------------------------

    rightPressed = true;


    checkBothPressed();

    updateButtonStates();

}


function rightUp(event) {

    event.preventDefault();
    event.stopPropagation();


    // ------------------------------------
    // IF SOLVING
    // Release button = STOP
    // ------------------------------------

    if (running && stopPressed) {

        stopTimer();

        return;
    }


    // ------------------------------------
    // BEFORE START
    // ------------------------------------

    rightPressed = false;

    handleRelease();

    updateButtonStates();

}


// ========================================
// HAND BUTTON EVENTS
// ========================================

leftHand.addEventListener(
    "pointerdown",
    leftDown
);

leftHand.addEventListener(
    "pointerup",
    leftUp
);

leftHand.addEventListener(
    "pointercancel",
    leftUp
);


rightHand.addEventListener(
    "pointerdown",
    rightDown
);

rightHand.addEventListener(
    "pointerup",
    rightUp
);

rightHand.addEventListener(
    "pointercancel",
    rightUp
);


// ========================================
// STOP ANYWHERE
// ========================================

const timerArea =
    document.querySelector(
        ".timer-area"
    );


timerArea.addEventListener(
    "pointerdown",
    function(event) {

        if (!running) return;


        if (
            event.target.closest(
                ".hand-button"
            )
        ) {

            return;
        }


        stopPressed = true;


        document.body.classList.add(
            "stop-pressed"
        );


        statusText.textContent =
            "RELEASE TO STOP";

    }
);


timerArea.addEventListener(
    "pointerup",
    function() {

        if (!running) return;

        if (!stopPressed) return;


        stopTimer();

    }
);


timerArea.addEventListener(
    "pointercancel",
    function() {

        stopPressed = false;


        document.body.classList.remove(
            "stop-pressed"
        );

    }
);


// ========================================
// BUTTON VISUALS
// ========================================

function updateButtonStates() {

    leftHand.classList.toggle(
        "pressed",
        leftPressed
    );


    rightHand.classList.toggle(
        "pressed",
        rightPressed
    );


    leftHand.classList.toggle(
        "ready",
        ready
    );


    rightHand.classList.toggle(
        "ready",
        ready
    );

}


// ========================================
// GENERATE SCRAMBLE
// ========================================

function generateScramble() {

    const scramble = [];

    let lastFace = "";


    while (
        scramble.length < 20
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                moves.length
            );


        const move =
            moves[randomIndex];


        const face =
            move.charAt(0);


        if (
            face === lastFace
        ) {

            continue;
        }


        scramble.push(move);

        lastFace = face;

    }


    scrambleText.textContent =
        scramble.join(" ");

}


// ========================================
// SAVE HISTORY
// ========================================

function saveHistory() {

    try {

        localStorage.setItem(
            "cubeTimerHistory",
            JSON.stringify(
                solveHistory
            )
        );

    } catch (error) {

        console.log(
            "Could not save history."
        );

    }

}


// ========================================
// ADD SOLVE
// ========================================

function addSolveToHistory() {

    const solve = {

        time:
            elapsedTime,

        scramble:
            scrambleText.textContent,

        date:
            new Date().toLocaleString()

    };


    solveHistory.unshift(
        solve
    );


    if (
        solveHistory.length > 100
    ) {

        solveHistory =
            solveHistory.slice(
                0,
                100
            );

    }


    saveHistory();

    renderHistory();

    updateStats();

}


// ========================================
// RENDER HISTORY
// ========================================

function renderHistory() {

    if (
        solveHistory.length === 0
    ) {

        historyList.innerHTML = `
            <div class="empty-history">
                No solves yet
            </div>
        `;

        return;
    }


    historyList.innerHTML =
        solveHistory
        .map(
            function(
                solve,
                index
            ) {

                return `
                    <div class="history-item">

                        <div class="history-number">
                            #${solveHistory.length - index}
                        </div>

                        <div class="history-time">
                            ${formatTime(solve.time)}
                        </div>

                        <div class="history-scramble">
                            ${solve.scramble}
                        </div>

                        <button
                            class="delete-solve"
                            type="button"
                            data-index="${index}"
                            aria-label="Delete solve ${solveHistory.length - index}"
                            title="Delete this solve"
                        >
                            🗑
                        </button>

                    </div>
                `;

            }
        )
        .join("");

}


// ========================================
// SCRAMBLE BUTTON
// ========================================

scrambleBtn.addEventListener(
    "click",
    function(event) {

        event.preventDefault();
        event.stopPropagation();


        generateScramble();

        resetTimer();

    }
);


// ========================================
// RESET BUTTON
// ========================================

resetBtn.addEventListener(
    "click",
    function(event) {

        event.preventDefault();
        event.stopPropagation();


        resetTimer();

    }
);


// ========================================
// HISTORY BUTTON
// ========================================

historyBtn.addEventListener(
    "click",
    function(event) {

        event.preventDefault();
        event.stopPropagation();


        renderHistory();


        historyPanel.classList.add(
            "open"
        );

    }
);


// ========================================
// CLOSE HISTORY
// ========================================

closeHistory.addEventListener(
    "click",
    function(event) {

        event.preventDefault();
        event.stopPropagation();


        historyPanel.classList.remove(
            "open"
        );

    }
);


// ========================================
// DELETE ONE SOLVE
// ========================================

historyList.addEventListener(
    "click",
    function(event) {

        const deleteButton = event.target.closest(".delete-solve");
        if (!deleteButton) return;

        event.preventDefault();
        event.stopPropagation();

        const index = Number(deleteButton.dataset.index);
        if (!Number.isInteger(index) || index < 0 || index >= solveHistory.length) {
            return;
        }

        const confirmed = confirm("Delete this solve record?");
        if (!confirmed) return;

        solveHistory.splice(index, 1);
        saveHistory();
        renderHistory();
        updateStats();
    }
);


// ========================================
// CLEAR HISTORY
// ========================================

clearHistory.addEventListener(
    "click",
    function(event) {

        event.preventDefault();
        event.stopPropagation();


        if (
            solveHistory.length === 0
        ) {

            return;
        }


        const confirmed =
            confirm(
                "Clear all solve history?"
            );


        if (!confirmed) return;


        solveHistory = [];


        saveHistory();

    renderHistory();

    updateStats();

    }
);


// ========================================
// KEYBOARD TESTING
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.repeat) return;


        if (
            event.key.toLowerCase()
            === "a"
        ) {

            if (!running) {

                leftPressed = true;

                checkBothPressed();

                updateButtonStates();

            }

        }


        if (
            event.key.toLowerCase()
            === "d"
        ) {

            if (!running) {

                rightPressed = true;

                checkBothPressed();

                updateButtonStates();

            }

        }


        if (
            event.code === "Space"
        ) {

            if (running) {

                stopPressed = true;


                statusText.textContent =
                    "RELEASE TO STOP";

            }

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {


        if (
            event.key.toLowerCase()
            === "a"
        ) {

            if (
                running &&
                stopPressed
            ) {

                stopTimer();

                return;
            }


            leftPressed = false;

            handleRelease();

            updateButtonStates();

        }


        if (
            event.key.toLowerCase()
            === "d"
        ) {

            if (
                running &&
                stopPressed
            ) {

                stopTimer();

                return;
            }


            rightPressed = false;

            handleRelease();

            updateButtonStates();

        }


        if (
            event.code === "Space"
        ) {

            if (
                running &&
                stopPressed
            ) {

                stopTimer();

            }

        }

    }
);


// ========================================
// INITIALIZE
// ========================================

generateScramble();

resetTimer();

renderHistory();

updateStats();


console.log(
    "Cube Timer 3x3 ready!"
);
