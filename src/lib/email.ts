import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentNotification({
  toEmail,
  clientName,
  amountUsdc,
}: {
  toEmail: string;
  clientName: string;
  amountUsdc: number;
}) {
  try {
    await resend.emails.send({
      from: 'Solana Invoicer <onboarding@resend.dev>',
      to: toEmail,
      subject: `You've been paid $${amountUsdc} USDC`,
      html: `
        <div style="font-family: sans-serif; padding: 24px;">
          <h2 style="color: #0f172a;">Payment received 🎉</h2>
          <p style="color: #334155; font-size: 15px;">
            <strong>${clientName}</strong> just paid you
            <strong>$${amountUsdc} USDC</strong> on Solana.
          </p>
          <p style="color: #64748b; font-size: 13px;">
            This payment has been confirmed on-chain and your invoice is now marked as paid.
          </p>
        </div>
      `,
    });
  } catch (err) {
    // Never let an email failure break the actual payment confirmation —
    // we just log it and move on. The invoice is still correctly marked paid.
    console.error('Failed to send payment notification email:', err);
  }
}
