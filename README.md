# Quizly

> A lightweight, local quiz game powered by the [Open Trivia Database](https://opentdb.com). No accounts, no servers — just run it and play.

---

## 📖 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Installation & Start](#installation--start)
* [Project Structure](#project-structure)
* [Deployment](#deployment)
* [License](#license)
* [Acknowledgements](#acknowledgements)

---

## 🧠 Overview

**Quizly** is a simple, local Python quiz app that fetches trivia questions from OpenTriviaDB.
It’s built to run completely offline after the first setup and requires **no external server or account**.

The goal is to have a **self-contained, single-player quiz experience** that runs instantly with minimal setup.

---

## ✨ Features

* 🔹 Single-player mode (no multiplayer planned)
* 🔹 Fully automatic setup via `run.bat`
* 🔹 Randomized questions from multiple categories and difficulty levels
* 🔹 Score tracking and progress display
* 🔹 Works entirely offline after first run

---

## 🚀 Installation & Start

### Requirements

* **Python 3.10+**
* No manual `pip` or virtual environment setup needed — `run.bat` handles everything.

### Quick Start (Recommended)

Simply double-click:

```
run.bat
```

The script will:

1. Check if Python is installed
2. Create a virtual environment
3. Install dependencies from `requirements.txt`
4. Launch the game automatically

After the first run, future starts are instant (no reinstall).

---

## 🧩 Project Structure

```
Quizly/
├─ app/             # Core game logic (questions, scoring, etc.)
├─ modules/         # Reusable Python modules
├─ requirements.txt # Dependency list
├─ run.bat          # Windows launcher (auto-setup + run)
├─ run.sh           # Optional Linux/macOS variant
├─ .env.example     # Example environment configuration
└─ README.md
```

---

## 🖥️ Deployment

Since **Quizly** is fully local, there’s no deployment process.

### Option 1 – Local Use (Default)

Just run `run.bat`.
The script handles everything automatically.

### Option 2 – Portable Setup (Optional)

To use on multiple computers:

1. Copy the entire `Quizly/` folder
2. Make sure Python is installed on the target system
3. Run `run.bat` — setup and play instantly

---

## 📄 License

This project is licensed under the **MIT License**:

```
MIT License

Copyright (c) 2025 Leon Hosch, Victoria Meeßen, Zana Kryezi, Sven Richter, Mohamud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 💬 Acknowledgements

* [OpenTriviaDB](https://opentdb.com) for providing the free question API
* Everyone who tested and gave feedback

---

> 💡 **Tip:** Because it runs fully offline and installs itself, *Quizly* makes a great showcase for Python automation, local app setup, and API integration.
