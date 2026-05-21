// PREMIUM ADMIN DASHBOARD JS

document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // LIVE CLOCK
    // ===============================
    const topbar = document.querySelector(".topbar");

    const clock = document.createElement("div");
    clock.id = "liveClock";
    clock.style.fontSize = "14px";
    clock.style.opacity = "0.9";
    clock.style.marginTop = "6px";

    topbar.appendChild(clock);

    function updateClock() {
        const now = new Date();

        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();

        clock.innerHTML = date + " | " + time;
    }

    setInterval(updateClock, 1000);
    updateClock();


    // ===============================
    // CONFIRM DELETE
    // ===============================
    const deleteBtns = document.querySelectorAll(".delete-btn");

    deleteBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {

            const confirmDelete = confirm(
                "Are you sure you want to delete this lead?"
            );

            if (!confirmDelete) {
                e.preventDefault();
            }

        });
    });


    // ===============================
    // SUCCESS FLASH ON SAVE NOTE
    // ===============================
    const noteForms = document.querySelectorAll("form[action^='/save-note/']");

    noteForms.forEach(form => {
        form.addEventListener("submit", function () {
            alert("Note Saved Successfully");
        });
    });


    // ===============================
    // TABLE ROW HIGHLIGHT
    // ===============================
    const rows = document.querySelectorAll("table tr");

    rows.forEach((row, index) => {
        if (index !== 0) {
            row.addEventListener("click", function () {
                rows.forEach(r => r.classList.remove("activeRow"));
                row.classList.add("activeRow");
            });
        }
    });


    // ===============================
    // SEARCH AUTO FOCUS
    // ===============================
    const searchInput = document.querySelector("input[name='search']");

    if (searchInput) {
        searchInput.focus();
    }


    // ===============================
    // STATUS CHANGE ALERT
    // ===============================
    const statusSelect = document.querySelectorAll("select[name='status']");

    statusSelect.forEach(select => {
        select.addEventListener("change", function () {
            alert("Lead Status Updated");
        });
    });


});

// ===== PAGINATION ENHANCEMENT JS =====

document.addEventListener("DOMContentLoaded", function () {

    const currentPage = document.querySelector(".active-page");

    if (currentPage) {
        currentPage.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    }

    const pageBtns = document.querySelectorAll(".page-btn");

    pageBtns.forEach(btn => {

        btn.addEventListener("click", function () {

            this.innerHTML = "Loading...";
            this.style.opacity = "0.8";

        });

    });

});

// ===== LIVE TABLE SEARCH =====

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.querySelector(
        'input[name="search"]'
    );

    const rows = document.querySelectorAll(
        ".table-wrap table tr"
    );

    if (searchInput) {

        searchInput.addEventListener("keyup", function () {

            const keyword =
                this.value.toLowerCase();

            rows.forEach((row, index) => {

                if (index === 0) return; // skip header

                const text =
                    row.innerText.toLowerCase();

                if (text.includes(keyword)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }

            });

        });

    }

});

// ===== LEAD DETAIL MODAL JS =====

function openLeadModal(
id,
name,
email,
phone,
company,
project,
budget,
status,
date,
notes
){

const modal =
document.getElementById("leadModal");

const content =
document.getElementById("modalContent");

content.innerHTML = `
<div class="modal-grid">

<div class="modal-item">
<strong>ID</strong>
<span>${id}</span>
</div>

<div class="modal-item">
<strong>Status</strong>
<span>${status}</span>
</div>

<div class="modal-item">
<strong>Name</strong>
<span>${name}</span>
</div>

<div class="modal-item">
<strong>Phone</strong>
<span>${phone}</span>
</div>

<div class="modal-item">
<strong>Email</strong>
<span>${email}</span>
</div>

<div class="modal-item">
<strong>Company</strong>
<span>${company}</span>
</div>

<div class="modal-item">
<strong>Project</strong>
<span>${project}</span>
</div>

<div class="modal-item">
<strong>Budget</strong>
<span>${budget}</span>
</div>

<div class="modal-item modal-full">
<strong>Created</strong>
<span>${date}</span>
</div>

<div class="modal-item modal-full">
<strong>Notes</strong>
<span>${notes || "No notes added"}</span>
</div>

</div>
`;

modal.style.display = "flex";
document.body.style.overflow = "hidden";

}


function closeLeadModal(){

document.getElementById(
"leadModal"
).style.display = "none";

document.body.style.overflow = "auto";

}


window.addEventListener("click", function(e){

const modal =
document.getElementById("leadModal");

if(e.target === modal){
closeLeadModal();
}

});


document.addEventListener("keydown", function(e){
if(e.key === "Escape"){
closeLeadModal();
}
});