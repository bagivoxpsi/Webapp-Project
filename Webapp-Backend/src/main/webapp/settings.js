console.log("[v0] settings.js loaded")

let darkMode = localStorage.getItem("darkMode")
const themeSwitch = document.getElementById("theme-switch")

const enableDarkMode = () => {
  document.body.classList.add("darkMode")
  localStorage.setItem("darkMode", "active")
}

const disableDarkMode = () => {
  document.body.classList.remove("darkMode")
  localStorage.setItem("darkMode", null)
}

if (darkMode === "active") {
  enableDarkMode()
}

themeSwitch.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode")
  darkMode !== "active" ? enableDarkMode() : disableDarkMode()
})

document.getElementById("delete-account-btn").addEventListener("click", async () => {
  console.log("[v0] Delete account button clicked")

  const confirmation = confirm(
    "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
  )

  if (!confirmation) {
    console.log("[v0] User cancelled account deletion")
    return
  }

  const secondConfirmation = confirm(
    "This is your last chance! Are you absolutely sure you want to delete your account?",
  )

  if (!secondConfirmation) {
    console.log("[v0] User cancelled account deletion on second prompt")
    return
  }

  console.log("[v0] User confirmed deletion, calling backend")

  try {
    const response = await fetch("/Webapp-Backend/deleteAccount", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Backend response status:", response.status)
    const data = await response.json()
    console.log("[v0] Backend response data:", data)

    if (data.status === "success") {
      alert("Your account has been successfully deleted. You will now be redirected to the login page.")
      localStorage.clear()
      window.location.href = "account/login.html"
    } else {
      alert("Failed to delete account: " + data.message)
    }
  } catch (error) {
    console.error("[v0] Delete account error:", error)
    alert("An error occurred while deleting your account. Please try again.")
  }
})
