"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { toast } from "sonner"
import { authenticateUser } from "@/lib/auth-api"
import { useAuthStore } from "@/store/auth"

const getRedirectPath = (userType: string) => {
  switch (userType) {
    case "courier":
      return "/courier/dashboard"
    case "staff":
      return "/staff/dashboard"
    case "admin":
      return "/admin/dashboard"
    case "super_admin":
      return "/super-admin/dashboard"
    default:
      return "/dashboard"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const data = await authenticateUser(formData)
      setAuth(data.user, data.token)
      toast.success(data.message || "Logged in successfully")
      router.push(getRedirectPath(data.user.userType))
    } catch (err: any) {
      const message = err?.message || "Login failed. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-full">
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-background to-secondary flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg border-border/50">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your logistics dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background border-border focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-background border-border focus:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <Link href="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
                <span className="text-muted-foreground">Need help signing in?</span>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-background border-border hover:bg-black/30 hover:border-black/30 h-10 cursor-pointer"
                >
                  <img src="/google.png" alt="Google" className="w-4 h-4 mr-2" /> Google
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-background hover:bg-black/30 cursor-pointer border-border hover:border-black/30 h-10"
                >
                  <img src="/apple.png" alt="Apple" className="w-4 h-4 mr-2" /> Apple
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
