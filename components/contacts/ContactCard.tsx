"use client"

import { Contact } from "@/types/contact"
import { Mail, Trash2, Eye, Edit2, Linkedin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ContactDialog } from "./ContactDialog"

interface ContactCardProps {
  contact: Contact
  onDelete: (id: string) => void
  onEdit: (contact: Contact) => void
}

export function ContactCard({ contact, onDelete, onEdit }: ContactCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-semibold text-primary">
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold leading-none tracking-tight">{contact.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {contact.email && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date().toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex -space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="ghost" size="icon" onClick={() => setShowViewDialog(true)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{contact.information}</p>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contact.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(contact.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ContactDialog
        mode="view"
        contact={contact}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        onSubmit={() => {}}
      />

      <ContactDialog
        mode="edit"
        contact={contact}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={onEdit}
      />
    </>
  )
}