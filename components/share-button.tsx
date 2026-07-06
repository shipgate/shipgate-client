"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

export function ShareButton() {

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href)

    toast.success("URL copied to clipboard!", {
      description: "You can now share the URL with others.",
      duration: 5000,
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 bg-transparent"
      onClick={copyToClipboard}
    >
      <Share2 className="w-4 h-4" />
      Share
    </Button>
  )
}