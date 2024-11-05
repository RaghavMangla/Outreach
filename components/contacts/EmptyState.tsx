"use client"
import { Linkedin } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <Linkedin className="h-16 w-16 text-muted-foreground/25" />
      <h2 className="mt-6 text-2xl font-semibold">No contacts yet</h2>
      <p className="mt-2 text-center text-muted-foreground">
        Start adding your cold outreach contacts to track them here.
      </p>
    </div>
  )
}