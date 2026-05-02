"use client"

import { useState } from "react"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"

export default function StaffSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordUpdated, setPasswordUpdated] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "Staff Member",
    email: "staff@logistics.com",
    phone: "+234 801 222 2222",
    address: "Warehouse, Lagos",
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    console.log("[v0] Saving staff profile:", profileData)
    setIsEditing(false)
  }

  const handleResetPassword = () => {
    if (passwordData.oldPassword && passwordData.newPassword === passwordData.confirmPassword) {
      console.log("[v0] Resetting staff password")
      setPasswordUpdated(true)
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setPasswordUpdated(false), 3000)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
        <p className="text-foreground/60">Manage your profile and security settings</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
            <Input
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
            <Input
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
            <Input
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Address</label>
            <Input
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              disabled={!isEditing}
              className="disabled:opacity-50"
            />
          </div>
          {isEditing && (
            <Button onClick={handleSaveProfile} className="w-full bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Password Reset Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Reset your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Old Password</label>
            <div className="relative">
              <Input
                name="oldPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-foreground/40"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
            <div className="relative">
              <Input
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-foreground/40"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
            <Input
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
          </div>

          <Button onClick={handleResetPassword} className="w-full bg-primary hover:bg-primary/90">
            Reset Password
          </Button>

          {passwordUpdated && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Password reset successfully</p>
                <p className="text-sm text-green-800">Your password has been updated</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
