"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserProfile, updateUserProfile, changePassword } from "../../Services/authService"

function UserProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    preferences: { currency: "USD", theme: "light", notifications: { email: true, push: true } },
  })
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const response = await getUserProfile()
        console.log("User profile response:", response)
        setUser(response.user)
        setProfileData({
          firstName: response.user.firstName || "",
          lastName: response.user.lastName || "",
          preferences: {
            currency: response.user.preferences?.currency || "USD",
            theme: response.user.preferences?.theme || "light",
            notifications: {
              email: response.user.preferences?.notifications?.email ?? true,
              push: response.user.preferences?.notifications?.push ?? true,
            },
          },
        })
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError("Failed to load profile. Please try again or log in.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith("preferences.")) {
      const [_, key] = name.split(".")
      setProfileData((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, [key]: value },
      }))
    } else if (type === "checkbox") {
      setProfileData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: { ...prev.preferences.notifications, [name]: checked },
        },
      }))
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccessMessage("")
      const response = await updateUserProfile(profileData)
      setUser(response.user)
      setSuccessMessage("Profile updated successfully!")
    } catch (error) {
      setError("Failed to update profile: " + error.message)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }
    try {
      setError(null)
      setSuccessMessage("")
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setSuccessMessage("Password updated successfully!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      setError("Failed to change password: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{successMessage}</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="preferences.currency">
              Currency
            </label>
            <select
              id="preferences.currency"
              name="preferences.currency"
              value={profileData.preferences.currency}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="preferences.theme">
              Theme
            </label>
            <select
              id="preferences.theme"
              name="preferences.theme"
              value={profileData.preferences.theme}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Notifications</label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="emailNotifications"
                name="email"
                checked={profileData.preferences.notifications.email}
                onChange={handleProfileChange}
                className="mr-2"
              />
              <label htmlFor="emailNotifications">Email Notifications</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                name="push"
                checked={profileData.preferences.notifications.push}
                onChange={handleProfileChange}
                className="mr-2"
              />
              <label htmlFor="pushNotifications">Push Notifications</label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Update Profile
          </button>
        </form>

        {/* Password Form */}
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserProfile