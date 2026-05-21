// PREMIUM LOGIN PAGE JS

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // AUTO FOCUS USERNAME
    // ==========================
    const username = document.querySelector("input[name='username']");
    if (username) {
        username.focus();
    }


    // ==========================
    // ENTER KEY SMOOTH SUBMIT
    // ==========================
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", function () {

            const btn = form.querySelector("button");

            btn.innerHTML = "Checking...";
            btn.disabled = true;

        });
    }


    // ==========================
    // ERROR MESSAGE AUTO HIDE
    // ==========================
    const error = document.querySelector(".error");

    if (error) {
        setTimeout(() => {
            error.style.transition = "0.5s";
            error.style.opacity = "0";
            error.style.transform = "translateY(-10px)";
        }, 2500);
    }


    // ==========================
    // INPUT GLOW EFFECT
    // ==========================
    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {

        input.addEventListener("focus", function () {
            this.style.transform = "scale(1.01)";
        });

        input.addEventListener("blur", function () {
            this.style.transform = "scale(1)";
        });

    });

});


// ==========================
// SHOW / HIDE PASSWORD
// ==========================
function togglePassword() {

    const password = document.getElementById("password");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }

}