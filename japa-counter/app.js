document.addEventListener("DOMContentLoaded", function () {

    const beadTarget = 108;

    let currentBead = 0;
    let mala = 0;
    let totalCount = 0;

    let startTime;
    let timerStarted = false;
    let timerInterval;

    /* ELEMENTS */

    const malaCircle = document.getElementById("malaCircle");
    const tapArea = document.getElementById("tapArea");

    /* SOUND */

    const clickSound = new Audio("music.mp3");

    /* CREATE 108 BEADS */

    for (let i = 0; i < beadTarget; i++) {

        let bead = document.createElement("div");

        bead.classList.add("bead");

        if (i === 107) bead.classList.add("guru");

        let angle = (i / beadTarget) * 2 * Math.PI;

        let radius = 140;

        let x = 160 + radius * Math.cos(angle);
        let y = 160 + radius * Math.sin(angle);

        bead.style.left = x + "px";
        bead.style.top = y + "px";

        malaCircle.appendChild(bead);

    }

    const beads = document.querySelectorAll(".bead");

    beads[0].classList.add("active");

    /* TIMER */

    function startTimer() {

        timerInterval = setInterval(() => {

            let diff = Date.now() - startTime;

            let sec = Math.floor(diff / 1000) % 60;
            let min = Math.floor(diff / 60000);

            document.getElementById("timer").innerText =
                String(min).padStart(2, "0") + ":" +
                String(sec).padStart(2, "0");

        }, 1000);

    }

    /* TAP EVENT */

    tapArea.addEventListener("click", (e) => {

        if (e.target.tagName === "BUTTON") return;

        if (!timerStarted) {

            startTime = Date.now();
            startTimer();
            timerStarted = true;

        }

        clickSound.currentTime = 0;
        clickSound.play().catch(() => { });

        beads[currentBead].classList.remove("active");
        beads[currentBead].classList.add("done");

        currentBead++;
        totalCount++;

        if (currentBead >= beadTarget) {

            mala++;
            currentBead = 0;

            beads.forEach(b => b.classList.remove("done"));

        }

        beads[currentBead].classList.add("active");

        document.getElementById("centerCount").innerText = currentBead;
        document.getElementById("total").innerText = totalCount;
        document.getElementById("mala").innerText = mala;

        updateStreak();

    });

    /* RESET */

    function resetCounter() {

        currentBead = 0;
        mala = 0;
        totalCount = 0;

        beads.forEach(b => {
            b.classList.remove("done", "active");
        });

        beads[0].classList.add("active");

        document.getElementById("centerCount").innerText = 0;
        document.getElementById("total").innerText = 0;
        document.getElementById("mala").innerText = 0;

        clearInterval(timerInterval);
        timerStarted = false;

        document.getElementById("timer").innerText = "00:00";

    }

    /* DARK MODE */

    function toggleDark() {
        document.body.classList.toggle("dark");
    }

    /* BUTTON EVENTS */

    document.querySelector(".buttons button:nth-child(1)")
        .addEventListener("click", resetCounter);

    document.querySelector(".buttons button:nth-child(2)")
        .addEventListener("click", toggleDark);

    /* DAILY STREAK */

    function updateStreak() {

        let today = new Date().toDateString();

        let last = localStorage.getItem("lastDate");
        let streak = parseInt(localStorage.getItem("streak") || 0);

        if (last !== today) {

            let yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (last === yesterday.toDateString()) {
                streak++;
            }
            else {
                streak = 1;
            }

            localStorage.setItem("streak", streak);
            localStorage.setItem("lastDate", today);

        }

        document.getElementById("streak").innerText = streak;

    }

    updateStreak();

    /* PWA */

    if ("serviceWorker" in navigator) {

        navigator.serviceWorker.register("service-worker.js")
            .then(() => console.log("Service Worker Registered"))
            .catch(err => console.log("SW Error:", err));

    }

});