"use client"

import type React from "react"
import { googleLogin } from "@/lib/googleLogin"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { Navbar } from "@/components/navbar"

import { useAuthStore } from "@/store/authStore"

export default function LoginPage() {
  const router = useRouter()
  

  const { login,resendVerification, googleAuth,  isLoading, localError,error: storeError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [infoMessage, setInfoMessage] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ Validate FIRST
  if (!formData.email || !formData.password) {
    setError("Please fill in all fields");
    return;
  }

  setError("");

  try {
    // ✅ Call login ONCE
    const user = await login({
      email: formData.email,
      password: formData.password,
    });

    // ✅ Role-based routing
    if (user.role === "SuperAdmin") {
      router.push("/super-admin/dashboard");
    } else {
      router.push("/dashboard");
    }

  } catch (err) {
    console.error(err);
  }
};


    /*  RESEND VERIFICATION  */
  const handleResendVerification = async () => {
    try {
      await resendVerification({ email: formData.email })
      setInfoMessage("Verification email sent. Check your inbox.")
    } catch {
      // handled in store
    }
  }

  

    /*  GOOGLE AUTH  */
   const handleGoogleLogin = async () => {
  try {
    const idToken = await googleLogin() // 🔥 REAL TOKEN
    await googleAuth({ idToken })
    window.location.href = "/dashboard"
  } catch (err) {
    console.error(err)
  }
}

const handleForgotPassword = async () => {
  if (!formData.email) {
    setError("Please enter your email first");
    return;
  }

  setError("");
  setInfoMessage("");
  setForgotLoading(true);

  try {
    const response = await fetch("https://shipgate-application.onrender.com/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });

    // Safely parse JSON
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to send reset email");
    }

    setInfoMessage("Reset email sent! Check your inbox.");
  } catch (err: any) {
    console.error(err);
    setError(err.message || "Something went wrong");
  } finally {
    setForgotLoading(false);
  }
};



  return (
    <div className="h-screen w-full">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4 py-12">
        
        <Card className="w-full max-w-md shadow-lg border-border/50">
          <CardHeader className="space-y-2">
            


            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your logistics dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
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
                  disabled={isLoading}
                  className="bg-background border-border focus:ring-primary"
                />
              </div>

              {/* Password Field */}
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
                   disabled={isLoading}
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

              {/* Forgot Password Link */}
             <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={forgotLoading || isLoading}
            className="text-sm text-primary hover:underline"
          >
            {forgotLoading ? "Sending..." : "Forgot password?"}
          </button>
        </div>


              {/* Error Message */}
                        {(error || storeError) && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              {storeError || error}

              {storeError?.toLowerCase().includes("verify") && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="block mt-2 text-sm text-primary underline"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}
              

                 {/* Info Message */}
                  {infoMessage && (
                    <div className="p-3 bg-green-100 border rounded text-sm text-green-700">
                      {infoMessage}
                    </div>
                  )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Divider */}
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
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                >
                  <img src="/google.png" alt="Google" className="w-4 h-4 mr-2" /> Google
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-background hover:bg-black/30 cursor-pointer border-border hover:border-black/30 h-10"
                  disabled={isLoading}
                >
                  <img src="/apple.png" alt="Google" className="w-4 h-4 mr-2" /> Apple
                </Button>
              </div>
              
            </form>

            {/* Sign Up Link */}
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
