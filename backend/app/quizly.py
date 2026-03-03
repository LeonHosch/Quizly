# app/quizly.py
from fastapi import FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from pathlib import Path
from typing import Optional, List, Dict
import random
import html

from modules import question_manager as questions

# Local fallback questions if OpenTDB fails
LOCAL_FALLBACK_QUESTIONS = [
    {
        "question": "Which language runs in a web browser?",
        "correct_answer": "JavaScript",
        "incorrect_answers": ["C++", "Java", "Python"],
    },
    {
        "question": "What is the capital of France?",
        "correct_answer": "Paris",
        "incorrect_answers": ["Rome", "Berlin", "Madrid"],
    },
    {
        "question": "How many seconds are in a minute?",
        "correct_answer": "60",
        "incorrect_answers": ["30", "90", "120"],
    },
    {
        "question": "True or False: The Earth orbits the Sun.",
        "correct_answer": "True",
        "incorrect_answers": ["False"],
    },
]


class Singleplayer:
    def __init__(self, amount: int):
        self.score = 0
        self.amount = int(amount)
        self.answered = 0
        self.finished = False

        self.questiongen = questions.QuestionManager()

        self.answers: List[str] = []
        self.user_input: Optional[int] = None
        self.current_correct: Optional[str] = None
        self.current_question_text: Optional[str] = None

        self._fetch_and_prepare_question_or_finish()

    def _fetch_and_prepare_question_or_finish(self):
        q = self._get_safe_question_dict()
        if not q:
            self.finished = True
            self.current_question_text = None
            self.answers = []
            self.current_correct = None
            self.user_input = None
            return

        self.current_question_text = html.unescape(q["question"])
        correct = q["correct_answer"]
        incorrects = q.get("incorrect_answers", [])
        answers = list(incorrects) + [correct]
        self.answers = [html.unescape(a) for a in answers]
        random.shuffle(self.answers)
        self.current_correct = correct
        self.user_input = None

    def _get_safe_question_dict(self) -> Optional[Dict]:
        try:
            self.questiongen.get_question()
            data = getattr(self.questiongen, "data", None) or {}
            results = data.get("results")
            if isinstance(results, list) and len(results) > 0:
                r0 = results[0]
                if all(k in r0 for k in ("question", "correct_answer", "incorrect_answers")):
                    return r0
        except Exception:
            pass

        if LOCAL_FALLBACK_QUESTIONS:
            return random.choice(LOCAL_FALLBACK_QUESTIONS)
        return None

    def show_answers(self) -> List[str]:
        return list(self.answers)

    def user_answer(self, choice_index: int) -> bool:
        if 0 <= choice_index < len(self.answers):
            self.user_input = choice_index
            return True
        return False

    def wrong_and_advance(self) -> bool:
        self._advance_to_next_question()
        return False

    def check_answer(self) -> bool:
        if self.user_input is None:
            return False
        is_correct = (self.answers[self.user_input] == html.unescape(self.current_correct))
        if is_correct:
            self.score += 1
        self._advance_to_next_question()
        return is_correct

    def _advance_to_next_question(self):
        self.answered += 1
        if self.answered >= self.amount:
            self.finished = True
            self.current_question_text = None
            self.answers = []
            self.user_input = None
            self.current_correct = None
            return
        self._fetch_and_prepare_question_or_finish()

    def to_public_state(self, last_correct: Optional[bool] = None) -> Dict:
        return {
            "finished": self.finished,
            "score": self.score,
            "answered": self.answered,
            "total": self.amount,
            "question": None if self.finished else {
                "text": self.current_question_text,
                "choices": self.show_answers(),
            },
            "last_correct": last_correct,
        }


app = FastAPI(title="Quizly Simple")

BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR.parent / "web"

#app.mount("/web", StaticFiles(directory=WEB_DIR), name="web")

@app.get("/")
def serve_landing():
    return FileResponse(WEB_DIR / "landing.html")


game: Optional[Singleplayer] = None


class AnswerIn(BaseModel):
    choice: int


@app.post("/api/start")
def api_start(amount: int = Query(5, ge=1, le=50)):
    global game
    game = Singleplayer(amount=amount)
    return game.to_public_state()


@app.get("/api/state")
def api_state():
    global game
    if not game:
        return JSONResponse(status_code=400, content={"error": "No active game"})
    return game.to_public_state()


@app.post("/api/answer")
def api_answer(payload: AnswerIn):
    global game
    if not game:
        return JSONResponse(status_code=400, content={"error": "No active game"})

    # Capture the previous question's correct answer BEFORE advancing
    prev_correct = html.unescape(game.current_correct) if game.current_correct else None

    if not game.user_answer(payload.choice):
        correct = game.wrong_and_advance()
        state = game.to_public_state(last_correct=correct)
        state["note"] = "timeout_or_invalid_choice"
        state["correct_answer"] = prev_correct
        return state

    correct = game.check_answer()
    state = game.to_public_state(last_correct=correct)
    state["correct_answer"] = prev_correct
    return state
