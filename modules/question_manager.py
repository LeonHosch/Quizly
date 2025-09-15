import requests

class QuestionManager:

    def __init__(self, difficulty = None, category = None, qtype = None):
        self.AMOUNT = 1
        self.difficulty = difficulty
        self.category = category
        self.type = qtype
        self.generate_token()
        self.generate_params()

    def generate_token(self):
        self.token = requests.get("https://opentdb.com/api_token.php?command=request")
        self.token = self.token.json()
        if self.token["response_code"] != 0:
            print("Could not generate token!")
        else:
            self.token = self.token["token"]

    def generate_params(self):
        self.params = {"amount": self.AMOUNT, "token": self.token}
        if self.difficulty:
            self.params["difficulty"] = self.difficulty
        if self.category:
            self.params["category"] = self.category
        if self.type:
            self.params["type"] = self.qtype
        
    def get_question(self):
        API_URL = "https://opentdb.com/api.php"
        request = requests.get(API_URL, params=self.params)
        self.data = request.json()
        print(self.data)