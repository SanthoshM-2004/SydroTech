// ==========================================
// SYDRO TECH PREMIUM STARTUP JAVASCRIPT
// FULL FIXED VERSION FOR FLASK
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       MOBILE MENU TOGGLE
    =============================== */
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("show");

            menuBtn.innerHTML = navLinks.classList.contains("show")
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
                menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }


    /* ===============================
       TYPING EFFECT
    =============================== */
    const typing = document.getElementById("typing");

    if (typing) {

        const words = [
            "Premium Websites",
            "Startup Portals",
            "Modern UI Systems",
            "Lead Funnels",
            "Business Growth"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {

            const currentWord = words[wordIndex];

            if (!deleting) {
                typing.textContent =
                    currentWord.substring(0, charIndex + 1);

                charIndex++;

                if (charIndex === currentWord.length) {
                    deleting = true;
                    setTimeout(typeEffect, 1200);
                    return;
                }

            } else {

                typing.textContent =
                    currentWord.substring(0, charIndex - 1);

                charIndex--;

                if (charIndex === 0) {
                    deleting = false;
                    wordIndex++;

                    if (wordIndex >= words.length) {
                        wordIndex = 0;
                    }
                }
            }

            setTimeout(typeEffect, deleting ? 55 : 90);
        }

        typeEffect();
    }


    /* ===============================
       REVEAL ON SCROLL
    =============================== */
    const revealItems = document.querySelectorAll(".reveal");

    function revealSections() {
        revealItems.forEach(item => {
            const top = item.getBoundingClientRect().top;
            const trigger = window.innerHeight - 100;

            if (top < trigger) {
                item.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", revealSections);
    revealSections();


    /* ===============================
       NAVBAR SCROLL EFFECT
    =============================== */
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {
                navbar.style.background = "rgba(10,15,30,0.92)";
                navbar.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.25)";
            } else {
                navbar.style.background =
                    "rgba(10,15,30,0.55)";
                navbar.style.boxShadow = "none";
            }

        });
    }


    /* ===============================
       ACTIVE NAV LINK
    =============================== */
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-links a");

    function activeNav() {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 160;
            const height = section.offsetHeight;

            if (
                window.pageYOffset >= top &&
                window.pageYOffset < top + height
            ) {
                current = section.getAttribute("id");
            }

        });

        navItems.forEach(link => {
            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", activeNav);


    /* ===============================
       CONTACT FORM VALIDATION
       (FLASK COMPATIBLE)
    =============================== */
    const form = document.getElementById("contactForm");
    const formMsg = document.getElementById("formMsg");

    if (form) {

        form.addEventListener("submit", function(e) {

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const project =
                document.getElementById("projectType").value;

            const budget =
                document.getElementById("budget").value;

            const message =
                document.getElementById("message").value.trim();

            if (
                name === "" ||
                email === "" ||
                phone === "" ||
                project === "" ||
                budget === "" ||
                message === ""
            ) {
                e.preventDefault();
                showMessage(
                    "Please fill all required fields.",
                    "#ff6b6b"
                );
                return;
            }

            if (!validateEmail(email)) {
                e.preventDefault();
                showMessage(
                    "Enter valid email address.",
                    "#ff6b6b"
                );
                return;
            }

            if (phone.length < 8) {
                e.preventDefault();
                showMessage(
                    "Enter valid phone number.",
                    "#ff6b6b"
                );
                return;
            }

            // VALID FORM
            // No preventDefault()
            // Flask receives POST request
        });

    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(text, color) {
        if (formMsg) {
            formMsg.textContent = text;
            formMsg.style.color = color;

            setTimeout(() => {
                formMsg.textContent = "";
            }, 4000);
        }
    }


    /* ===============================
       WHATSAPP BUTTON
    =============================== */
    const chatBtn = document.querySelector(".floating-chat");

    if (chatBtn) {

        chatBtn.addEventListener("click", function(e) {
            e.preventDefault();

            const phone = "919360349300";

            const text =
                "Hello Sydro Tech, I want to discuss a project.";

            const url =
                `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

            window.open(url, "_blank");
        });

    }


    /* ===============================
       HERO IMAGE PARALLAX
    =============================== */
    const heroImg = document.querySelector(".hero-right img");

    if (heroImg) {

        window.addEventListener("mousemove", (e) => {

            const x =
                (window.innerWidth / 2 - e.pageX) / 40;

            const y =
                (window.innerHeight / 2 - e.pageY) / 40;

            heroImg.style.transform =
                `translate(${x}px, ${y}px)`;
        });

    }


    /* ===============================
       BUTTON RIPPLE
    =============================== */
    document.querySelectorAll("button, .btn-primary")
        .forEach(btn => {

        btn.style.position = "relative";
        btn.style.overflow = "hidden";

        btn.addEventListener("click", function(e) {

            const circle =
                document.createElement("span");

            const size =
                Math.max(
                    this.clientWidth,
                    this.clientHeight
                );

            circle.style.width = size + "px";
            circle.style.height = size + "px";
            circle.style.position = "absolute";
            circle.style.borderRadius = "50%";
            circle.style.background =
                "rgba(255,255,255,0.35)";
            circle.style.transform = "scale(0)";
            circle.style.left =
                e.offsetX - size / 2 + "px";
            circle.style.top =
                e.offsetY - size / 2 + "px";
            circle.style.animation =
                "rippleEffect .6s linear";

            this.appendChild(circle);

            setTimeout(() => {
                circle.remove();
            }, 600);

        });

    });


    /* ===============================
       RIPPLE CSS VIA JS
    =============================== */
    const style = document.createElement("style");

    style.innerHTML = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;

    document.head.appendChild(style);

});