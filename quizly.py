from modules import question_manager as questions
import random
import html


class Singleplayer:

    def __init__(self):
        self.score = 0
        self.init_lobby()
        self.questiongen = questions.QuestionManager()
        self.question_loop()

    def init_lobby(self):
        while True:
            try:
                self.amount = int(input("How many questions do you want to answer\nInput: "))
                break
            except:
                print("Wrong input!")

    def question_loop(self):
        for n in range(self.amount):
            self.show_question()
            self.format_answers()
            # best to wait 2-3 seconds here
            self.show_answers()
            self.user_answer()
            self.check_answer()
        print(f"You had {self.score} out of {self.amount} answers correct!")

    def show_question(self):
        self.questiongen.get_question()
        print(html.unescape(self.questiongen.data["results"][0]["question"]))

    def format_answers(self):
        self.answers = self.questiongen.data["results"][0]["incorrect_answers"] + [self.questiongen.data["results"][0]["correct_answer"]]
        random.shuffle(self.answers)

    def show_answers(self):
        iteration = 0
        for answer in self.answers:
            print(html.unescape(f"{iteration}) {answer}"))
            iteration += 1
        print("\n")

    def user_answer(self):
        while True:
            try:
                self.user_input = int(input("Answer: "))
                if self.user_input <= len(self.answers) and self.user_input >= 0:
                    break
                print("Number out of range!")
            except:
                print("Wrong input!")

    def check_answer(self):
        if self.answers[self.user_input] == self.questiongen.data["results"][0]["correct_answer"]:
            self.score += 1
            print("Correct!")
        else:
            print("Wrong :(")

Singleplayer()