document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("play_button");
  const usernameInput = document.getElementById("username_id");

  playButton.addEventListener("click", () => {
    username = usernameInput.value.trim();
    const lobbyCode = "1234";

    if (!username) {
        usernameInput.value = "RandomName"
        username = "RandomName"
    }

    const params = new URLSearchParams({
        username: username,
        lobby: lobbyCode
    });

    window.location.href = `/ingame.html?${params.toString()}`;
    });
});
