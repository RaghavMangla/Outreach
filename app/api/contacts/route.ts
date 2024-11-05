import { NextRequest, NextResponse } from "next/server";
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
  searchContacts,
  sortContacts,
} from "@/configs/db";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const sortField = searchParams.get("sortField") as any;
    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc";

    if (query) {
      const contacts = await searchContacts(query);
      return NextResponse.json(contacts);
    }

    if (sortField && sortOrder) {
      const contacts = await sortContacts(sortField, sortOrder);
      return NextResponse.json(contacts);
    }

    const contacts = await getContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contact = await request.json();
    const id = await addContact(contact);
    return NextResponse.json({ result: id });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to add contact" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const contact = await request.json();
    await updateContact(contact);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }
    await deleteContact(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
