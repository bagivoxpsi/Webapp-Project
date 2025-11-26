console.log("[v0] profilechgSERVLET.js loaded") //just needed to track in console if connected to js and servlet


window.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("fullName")
  const userAge = localStorage.getItem("age")

  if (userName) {
    document.getElementById("full-name").value = userName
  }
  if (userAge) {
    document.getElementById("age").value = userAge
  }

  console.log("[v0] Loaded profile data from localStorage")
})


document.getElementById("profile-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  console.log("[v0] Profile form submitted")

  const fullName = document.getElementById("full-name").value.trim()
  const age = document.getElementById("age").value.trim()

  if (!fullName) {
    alert("Full name is required!")
    return
  }

  console.log("[v0] Sending to backend:", { fullName, age })

  try {
    const response = await fetch("/Webapp-Backend/editProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ fullName, age: Number.parseInt(age) || 0 }),
    })

    const data = await response.json()
    console.log("[v0] Backend response:", data) //just needed to track in console if connected to js and servlet
 
    if (data.status === "success") {

      localStorage.setItem("fullName", fullName)
      if (age) {
        localStorage.setItem("age", age)
      }

      alert("Profile updated successfully!")
      window.location.href = "../settings.html"
    } else {
      alert(data.message || "Failed to update profile")
    }
  } catch (error) {
    console.error("[v0] Update error:", error)
    alert("An error occurred while updating profile")
  }
})

console.log("[v0] Event listener attached to profile-form")
