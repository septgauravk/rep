import { ArrowLeft, Download, Mail, ShieldCheck } from "lucide-react";

const SUPPORT_EMAIL = "hey.dishprompt@zohomail.in";

export default function PaymentSuccess() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "";
  const paymentId = params.get("razorpay_payment_id") || params.get("payment_id") || "";
  const orderId = params.get("razorpay_order_id") || params.get("order_id") || "";
  const paymentLinkId = params.get("razorpay_payment_link_id") || "";
  const downloadUrl = token ? `/api/pdf-download?token=${encodeURIComponent(token)}` : "";
  const reference = paymentId || paymentLinkId || orderId;
  const emailBody = `Namaste DishPrompt team,%0A%0AMera DishPrompt PDF payment complete ho gaya hai. Mujhe PDF email kar dijiye.%0A%0ARazorpay Payment ID: ${encodeURIComponent(paymentId)}%0A%0AThank you`;

  function downloadPdf() {
    if (!downloadUrl) {
      window.alert("Secure download link aapke payment email par bheja gaya hai. Email check karein; help ke liye hey.dishprompt@zohomail.in par contact karein.");
      return;
    }
    window.location.href = downloadUrl;
  }

  return (
    <main className="payment-success-page">
      <div className="payment-success-shell">
        <a className="success-back" href="/"><ArrowLeft size={16} /> Back to DishPrompt</a>
        <div className="success-brand"><span>DishPrompt</span><small>Better dish photos. Less hassle.</small></div>
        <section className="success-panel" aria-labelledby="success-title">
          <div className="success-check"><ShieldCheck size={28} /></div>
          <div className="section-kicker">Payment received</div>
          <h1 id="success-title">Aapka payment request mil gaya hai.</h1>
          <p>Razorpay ne aapko yahan redirect kiya hai. Server-side webhook payment ko verify karega, aur verification ke baad secure PDF link email par bheja jayega.</p>
          {reference && <div className="success-reference">{paymentId && <div>Payment ID: <strong>{paymentId}</strong></div>}{orderId && <div>Order reference: <strong>{orderId}</strong></div>}{!paymentId && paymentLinkId && <div>Payment link reference: <strong>{paymentLinkId}</strong></div>}</div>}
          <div className="success-actions">
            <button className="success-primary" onClick={downloadPdf}><Download size={18} /> Download PDF once</button>
            <a className="success-secondary" href={`mailto:${SUPPORT_EMAIL}?subject=DishPrompt%20PDF%20delivery&body=${emailBody}`}><Mail size={18} /> Email PDF to me</a>
          </div>
          <div className="success-note">Secure link email par automatically bheja jayega after server verification. Download link one-time use hai aur 72 hours mein expire hota hai. Card number, CVV ya OTP email na karein.</div>
        </section>
      </div>
    </main>
  );
}
