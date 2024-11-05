"use client"

import { Contact } from "@/types/contact"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, useRef, useId } from "react"
import { Building2, Mail, User, Info, X } from "lucide-react"


interface ContactDialogProps {
  mode: "add" | "edit" | "view"
  contact?: Contact 
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (contact: Contact) => void
}

export function ContactDialog({ mode, contact, open, onOpenChange, onSubmit }: ContactDialogProps) {
  const [formData, setFormData] = useState<Partial<Contact>>({})
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  
  useEffect(() => {
    if (contact) {
      setFormData(contact)
    } else {
      setFormData({})
    }
  }, [contact, open])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    if (open) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", onKeyDown)
    } else {
      document.body.style.overflow = "auto"
    }

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.information) return

    onSubmit({
      id: contact?.id || Date.now().toString(),
      name: formData.name,
      information: formData.information || '',
      company: formData.company || '',
      email: formData.email,
      created_at: contact?.created_at || new Date()
    })
    onOpenChange(false)
  }

  const isViewMode = mode === "view"
  const title = {
    add: "Add New Contact",
    edit: "Edit Contact",
    view: "Contact Details",
  }[mode]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent
  className={`bg-white overflow-hidden ${
    mode === "view" ? "w-fit" : "sm:max-w-[500px]"
  }`}
>
<div
    className={`w-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden ${
      isViewMode ? "max-w-full" : ""
    }`}
  >
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="py-3">
                {mode === "add" && "Fill in the contact details below to add them to your outreach list."}
                {mode === "view" && "Here's the information about the contact selected."}
                {mode === "edit" && "Update the contact details of the contact selected."}
              </DialogDescription>
            </DialogHeader>

            {isViewMode ? (
        <div className="w-full flex flex-col flex-grow space-y-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-auto">
          {[
  { icon: <User className="w-5 h-5 flex-shrink-0 text-blue-600 mr-3" />, label: "Name", value: formData.name },
  { icon: <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mr-3" />, label: "Role", value: formData.information },
  { icon: <Mail className="w-5 h-5 flex-shrink-0 text-blue-600 mr-3" />, label: "Email", value: formData.email || "Not Available" },
  { icon: <Building2 className="w-5 h-5 flex-shrink-0 text-blue-600 mr-3" />, label: "Company", value: formData.company }
].map((item, index) => (
  item.value && (
    <div key={item.label} className="flex items-center">
      {item.icon}
      <div>
        <h3 className="font-semibold text-gray-900">{item.label}</h3>
        <p className="text-gray-600 pt-1 max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
          {item.value}
        </p>
      </div>
    </div>
  )
))}

        </div>
           
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      Full Name {!isViewMode && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="name"
                      required={!isViewMode}
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      disabled={isViewMode}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="information">
                      Role {!isViewMode && <span className="text-destructive">*</span>}
                    </Label>
                    <Textarea
                      id="information"
                      required={!isViewMode}
                      value={formData.information || ""}
                      onChange={(e) => setFormData({ ...formData, information: e.target.value })}
                      placeholder="Role, company, and other relevant details..."
                      className="min-h-[100px]"
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="johndoe@gmail.com"
                      disabled={isViewMode}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">
                      Company{!isViewMode && <span className="text-destructive">*</span>}
                    </Label>
                    <Textarea
                      id="company"
                      required={!isViewMode}
                      value={formData.company || ""}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company name..."
                      className="min-h-[100px]"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                {!isViewMode && (
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    {mode === "add" ? "Add Contact" : "Save Changes"}
                  </Button>
                )}
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}