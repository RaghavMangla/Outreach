"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Filter,
  SortAsc,
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";
import { Contact } from "@/types/contact";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./EmptyState";
import { ContactDialog } from "./ContactDialog";
import { useMemo } from "react";
import "./style.css";
import { Tooltip } from "@nextui-org/tooltip";
import { DeleteIcon } from "./DeleteIcon";
import { ModeToggle } from "../ui/ModeToggle";

type ModeType = "view" | "edit" | "add";

export default function ContactsDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [mode, setMode] = useState<ModeType>("view");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [contacter, setContacter] = useState<Contact | undefined>();
  const [currentSort, setCurrentSort] = useState<{
    field: keyof Contact;
    order: "asc" | "desc";
  }>({
    field: "name",
    order: "desc",
  });
  const { toast } = useToast();

  const getColorByLetter = (letter: number): { bg: string; text: string } => {
    const colorMap: Record<number, { bg: string; text: string }> = {
      0: { bg: "bg-red-500/15", text: "text-red-500" },
      1: { bg: "bg-blue-500/15", text: "text-blue-500" },
      2: { bg: "bg-green-500/15", text: "text-green-500" },
      3: { bg: "bg-yellow-500/15", text: "text-yellow-500" },
      4: { bg: "bg-purple-500/15", text: "text-purple-500" },
      5: { bg: "bg-indigo-500/15", text: "text-indigo-500" },
      6: { bg: "bg-pink-500/15", text: "text-pink-500" },
      7: { bg: "bg-teal-500/15", text: "text-teal-500" },
      8: { bg: "bg-orange-500/15", text: "text-orange-500" },
      9: { bg: "bg-cyan-500/15", text: "text-cyan-500" },
      10: { bg: "bg-lime-500/15", text: "text-lime-500" },
      11: { bg: "bg-emerald-500/15", text: "text-emerald-500" },
      12: { bg: "bg-violet-500/15", text: "text-violet-500" },
      13: { bg: "bg-fuchsia-500/15", text: "text-fuchsia-500" },
      14: { bg: "bg-rose-500/15", text: "text-rose-500" },
      15: { bg: "bg-sky-500/15", text: "text-sky-500" },
      16: { bg: "bg-amber-500/15", text: "text-amber-500" },
      17: { bg: "bg-red-600/15", text: "text-red-600" },
      18: { bg: "bg-blue-600/15", text: "text-blue-600" },
      19: { bg: "bg-green-600/15", text: "text-green-600" },
      20: { bg: "bg-yellow-600/15", text: "text-yellow-600" },
      21: { bg: "bg-purple-600/15", text: "text-purple-600" },
      22: { bg: "bg-indigo-600/15", text: "text-indigo-600" },
      23: { bg: "bg-pink-600/15", text: "text-pink-600" },
      24: { bg: "bg-teal-600/15", text: "text-teal-600" },
      25: { bg: "bg-orange-600/15", text: "text-orange-600" },
    };

    return colorMap[letter] || { bg: "bg-blue-500/15", text: "text-blue-500" };
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      active: { bg: "bg-emerald-500/15", text: "text-emerald-500" },
      paused: { bg: "bg-pink-500/15", text: "text-pink-500" },
      vacation: { bg: "bg-amber-500/15", text: "text-amber-500" },
    };
    return (
      statusMap[status.toLowerCase()] || {
        bg: "bg-gray-500/15",
        text: "text-gray-500",
      }
    );
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const [colors, setColors] = useState<
    Record<string, { bg: string; text: string }>
  >({});

  // Hook to generate and memoize company colors
  useEffect(() => {
    const colorMap: Record<string, { bg: string; text: string }> = {};
    const companies = contacts.map((contact) => contact.company);
    console.log(companies);
    companies.forEach((company) => {
      const firstLetterIndex =
        (company.charAt(0).toUpperCase().charCodeAt(0) - 65) % 26;
      colorMap[company] = getColorByLetter(firstLetterIndex);
    });
    setColors(colorMap);
  }, [contacts]);

  const getCompanyColor = (company: string) => {
    return colors[company] || { bg: "bg-gray-500/15", text: "text-gray-500" };
  };

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contacts");
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const response = await fetch(
        `/api/contacts?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to search contacts");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search contacts",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async (contact: Omit<Contact, "id" | "created_at">) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      console.log(contact);
      if (!response.ok) throw new Error("Failed to add contact");
      await loadContacts();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Contact added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (updatedContact: Contact) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContact),
      });
      if (!response.ok) throw new Error("Failed to update contact");
      await loadContacts();
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete contact");
      await loadContacts();
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const handleSort = async (field: keyof Contact) => {
    const newOrder =
      currentSort.field === field && currentSort.order === "asc"
        ? "desc"
        : "asc";
    setCurrentSort({ field, order: newOrder });
    try {
      const response = await fetch(
        `/api/contacts?sortField=${field}&sortOrder=${newOrder}`
      );
      if (!response.ok) throw new Error("Failed to sort contacts");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sort contacts",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] ">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Outreach Manager
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage your LinkedIn and email outreach contacts
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle/>
            <Button
              className="gap-2 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg"
              onClick={() => {
                setMode("add");
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleSort("name")}
              >
                <SortAsc className="h-4 w-4" />
                Sort
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {contacts.length === 0 ? (
            <EmptyState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-1/6">Name</TableHead>
                  <TableHead className="w-1/4">Role</TableHead>
                  <TableHead className="w-1/3">Email</TableHead>
                  <TableHead className="w-1/5">Company</TableHead>
                  <TableHead className="w-2/5 pl-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell className="truncate-3-words mr-4">
                      {contact.information}
                    </TableCell>
                    <TableCell className="font-mono text-sm overflow-auto">
                      <div className="max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {contact.email?contact.email:"Not Available"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getCompanyColor(contact.company).bg} ${
                          getCompanyColor(contact.company).text
                        } px-2 py-1 rounded-full text-sm font-medium flex items-center justify-center text-ellipsis whitespace-nowrap overflow-hidden text-center hover:bg-fuchsia-100`}
                        style={{
                          maxWidth: "100%",
                          minWidth: "0",
                          width: "calc(100% - 45px)",
                        }}
                      >
                        {contact.company.length > 9
                          ? `${contact.company.slice(0, 6)}...`
                          : contact.company}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex items-center justify-center pr-12">
                      <div className="flex justify-start items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setMode("view");
                            setContacter(contact);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setMode("edit");
                            setContacter(contact);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Tooltip color="danger" content="Delete user">
                          <span
                            onClick={() => handleDelete(contact.id)}
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                          >
                            <DeleteIcon />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {mode == "add" && (
        <ContactDialog
          mode="add"
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAdd}
        />
      )}

      {mode == "edit" && (
        <ContactDialog
          mode="edit"
          contact={contacter}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleEdit}
        />
      )}

      {mode == "view" && (
        <ContactDialog
          mode="view"
          contact={contacter}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
}
