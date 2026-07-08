import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Send logged-in freelancers straight to their invoices,
  // and everyone else to the login page.
  if (user) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
