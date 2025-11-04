document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const lobby = params.get("lobby");

    if (!username || !lobby) {
    window.location.href = "landing.html";
    return;
    }

    document.getElementById("username").textContent = username;
    document.getElementById("lobby").textContent = lobby;

    const answerOne = getElementById("answerOne")
    const answerTwo = getElementById("answerTwo")
    const answerThree = getElementById("answerThree")
    const answerFour = getElementById("answerFour")

    answerOne.addEventListener("click", () => {

    })

    answerTwo.addEventListener("click", () => {

    })

    answerThree.addEventListener("click", () => {

    })

    answerFour.addEventListener("click", () => {

    })
});
