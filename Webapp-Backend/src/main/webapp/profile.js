const userId = localStorage.getItem("userId");

document.addEventListener("DOMContentLoaded", function () {
    const usernameElement = document.querySelector(".username");
    const editIcon = document.getElementById("edit-icon");
    const logoutBtn = document.querySelector(".logout-btn");
    const switchBtn = document.querySelector(".switch-btn");

	
    // Load username from localStorage or default
    let loginName = localStorage.getItem("userFullName");
    if (!loginName || loginName.trim() === "") {
        loginName = "Horizon User";
        localStorage.setItem("userFullName", loginName);
    }
    if (usernameElement) usernameElement.textContent = loginName;

    // Enable editing username
    if (usernameElement) {
        usernameElement.style.cursor = "pointer";
        usernameElement.addEventListener("click", updateFullName);
    }
    if (editIcon) {
        editIcon.style.cursor = "pointer";
        editIcon.addEventListener("click", updateFullName);
    }
	
	loadEmail();

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            if (!confirm("Are you sure you want to log out?")) return;

            fetch("/Webapp-Backend/logout", { method: "GET" })
                .then(() => {
                    localStorage.removeItem("userFullName");
                    window.location.href = "account/login.html";
                })
                .catch(() => {
                    window.location.href = "account/login.html";
                });
        });
    }

    // Switch account button
    if (switchBtn) {
        switchBtn.addEventListener("click", function () {
            localStorage.removeItem("userFullName");
            window.location.href = "account/login.html";
        });
    }

    // Load saved addresses
    loadAddresses();
});


async function updateFullName() {
    const usernameElement = document.querySelector(".username");
    let currentName = localStorage.getItem("userFullName") || usernameElement.textContent;

    const fullName = prompt("Enter your full name:", currentName);
    if (fullName === null) return;
    if (!fullName.trim()) {
        alert("Full name cannot be empty.");
        return;
    }

    try {
        const response = await fetch("/Webapp-Backend/update-fullname", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName })
        });

        const result = await response.json();
        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert(result.message);
        usernameElement.textContent = fullName;
        localStorage.setItem("userFullName", fullName);

    } catch (error) {
        alert("Error: " + error);
    }
}

document.getElementById("savedAddressesDiv").addEventListener("click", function() {
    // Redirect to the addresses page
    window.location.href = "sidebar-links/addresses.html";
});

function loadAddresses() {
    fetch("/Webapp-Backend/getAddresses?userId=" + userId)
        .then(res => res.json())
        .then(addresses => displayAddresses(addresses))
        .catch(() => {
            const container = document.getElementById("addresses-container");
            if (container) container.innerHTML =
                '<div class="text-danger">Error loading addresses</div>';
        });
}


function displayAddresses(addresses) {
    const container = document.getElementById("addresses-container");

    if (!addresses || addresses.length === 0) {
        container.innerHTML = '<div class="text-muted">No addresses saved</div>';
        return;
    }

    container.innerHTML = addresses
        .map(a => `
            <div class="address-item border-bottom pb-2 mb-2">
                ${a.address || ""}
            </div>
        `)
        .join("");
}


function loadEmail() {
    fetch("/Webapp-Backend/getUserEmail")
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && data.email) {
                const emailElement = document.querySelector(".email");
                emailElement.textContent = data.email;
            }
        })
        .catch(err => console.error("Error loading email:", err));
}



function logout() {
    if (!confirm("Are you sure you want to log out?")) return;

    fetch("/Webapp-Backend/logout", { method: "GET" })
        .then(() => {
            localStorage.removeItem("userFullName");
            window.location.href = "account/login.html";
        })
        .catch(() => {
            window.location.href = "account/login.html";
        });
}
