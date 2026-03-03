# Quizly

> A containerized full-stack quiz game powered by the Open Trivia
> Database (https://opentdb.com). Built with FastAPI, Nginx and Docker
> --- ready to run in seconds.

------------------------------------------------------------------------

## 📖 Table of Contents

-   [Overview](#-overview)
-   [Features](#-features)
-   [Installation & Start](#-installation--start)
-   [Project Structure](#-project-structure)
-   [Deployment](#-deployment)
-   [License](#-license)
-   [Acknowledgements](#-acknowledgements)

------------------------------------------------------------------------

## 🧠 Overview

**Quizly** is a containerized full-stack quiz application consisting of:

-   A FastAPI backend
-   A static HTML/CSS/JavaScript frontend
-   An Nginx reverse proxy
-   A Docker Compose multi-container setup

The application fetches trivia questions from OpenTriviaDB and provides
a timed single-player quiz experience.

This version demonstrates:

-   Containerized backend services
-   Reverse proxy configuration
-   Multi-container orchestration
-   API-driven frontend communication

------------------------------------------------------------------------

## ✨ Features

-   🔹 Single-player quiz mode
-   🔹 Timed questions with dynamic scoring
-   🔹 Randomized answers
-   🔹 Clean separation between frontend and backend
-   🔹 Nginx reverse proxy (no CORS issues)
-   🔹 Multi-container architecture via Docker Compose
-   🔹 API-based communication between frontend and backend

------------------------------------------------------------------------

## 🚀 Installation & Start

### Requirements

-   Docker
-   Docker Compose (included in modern Docker Desktop)

No Python installation or manual dependency setup required.

------------------------------------------------------------------------

### Quick Start

From the project root directory:

docker compose build docker compose up

Then open in your browser:

http://localhost:8080

Backend API documentation (Swagger UI):

http://localhost:8000/docs

------------------------------------------------------------------------

### What Happens Internally

Docker Compose will:

1.  Build the FastAPI backend container
2.  Build the Nginx frontend container
3.  Create a shared Docker network
4.  Start both services
5.  Route `/api/*` requests internally from Nginx to FastAPI

Everything runs in isolated containers.

------------------------------------------------------------------------

## 🧩 Project Structure

```
Quizly/
├─ docker-compose.yml        # Multi-container orchestration
├─ requirements.txt          # Python dependencies
│
├─ backend/
│  ├─ Dockerfile             # Backend container definition
│  ├─ app/
│  │   └─ quizly.py          # FastAPI application
│  └─ modules/               # Question manager & logic
│
├─ web/
│  ├─ Dockerfile             # Frontend container definition
│  ├─ nginx.conf             # Reverse proxy configuration
│  ├─ landing.html
│  ├─ ingame.html
│  ├─ landing.js
│  ├─ ingame.js
│  └─ quizly.css
│
└─ README.md
```

------------------------------------------------------------------------

## 🖥️ Deployment

Since Quizly is containerized, it can be deployed anywhere Docker is
available.

### Option 1 -- Local Development (Default)

docker compose up

Accessible via:

http://localhost:8080

------------------------------------------------------------------------

### Option 2 -- Server Deployment

1.  Install Docker on your server (e.g., AWS EC2)
2.  Clone the repository
3.  Run:

docker compose up -d

The application will run in detached mode.

------------------------------------------------------------------------

### Architecture Summary

Browser ↓ Nginx (Port 8080) ↓ Reverse Proxy (/api/\*) ↓ FastAPI Backend
(Port 8000)

This setup demonstrates:

-   Reverse proxy routing
-   Container networking
-   Separation of concerns
-   Clean infrastructure boundaries

------------------------------------------------------------------------

## 📄 License

This project is licensed under the **MIT License**:

```
MIT License

Copyright (c) 2026 Leon Hosch, Victoria Meeßen, Zana Kryezi, Sven Richter, Mohamud

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

-   OpenTriviaDB (https://opentdb.com) for providing the free question
    API
-   Docker & FastAPI communities
-   Everyone who tested and provided feedback

------------------------------------------------------------------------

> 💡 This version of Quizly is designed to showcase containerization,
> reverse proxy configuration, and practical DevOps fundamentals in a
> clean, minimal full-stack application.
