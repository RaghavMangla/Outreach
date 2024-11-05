"use client"
import { Suspense } from 'react';

import { Loader2 } from 'lucide-react';
import ContactsDashboard from '@/components/contacts/ContactDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6 lg:p-8">
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <ContactsDashboard />
      </Suspense>
    </main>
  );
}