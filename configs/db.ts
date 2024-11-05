import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Contact } from "@/types/contact";
import { contacts } from "@/configs/schema";
import { eq, ilike, desc, asc } from "drizzle-orm";

if (!process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL) {
  throw new Error("Database connection string not found");
}

const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL);
export const db = drizzle(sql);

export async function getContacts(): Promise<Contact[]> {
  const result = await db.select().from(contacts).orderBy(desc(contacts.created_at));
  return result.map(contact => ({
    ...contact,
    company: contact.company || '',
    information: contact.information || '',
    created_at: contact.created_at || new Date(),
    email:contact.email || ''
  }));
}

export async function addContact(contact: Omit<Contact, 'id' | 'created_at'>): Promise<string> {
  const id = Date.now().toString();
  await db.insert(contacts).values({
    id,
    name: contact.name,
    email: contact.email || '',
    company: contact.company || '',
    information: contact.information || ''
  });
  return id;
}

export async function updateContact(contact: Contact): Promise<void> {
  await db.update(contacts)
    .set({
      name: contact.name,
      email: contact.email || '',
      company: contact.company || '',
      information: contact.information || ''
    })
    .where(eq(contacts.id, contact.id));
}

export async function deleteContact(id: string): Promise<void> {
  await db.delete(contacts).where(eq(contacts.id, id));
}

export async function searchContacts(query: string): Promise<Contact[]> {
  const result = await db.select()
    .from(contacts)
    .where(ilike(contacts.name, `%${query}%`))
    .orderBy(desc(contacts.created_at));
  
  return result.map(contact => ({
    ...contact,
    email: contact.email || '',
    company: contact.company || '',
    information: contact.information || '',
    created_at: contact.created_at || new Date()
  }));
}

export async function sortContacts(field: keyof Contact, order: 'asc' | 'desc' = 'asc'): Promise<Contact[]> {
  const sortableFields = {
    name: contacts.name,
    company: contacts.company,
    email:contacts.email,
    created_at: contacts.created_at
  };

  const sortField = sortableFields[field as keyof typeof sortableFields];
  if (!sortField) {
    throw new Error('Invalid sort field');
  }

  const result = await db.select()
    .from(contacts)
    .orderBy(order === 'asc' ? asc(sortField) : desc(sortField));

  return result.map(contact => ({
    ...contact,
    company: contact.company || '',
    email:contact.email||'',
    information: contact.information || '',
    created_at: contact.created_at || new Date()
  }));
}