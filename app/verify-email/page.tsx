"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { verifyEmail } from "@/lib/auth-api"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setError("Verification token is missing.")
      setIsLoading(false)
      return
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token)
        setSuccess(true)
        toast.success(response.message || "Email verified successfully")
        setTimeout(() => router.push("/login"), 1400)
      } catch (err: any) {
        const message = err?.message || "Unable to verify email."
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    verify()
  }, [router, token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {isLoading && <p className="text-muted-foreground">Verifying your email now...</p>}

          {success && (
            <>
              <p className="text-green-600 font-medium">✅ Email verified successfully!</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </>
          )}

          {error && (
            <>
              <p className="text-red-600">{error}</p>
              <Button onClick={() => router.push("/login")}>Go to Login</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
