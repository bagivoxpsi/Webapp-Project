let darkmode = localStorage.getItem("darkmode")
const themeSwitch = document.getElementById("theme-switch")

const enableDarkmode = () => {
  document.body.classList.add("darkmode")
  localStorage.setItem("darkmode", "active")
}

const disableDarkmode = () => {
  document.body.classList.remove("darkmode")
  localStorage.setItem("darkmode", null)
}

if (darkmode === "active") {
  enableDarkmode()
}

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode")
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})

document.getElementById("delete-account-btn").addEventListener("click", async () => {
  const confirmation = confirm(
    "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
  )

  if (!confirmation) {
    return
  }

  const secondConfirmation = confirm(
    "This is your last chance! Are you absolutely sure you want to delete your account?",
  )

  if (!secondConfirmation) {
    return
  }

  try {
    const response = await fetch("/Webapp-Backend/deleteAccount", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (data.status === "success") {
      alert("Your account has been successfully deleted. You will now be redirected to the login page.")
      localStorage.clear()
      window.location.href = "account/index.html"
    } else {
      alert("Failed to delete account: " + data.message)
    }
  } catch (error) {
    console.error("Delete account error:", error)
    alert("An error occurred while deleting your account. Please try again.")
  }
})