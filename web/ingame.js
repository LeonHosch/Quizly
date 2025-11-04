document.addEventListener("DOMContentLoaded", () => {
    const question = "What is the purpose of life?";
    const showQuestionEl = document.getElementById("showQuestion");
    const allButtons = document.getElementById("allButtons");

    // ✅ Show the question and answers right away
    showQuestion(question, showQuestionEl);
    showAnswerButtons(
        "There is none",
        "Biological answer",
        "Philosophical answer",
        "HEHEHEHA and GRRR",
        allButtons
    );

    // ✅ Then attach listeners (after the buttons exist)
    document.getElementById("answerOne").addEventListener("click", () => handleAnswer(0, allButtons));
    document.getElementById("answerTwo").addEventListener("click", () => handleAnswer(1, allButtons));
    document.getElementById("answerThree").addEventListener("click", () => handleAnswer(2, allButtons));
    document.getElementById("answerFour").addEventListener("click", () => handleAnswer(3, allButtons));
});

function showQuestion(question, showQuestionEl) {
    showQuestionEl.innerHTML = `
        <h1>${question}</h1>
    `;
}

function handleAnswer(buttonNr, allButtons) {
    const correct = 0; // temporary test value
    let checked = "";

    if (buttonNr === correct) {
        checked = "Correct!";
    } else {
        checked = "Wrong!";
    }

    // Replace all buttons with new content
    allButtons.innerHTML = `
        <div class="center morepadding">
            <h1>${checked}</h1>
        </div>
        <div class="center">
            <h1>Next question in:</h1>
            <h2 id="count">3</h2>
        </div>
    `;

    // Optional countdown
    let seconds = 3;
    const countEl = document.getElementById("count");
    const timer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(timer);
            allButtons.innerHTML = "<h1>Next question coming soon…</h1>";
        } else {
            countEl.textContent = seconds;
        }
    }, 1000);
}

function showAnswerButtons(a1, a2, a3, a4, allButtons) {
    allButtons.innerHTML = `
        <div class="questions">
            <div class="center">
                <button class="btn_answer green" id="answerOne">${a1}</button>
            </div>
            <div class="center">
                <button class="btn_answer yellow" id="answerTwo">${a2}</button>
            </div>
            <div class="center">
                <button class="btn_answer red" id="answerThree">${a3}</button>
            </div>
            <div class="center">
                <button class="btn_answer blue" id="answerFour">${a4}</button>
            </div>
        </div>
    `;
}
