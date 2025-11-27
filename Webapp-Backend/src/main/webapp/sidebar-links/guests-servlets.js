const btn_add = document.getElementById("add-button");
const popupExit = document.getElementById("popup-exit");
const btn_submit = document.getElementById("submit-btn");
const btn_cancel = document.getElementById("cancel-btn");
const popupContainer = document.getElementById("popup-container");
const guestInput = document.getElementById("guest");
const guestList = document.getElementById("guests");

const userId = Number(localStorage.getItem("userId"));

let editingGuest = null; // keeps track of which guest is being edited
let user_guests = [];

btn_add.addEventListener("click", () => openMenu());
popupExit.addEventListener("click", exitMenu);
btn_submit.addEventListener("click", submitGuest);
btn_cancel.addEventListener("click", exitMenu);

async function loadGuests(userId) {
    try {
        const response = await fetch(`/Webapp-Backend/getGuests?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch guests");

        const guests = await response.json();
        user_guests = guests;

        guestList.innerHTML = "";
        user_guests.forEach(g => addGuestToDOM(g.guestEmail, g.guestId));

    } catch (err) {
        console.error("Error loading guests:", err);
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    await loadGuests(userId);
});

async function submitGuest(event) {
    event.preventDefault();
    const guestEmail = guestInput.value.trim();
    if (!guestEmail) return;

    btn_submit.disabled = true;
    btn_submit.textContent = editingGuest ? "Saving..." : "Creating...";

    try {
		if (editingGuest) {
		    const guestId = Number(editingGuest.dataset.id); // <- convert to number
		    const response = await fetch('/Webapp-Backend/editGuest', {
		        method: 'POST',
		        headers: { 'Content-Type': 'application/json' },
		        body: JSON.stringify({ guestId: guestId, guestEmail: guestEmail })
		    });
            const result = await response.json();
            if (response.ok && result.status === 'success') {
                await loadGuests(userId);
                editingGuest = null;
                exitMenu();
            }
        } else {
            const response = await fetch('/Webapp-Backend/addGuest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, guestEmail: guestEmail })
            });
            const result = await response.json();
            if (response.ok && result.status === 'success') {
                await loadGuests(userId);
                exitMenu();
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        btn_submit.disabled = false;
        btn_submit.textContent = editingGuest ? "Save Changes" : "Create";
    }
}

function addGuestToDOM(email, guestId) {
    const cont = document.createElement("li");
    cont.classList.add(
        "guest-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "border-bottom",
        "py-2"
    );
    cont.dataset.id = guestId;

    const text = document.createElement("span");
    text.classList.add("fw-semibold");
    text.innerText = email;

    const actions = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-sm", "btn-outline-primary", "me-2");
    editBtn.innerHTML = '<i class="fa fa-pen"></i>';
    editBtn.addEventListener("click", () => editGuest(cont));

    const delBtn = document.createElement("button");
    delBtn.classList.add("btn", "btn-sm", "btn-outline-danger");
    delBtn.innerHTML = '<i class="fa fa-trash"></i>';
    delBtn.addEventListener("click", () => deleteGuest(cont));

    actions.append(editBtn, delBtn);
    cont.append(text, actions);
    guestList.appendChild(cont);
}

function openMenu(isEditing = false) {
    popupContainer.style.display = "flex";
    document.getElementById("submit-btn").innerText = isEditing ? "Save Changes" : "Create";
    guestInput.focus();
}

guestInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitGuest(event);
    } else if (event.key === "Escape") {
        event.preventDefault();
        exitMenu();
    }
});

function exitMenu() {
    popupContainer.style.display = "none";
    guestInput.value = "";
    editingGuest = null;
    document.getElementById("submit-btn").innerText = "Create";
}

function editGuest(container) {
    const currentText = container.querySelector("span").innerText;
    guestInput.value = currentText;
    editingGuest = container;
    openMenu(true);
}

async function deleteGuest(container) {
    const guestId = container.dataset.id;
    try {
        const response = await fetch(`/Webapp-Backend/deleteGuest?guestId=${guestId}`, {
            method: 'POST'
        });
        const result = await response.json();
        if (response.ok && result.status === 'success') {
            await loadGuests(userId);
        }
    } catch (err) {
        console.error(err);
    }
}
