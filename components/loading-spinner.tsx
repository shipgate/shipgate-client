"use client"

interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
