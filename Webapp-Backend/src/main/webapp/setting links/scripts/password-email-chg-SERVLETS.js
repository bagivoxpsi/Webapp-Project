
window.addEventListener("DOMContentLoaded", () => {
  const userEmail = localStorage.getItem("userEmail")
  if (userEmail) {
    document.getElementById("new-email").placeholder = "Current: " + userEmail
  }
})

console.log("[v0] password-email-chg.js loaded")


document.getElementById("email-form").addEventListener("submit", async (e) => {
  console.log("[v0] Email form submitted")
  e.preventDefault()

  const newEmail = document.getElementById("new-email").value.trim()

  console.log("[v0] New email:", newEmail)

  if (!newEmail) {
    alert("Please enter a new email address!")
    return
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newEmail)) {
    alert("Please enter a valid email address!")
    return
  }

  try {
    console.log("[v0] Sending email change request to:", "/Webapp-Backend/changeEmail") //just needed to track in console if connected to js and servlet

    const response = await fetch("/Webapp-Backend/changeEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newEmail }),
    })

    console.log("[v0] Email change response status:", response.status)

    const data = await response.json()

    console.log("[v0] Email change response data:", data)

    if (data.status === "success") {
 
      localStorage.setItem("userEmail", newEmail)

      alert("Email updated successfully!")
      document.getElementById("new-email").value = ""
      document.getElementById("new-email").placeholder = "Current: " + newEmail
    } else {
      alert(data.message || "Failed to update email")
    }
  } catch (error) {
    console.error("[v0] Email update error:", error)
    alert("An error occurred while updating email")
  }
})

// Handle password form submission
document.getElementById("password-form").addEventListener("submit", async (e) => {
  console.log("[v0] Password form submitted")
  e.preventDefault()

  const currentPassword = document.getElementById("current-password").value
  const newPassword = document.getElementById("new-password").value
  const confirmPassword = document.getElementById("confirm-password").value

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("All fields are required!")
    return
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!")
    return
  }

  if (newPassword.length < 6) {
    alert("New password must be at least 6 characters long!")
    return
  }

  if (currentPassword === newPassword) {
    alert("New password must be different from current password!")
    return
  }

  try {
    console.log("[v0] Sending password change request to:", "/Webapp-Backend/changePassword")

    const response = await fetch("/Webapp-Backend/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }),
    })

    console.log("[v0] Password change response status:", response.status)

    const data = await response.json()

    console.log("[v0] Password change response data:", data)

    if (data.status === "success") {
      alert("Password updated successfully!")
      // Clear form
      document.getElementById("password-form").reset()
    } else {
      alert(data.message || "Failed to update password")
    }
  } catch (error) {
    console.error("[v0] Password update error:", error)
    alert("An error occurred while updating password")
  }
})

console.log("[v0] Event listeners attached to email-form and password-form")
