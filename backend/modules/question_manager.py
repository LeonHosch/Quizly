# modules/question_manager.py
import requests

class QuestionManager:
    def __init__(self, difficulty=None, category=None, qtype=None):
        self.AMOUNT = 1
        self.difficulty = difficulty
        self.category = category
        self.type = qtype
        self.generate_token()
        self.generate_params()

    def generate_token(self):
        r = requests.get("https://opentdb.com/api_token.php?command=request")
        data = r.json()
        if data.get("response_code") != 0:
            # handle gracefully; for demo we fall back to no token
            self.token = None
        else:
            self.token = data["token"]

    def generate_params(self):
        self.params = {"amount": self.AMOUNT}
        if self.token:
            self.params["token"] = self.token
        if self.difficulty:
            self.params["difficulty"] = self.difficulty
        if self.category:
            self.params["category"] = self.category
        if self.type:
            self.params["type"] = self.type

    def get_question(self):
        API_URL = "https://opentdb.com/api.php"
        r = requests.get(API_URL, params=self.params, timeout=8)
        self.data = r.json()
        # no prints here; just set self.data
