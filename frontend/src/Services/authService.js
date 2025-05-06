// Base URL for API calls
const API_BASE_URL = "http://localhost:8070/api/users"

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type")

  // Check if the response is JSON
  if (contentType && contentType.includes("application/json")) {
    return await response.json()
  }

  // If not JSON, get the text and create an error
  const text = await response.text()
  throw new Error(text || `Server returned ${response.status}: ${response.statusText}`)
}

// Register a new user
export const registerUser = async (userData) => {
  try {
    console.log("Registering new user:", userData)
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await handleResponse(response)
      throw new Error(errorData.message || `Failed to register: ${response.status} ${response.statusText}`)
    }

    const data = await handleResponse(response)

    // Store token in localStorage
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

// Login user
export const loginUser = async (credentials) => {
  try {
    console.log("Logging in user with email:", credentials.email)
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await handleResponse(response)
      throw new Error(errorData.message || `Failed to login: ${response.status} ${response.statusText}`)
    }

    const data = await handleResponse(response)

    // Store token in localStorage
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null
}

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Get user profile
export const getUserProfile = async () => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    const response = await fetch(`${API_BASE_URL}/profile?userId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      const errorData = await handleResponse(response)
      throw new Error(errorData.message || `Failed to get profile: ${response.status} ${response.statusText}`)
    }

    return await handleResponse(response)
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    const response = await fetch(`${API_BASE_URL}/profile?userId=${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const errorData = await handleResponse(response)
      throw new Error(errorData.message || `Failed to update profile: ${response.status} ${response.statusText}`)
    }

    const data = await handleResponse(response)

    // Update user in localStorage
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Change password
export const changePassword = async (passwordData) => {
  try {
    const user = getCurrentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    const response = await fetch(`${API_BASE_URL}/change-password?userId=${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      const errorData = await handleResponse(response)
      throw new Error(errorData.message || `Failed to change password: ${response.status} ${response.statusText}`)
    }

    return await handleResponse(response)
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}
