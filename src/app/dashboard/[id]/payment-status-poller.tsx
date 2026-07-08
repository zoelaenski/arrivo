'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentStatusPoller({
  invoiceId,
}: {
  invoiceId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/invoices/${invoiceId}/check-payment`);
      const body = await res.json();

      if (body.status === 'paid') {
        clearInterval(interval);
        // Re-fetches the server component's data — this is what actually
        // flips the UI from "pending" to "paid" without a manual reload.
        router.refresh();
      }
    }, 4000); // every 4 seconds

    // Cleanup: stop polling if the user navigates away from this page
    return () => clearInterval(interval);
  }, [invoiceId, router]);

  // This component renders nothing visible — it just runs a background check
  return null;
}
