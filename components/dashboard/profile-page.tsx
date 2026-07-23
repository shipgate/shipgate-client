"use client"

import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { toast } from "sonner"
import { Camera, Loader2, Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/lib/auth-api"
import { useAuthStore } from "@/store/auth"

interface ProfileFormData {
  fullName: string
  email: string
  phone: string
  address: string
}

const emptyForm: ProfileFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
}

export function ProfilePage({ portalLabel }: { portalLabel: string }) {
  const { token, user, setAuth } = useAuthStore()

  const [formData, setFormData] = useState<ProfileFormData>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const initials = useMemo(() => {
    const source = formData.fullName || user?.fullName || "User"
    const parts = source.split(" ").filter(Boolean)
    const first = parts[0]?.charAt(0) || "U"
    const second = parts[1]?.charAt(0) || ""
    return `${first}${second}`
  }, [formData.fullName, user?.fullName])

  const loadProfile = async () => {
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const response = await getCurrentUserProfile(token)
      const profile = response.user
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      })

      if (user) {
        setAuth({ ...user, ...profile }, token)
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to load profile.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!token) {
      toast.error("Please sign in to continue.")
      return
    }

    if (!formData.fullName || !formData.email) {
      toast.error("Full name and email are required.")
      return
    }

    setIsSaving(true)
    try {
      const response = await updateCurrentUserProfile(formData, token)
      const updatedProfile = response.user

      setFormData({
        fullName: updatedProfile.fullName || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        address: updatedProfile.address || "",
      })

      if (user) {
        setAuth({ ...user, ...updatedProfile }, token)
      }

      toast.success(response.message || "Profile updated successfully.")
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error?.message || "Unable to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="rounded-2xl border border-border/60 bg-linear-to-r from-primary/10 via-background to-background p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{portalLabel}</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your details up to date so shipping and communication stay accurate.
        </p>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1 text-white">
                  <Camera className="h-3 w-3" />
                </div>
              </div>
              <div>
                <CardTitle>{formData.fullName || "Your Name"}</CardTitle>
                <CardDescription>{formData.email || "you@example.com"}</CardDescription>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      loadProfile()
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="ml-2 text-sm">Loading profile...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-9 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-9 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-9 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
