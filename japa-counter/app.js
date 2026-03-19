document.addEventListener("DOMContentLoaded", () => {

    const beadTarget = 108;

    let currentBead = 0;
    let mala = 0;
    let totalCount = 0;

    /* TIMER STATE */
    let timer = 0;
    let timerInterval = null;
    let timerStarted = false;

    const malaCircle = document.getElementById("malaCircle");
    const centerCount = document.getElementById("centerCount");
    const totalEl = document.getElementById("total");
    const malaEl = document.getElementById("mala");
    const timerEl = document.getElementById("timer");
    const stopBtn = document.getElementById("stopBtn");

    if (!malaCircle || !centerCount || !totalEl || !malaEl || !timerEl) {
        console.error("Required elements not found");
        return;
    }

    /* TIMER */
    function startTimer() {
        if (timerStarted) return;

        timerStarted = true;

        timerInterval = setInterval(() => {
            timer++;

            let minutes = String(Math.floor(timer / 60)).padStart(2, "0");
            let seconds = String(timer % 60).padStart(2, "0");

            timerEl.innerText = `${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerStarted = false;
    }

    function updateStopBtnUI() {
        if (!stopBtn) return;

        if (timerStarted) {
            stopBtn.classList.add("running");
            stopBtn.classList.remove("stopped");
            stopBtn.innerText = "Stop";
        } else {
            stopBtn.classList.add("stopped");
            stopBtn.classList.remove("running");
            stopBtn.innerText = "Start";
        }
    }

    /* STOP BUTTON TOGGLE */
    if (stopBtn) {
        stopBtn.addEventListener("click", () => {

            if (timerStarted) {
                stopTimer();
            } else {
                startTimer();
            }

            updateStopBtnUI();
        });
    }

    updateStopBtnUI();

    /* SOUND */
    const audioPool = [];
    function playClick() {
        let sound = audioPool.find(a => a.paused);

        if (!sound) {
            sound = new Audio("music.mp3");
            audioPool.push(sound);
        }

        sound.currentTime = 0;
        sound.play().catch(() => { });
    }

    /* CREATE BEADS */
    function createBeads() {

        malaCircle.innerHTML = "";

        let size = malaCircle.offsetWidth || 300;
        let center = size / 2;
        let radius = size * 0.44;

        for (let i = 0; i < beadTarget; i++) {

            let bead = document.createElement("div");
            bead.className = "bead";

            if (i === 107) bead.classList.add("guru");

            let angle = (i / beadTarget) * 2 * Math.PI;

            let x = center + radius * Math.cos(angle);
            let y = center + radius * Math.sin(angle);

            bead.style.left = x + "px";
            bead.style.top = y + "px";

            malaCircle.appendChild(bead);
        }

        const first = malaCircle.querySelector(".bead");
        if (first) first.classList.add("active");
    }

    createBeads();
    window.addEventListener("resize", createBeads);

    function getBeads() {
        return malaCircle.querySelectorAll(".bead");
    }

    /* FULL SCREEN TAP */
    document.addEventListener("pointerdown", (e) => {

        if (
            e.target.closest("button") ||
            e.target.tagName === "INPUT" ||
            e.target.closest(".deity-section") ||
            e.target.closest(".buttons")
        ) return;

        e.preventDefault(); // ✅ FIXED placement

        startTimer();

        const beads = getBeads();
        if (!beads.length) return;

        playClick();

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

        centerCount.innerText = currentBead;
        totalEl.innerText = totalCount;
        malaEl.innerText = mala;

        showFloatingText(e);
    });

    /* FLOATING TEXT */
    function showFloatingText(e) {

        const nameInput = document.getElementById("deityName");
        const name = nameInput ? nameInput.value : "";

        let span = document.createElement("span");
        span.className = "floating";
        span.innerText = name || "🙏";

        span.style.left = e.clientX + "px";
        span.style.top = e.clientY + "px";

        document.body.appendChild(span);

        setTimeout(() => span.remove(), 1500);
    }

    /* RESET */
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {

            currentBead = 0;
            mala = 0;
            totalCount = 0;

            timer = 0;
            timerEl.innerText = "00:00";

            stopTimer();
            updateStopBtnUI();

            createBeads();

            centerCount.innerText = 0;
            totalEl.innerText = 0;
            malaEl.innerText = 0;
        });
    }

    /* DARK MODE */
    const darkBtn = document.getElementById("darkBtn");
    if (darkBtn) {
        darkBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    }

    /* IMAGE UPLOAD */
    const imageInput = document.getElementById("deityImage");
    const circleImage = document.getElementById("circleImage");

    if (imageInput && circleImage) {
        imageInput.addEventListener("change", () => {

            const file = imageInput.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                circleImage.src = e.target.result;
            };

            reader.readAsDataURL(file);
        });
    }

});
