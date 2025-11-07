// --- Simple API wrapper ---
async function api(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// --- Game state ---
let correctCount = 0;
let wrongCount = 0;
let totalPoints = 0;

let countdownInterval = null;
let questionStartMs = 0;
const QUESTION_TIME = 20; // seconds
const INTERMISSION_TIME = 5; // seconds between questions to show feedback

const results = []; // optional: {question, choices, chosenIndex, wasCorrect, timeSec, points, correctAnswer}

document.addEventListener("DOMContentLoaded", async () => {
  const showQuestionEl = document.getElementById("showQuestion");
  const allButtons = document.getElementById("allButtons");

  showQuestionEl.innerHTML = `
    <h1>Loading question…</h1>
    <div id="hud" class="muted" style="margin-top:.5rem">⏱ — · Points: —</div>
  `;
  allButtons.innerHTML = `<p class="muted">Please wait</p>`;

  try {
    const state = await api(`/api/start?amount=5`, { method: "POST" });
    correctCount = 0;
    wrongCount = 0;
    totalPoints = 0;
    results.length = 0;
    renderState(state, showQuestionEl, allButtons);
  } catch (e) {
    console.error(e);
    showQuestionEl.innerHTML = `
      <h2>Failed to start game</h2>
      <pre style="white-space:pre-wrap">${e.message}</pre>
    `;
    allButtons.innerHTML = `
      <button class="btn_answer red" onclick="location.reload()">Try again</button>
    `;
  }
});

function renderState(
  state,
  showQuestionEl,
  allButtons,
  lastCorrect = null,
  lastChosenIndex = null,
  lastQuestionSnapshot = null,
  lastTimeSec = null,
  lastPoints = null,
  lastCorrectAnswer = null
) {
  // Record previous answer
  if (lastCorrect !== null && lastQuestionSnapshot) {
    if (lastCorrect) correctCount++; else wrongCount++;
    results.push({
      question: lastQuestionSnapshot.text,
      choices: [...lastQuestionSnapshot.choices],
      chosenIndex: lastChosenIndex,
      wasCorrect: lastCorrect,
      timeSec: lastTimeSec,
      points: lastPoints,
      correctAnswer: lastCorrectAnswer
    });
  }

  // Finished
  if (state.finished) {
    clearCountdown();
    const total = state.total ?? (correctCount + wrongCount);
    const correct = state.score ?? correctCount;

    showQuestionEl.innerHTML = `
      <h1>Results</h1>
      <div class="muted" style="margin-top:.5rem">${correct} / ${total} questions correct</div>
      <div style="margin-top:.5rem">Total points: <strong>${totalPoints}</strong></div>
    `;
    allButtons.innerHTML = `
      <div class="center" style="margin-top:16px">
        <button class="btn_answer green" onclick="window.location.href='landing.html'">Continue</button>
      </div>
    `;
    return;
  }

  // New question
  const q = state.question;
  const choices = q.choices;

  showQuestionEl.innerHTML = `
    <h1>${q.text}</h1>
    <div id="hud" class="muted" style="margin-top:.5rem">
      ⏱ <span id="hud-time">${QUESTION_TIME}</span>s ·
      Question ${state.answered + 1} / ${state.total} ·
      Points: <span id="hud-points">${totalPoints}</span>
    </div>
  `;

  showAnswerButtons(choices[0], choices[1], choices[2], choices[3], allButtons);

  // Wire up buttons (hide empty slots)
  const btns = [
    document.getElementById("answerOne"),
    document.getElementById("answerTwo"),
    document.getElementById("answerThree"),
    document.getElementById("answerFour"),
  ];
  btns.forEach((btn, idx) => {
    if (btn && typeof choices[idx] !== "undefined") {
      btn.addEventListener("click", () =>
        handleAnswer(idx, showQuestionEl, allButtons, { text: q.text, choices }, false)
      );
    } else if (btn) {
      btn.parentElement.style.display = "none";
    }
  });

  // Start question countdown
  startCountdown(showQuestionEl, allButtons, { text: q.text, choices });
}

function startCountdown(showQuestionEl, allButtons, questionSnapshot) {
  clearCountdown();
  questionStartMs = Date.now();
  let remaining = QUESTION_TIME;
  setHud(remaining, totalPoints);

  countdownInterval = setInterval(() => {
    remaining--;
    setHud(Math.max(0, remaining), totalPoints);

    if (remaining <= 0) {
      clearCountdown();
      // Timeout -> send -1 (backend treats as wrong + moves on)
      handleAnswer(-1, showQuestionEl, allButtons, questionSnapshot, true);
    }
  }, 1000);
}

function setHud(timeSec, points) {
  const t = document.getElementById("hud-time");
  const p = document.getElementById("hud-points");
  if (t) t.textContent = `${timeSec}`;
  if (p) p.textContent = `${points}`;
}

function clearCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

async function handleAnswer(choiceIndex, showQuestionEl, allButtons, questionSnapshot, isTimeout = false) {
  setButtonsEnabled(allButtons, false);
  const elapsedSec = Math.min(QUESTION_TIME, Math.max(0, (Date.now() - questionStartMs) / 1000));
  clearCountdown();

  // Linear points: max 1000 if instant, 0 at 20s (only for correct answers)
  let pointsThis = 0;

  try {
    const state = await api("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice: choiceIndex })
    });

    const wasCorrect = !!state.last_correct;
    const correctAnswerText = state.correct_answer ?? "(no data)";

    if (wasCorrect && !isTimeout) {
      pointsThis = Math.max(0, Math.round(1000 * (1 - elapsedSec / QUESTION_TIME)));
      totalPoints += pointsThis;
    }

    // Intermission: 5s feedback below the buttons (incl. correct solution)
    let seconds = INTERMISSION_TIME;
    allButtons.innerHTML = `
      <div class="center morepadding">
        <h2 style="margin:0">${wasCorrect ? "✅ Correct" : (isTimeout ? "⏰ Time's up!" : "❌ Wrong")}</h2>
        <p class="muted" style="margin:.25rem 0 0 0">+${pointsThis} pts</p>
        <p style="margin:.5rem 0 0 0">Correct answer: <strong>${escapeHtml(correctAnswerText)}</strong></p>
      </div>
      <div class="center">
        <h2 id="count" style="margin:.5rem 0 0 0">${seconds}</h2>
      </div>
    `;

    const countEl = document.getElementById("count");
    const timer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(timer);
        renderState(
          state,
          showQuestionEl,
          allButtons,
          wasCorrect,
          choiceIndex,
          questionSnapshot,
          Number(elapsedSec.toFixed(2)),
          pointsThis,
          correctAnswerText
        );
      } else {
        countEl.textContent = seconds;
      }
    }, 1000);

  } catch (e) {
    console.error(e);
    allButtons.innerHTML = `
      <p>There was a problem submitting your answer:</p>
      <pre style="white-space:pre-wrap">${e.message}</pre>
      <div class="center" style="margin-top:8px">
        <button class="btn_answer red" onclick="location.reload()">Reload</button>
      </div>
    `;
  }
}

// Render answer buttons (4 slots; hide empty)
function showAnswerButtons(a1, a2, a3, a4, allButtons) {
  const slot = (id, cls, label) => typeof label !== "undefined" && label !== null
    ? `
      <div class="center">
        <button class="btn_answer ${cls}" id="${id}">${label}</button>
      </div>
    `
    : `
      <div class="center" style="display:none">
        <button class="btn_answer ${cls}" id="${id}"></button>
      </div>
    `;

  allButtons.innerHTML = `
    <div class="questions">
      ${slot("answerOne", "green",  a1)}
      ${slot("answerTwo", "yellow", a2)}
      ${slot("answerThree", "red",  a3)}
      ${slot("answerFour", "blue",  a4)}
    </div>
  `;
}

function setButtonsEnabled(container, enabled) {
  container.querySelectorAll("button").forEach(b => (b.disabled = !enabled));
}

// Simple HTML escape to avoid rendering entities in the result screen
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
