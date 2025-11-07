#!/bin/bash
echo "=============================="
echo "   Starting Quizly Backend"
echo "=============================="

# --- Prüfe ob virtuelle Umgebung existiert ---
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# --- Aktiviere venv ---
source .venv/bin/activate

# --- Pip aktualisieren ---
python3 -m pip install --upgrade pip > /dev/null

# --- Dependencies installieren ---
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    echo "WARNING: requirements.txt not found! Skipping dependency installation."
fi

# --- Starte Server ---
echo
echo "Starting Uvicorn..."
echo "(Press CTRL + C to stop)"
echo
uvicorn app.quizly:app --reload

# --- Wenn Server beendet wird, bleibe im Terminal ---
echo
echo "Server stopped or crashed."
read -p "Press Enter to close..."
