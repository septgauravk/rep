import { useState } from "react";
import { ArrowRight, Check, ChevronDown, ExternalLink, Menu, ShieldCheck, Sparkles, X, Zap } from "lucide-react";

/** DishPrompt: warm saffron commerce, Hinglish copy, one product, one clear conversion path. */
const RAZORPAY_PAYMENT_LINK = import.meta.env.VITE_RAZORPAY_PAYMENT_LINK || "https://rzp.io/l/REPLACE_WITH_YOUR_PAYMENT_LINK";
const SUPPORT_EMAIL = "hey.dishprompt@zohomail.in";
const SUPPORT_SUBJECT = "DishPrompt PDF help — Payment ID / Download issue";
const SUPPORT_BODY = `Namaste DishPrompt team,%0A%0AMaine DishPrompt PDF ke liye payment kiya hai, lekin mujhe download/access mein help chahiye.%0A%0AName:%0ARestaurant name:%0ARazorpay Payment ID:%0APayment date:%0APayment email/mobile:%0A%0AMeri problem:%0A%0AKripya PDF download link share kar dijiye.%0A%0AThank you`;

const steps = [
  { number: "01", title: "PDF open karo", text: "Ready-made prompt ko phone ya laptop par kholo." },
  { number: "02", title: "Prompt copy karo", text: "Kuch likhna nahi hai. Bas prompt copy karna hai." },
  { number: "03", title: "Free tool mein paste karo", text: "PDF ke andar diye gaye free Google tool mein paste karo." },
  { number: "04", title: "Dish photo upload karo", text: "Apni asli dish ki photo daalo — aur image ready." },
];

const benefits = ["Seconds mein professional look wali dish images", "Free tool ke saath use kar sakte ho", "Kitni bhi images generate kar sakte ho", "Zero writing — sab kuch ready diya gaya hai", "Ek baar purchase, baar-baar use karo"];
const faqs = [
  { q: "Kya mujhe AI ya prompt likhna aana chahiye?", a: "Nahi. Prompt already ready hai. Aapko sirf PDF open karke copy-paste karna hai." },
  { q: "Kya yeh sirf ek image banayega?", a: "Nahi. Prompt ko baar-baar use karke apni dishes ke liye multiple images bana sakte ho." },
  { q: "Kya yeh Google, Zomato aur Swiggy ke liye useful hai?", a: "Haan, workflow aapko menu, Google Business, delivery listings aur Instagram ke liye visual assets banane mein help karta hai." },
  { q: "Payment ke baad PDF kaise milegi?", a: "Razorpay payment ke turant baad aapko email par secure download link mil sakta hai. Agar email nahi aaye, neeche diya hua prewritten help email bhej do." },
  { q: "Email nahi aayi to kya karein?", a: "hey.dishprompt@zohomail.in par prewritten email bhejo. Apna Razorpay Payment ID zaroor add karo, taaki hum payment verify karke PDF link share kar saken." },
  { q: "Kya generated image asli dish jaisi honi chahiye?", a: "Bilkul. Best result ke liye asli dish ki photo upload karo aur final image ko misleading na banao." },
];

function startCheckout() {
  if (RAZORPAY_PAYMENT_LINK.includes("REPLACE_WITH")) {
    window.alert("Razorpay Payment Link add karne ke liye Home.tsx mein RAZORPAY_PAYMENT_LINK replace karein.");
    return;
  }
  window.location.href = RAZORPAY_PAYMENT_LINK;
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const copyLink = async () => { await navigator.clipboard?.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  return (
    <main className="dishprompt-site">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="DishPrompt home"><img src="/assets/dishprompt-assets/logo.png" alt="DishPrompt mark" /><span>DishPrompt<small>Better dish photos. Less hassle.</small></span></a>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>Kaise kaam karta hai</a><a href="#benefits" onClick={() => setMenuOpen(false)}>Benefits</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a><a href="/results" onClick={() => setMenuOpen(false)}>Results</a><button className="nav-buy" onClick={startCheckout}>₹999 — Buy now <ArrowRight size={16} /></button>
        </nav>
        <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </header>

      <section className="hero section-shell" id="top"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> For Indian restaurant owners</div><h1>Kya aapki dish photos <em>customers ko impress</em> nahi karti?</h1><p className="hero-lead">Google Business, Zomato aur Swiggy par average photos ki wajah se aapki dish utni tempting nahi dikhti jitni real mein hai?</p><div className="hero-actions"><button className="primary-button" onClick={startCheckout}>Abhi ₹999 mein purchase karo <ArrowRight size={18} /></button><a className="text-link" href="#how-it-works">Kaise kaam karta hai? <ArrowRight size={16} /></a><a className="text-link" href="/results">Results dekho <ArrowRight size={16} /></a></div><div className="micro-proof"><ShieldCheck size={16} /> One-time purchase · Instant PDF access · Hindi + English guide</div></div><div className="hero-visual"><img src="/assets/dishprompt-assets/hero.jpg" alt="Beautifully plated Indian thali" /><div className="photo-note"><span>REAL DISH → BETTER VISUAL</span><strong>Apni dish ki photo se start karo.</strong></div><div className="price-sticker"><small>ONE-TIME</small><strong>₹999</strong><span>Instant PDF</span></div></div></section>

      <section className="problem-band"><div className="section-shell problem-grid"><div><div className="section-kicker">The struggle is real</div><h2>Bahut se restaurant owners ka yahi problem hai.</h2></div><div className="problem-list"><p><span>01</span> Phone se li hui photos dull aur amateur lagti hain.</p><p><span>02</span> Google Business listing weak dikhti hai.</p><p><span>03</span> Delivery apps par competitors ki photos zyada tempting lagti hain.</p><p><span>04</span> Har baar photographer bulana mehnga padta hai.</p></div></div></section>

      <section className="solution section-shell"><div className="solution-intro"><div className="section-kicker">Simple solution</div><h2>Ek baar purchase karo. Phir baar-baar better dish images banao.</h2><p>DishPrompt ek ready-to-use PDF hai. Aapko kuch likhna ya complicated setting samajhna nahi hai — bas open, copy, paste, upload.</p></div><div className="solution-image-wrap"><img src="/assets/dishprompt-assets/result-paneer-tikka.jpg" alt="Professional looking paneer dish" /><div className="image-tag"><Zap size={14} /> Studio-style look</div></div></section>

      <section className="how section-shell" id="how-it-works"><div className="section-kicker">Kaise kaam karta hai?</div><h2>Bas 4 simple steps.</h2><div className="steps-grid">{steps.map((step) => <div className="step" key={step.number}><span className="step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><div className="step-note">No complicated settings. No writing required. <strong>Bas results.</strong></div></section>

      <section className="benefits section-shell" id="benefits"><div className="benefits-copy"><div className="section-kicker">Why DishPrompt?</div><h2>Apni dish ko <em>better light mein</em> dikhao.</h2><p>Ek ready prompt, jo aapki real dish photo ko menu, Google, delivery listings aur Instagram ke liye more professional banane mein help karta hai.</p><button className="primary-button" onClick={startCheckout}>Get the PDF — ₹999 <ArrowRight size={18} /></button></div><div className="benefit-list">{benefits.map((benefit, index) => <div className="benefit-item" key={benefit}><span>{String(index + 1).padStart(2, "0")}</span><Check size={17} />{benefit}</div>)}</div></section>

      <section className="offer section-shell" id="buy"><div className="offer-card"><div className="offer-copy"><div className="section-kicker">One-time purchase</div><h2>Professional-looking dish images. Without the photoshoot cost.</h2><p>Open the PDF → copy the prompt → paste it into the free tool → upload your dish photo.</p><div className="offer-meta"><ShieldCheck size={17} /> Instant digital delivery · Use again and again</div></div><div className="offer-price"><span>Simple pricing</span><strong>₹999</strong><small>one-time payment</small><button className="buy-button" onClick={startCheckout}>Abhi purchase karo <ArrowRight size={18} /></button><div className="payment-note">Secure checkout via Razorpay</div></div></div></section>

      <section className="faq section-shell" id="faq"><div className="section-kicker">Questions</div><h2>Simple answers.</h2><div className="faq-list">{faqs.map((faq, index) => <div className={openFaq === index ? "faq-item is-open" : "faq-item"} key={faq.q}><button onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{faq.q}</span><ChevronDown size={19} /></button>{openFaq === index && <p>{faq.a}</p>}</div>)}</div></section>

      <section className="final-cta"><div className="section-shell final-inner"><div><div className="section-kicker">Ready?</div><h2>Apni dish ko aaj se better dikhao.</h2><p>Ek simple PDF. Ek simple workflow. Better visuals for your restaurant.</p></div><button className="light-button" onClick={startCheckout}>Buy DishPrompt — ₹999 <ArrowRight size={18} /></button></div></section>

      <footer className="site-footer section-shell"><div className="footer-brand"><img src="/assets/dishprompt-assets/logo.png" alt="" /><strong>DishPrompt</strong></div><p>Made for Indian restaurant owners. Use responsibly: generated images should stay representative of the real dish.</p><div className="footer-actions"><button onClick={copyLink}>{copied ? "Link copied" : "Share page"} <ExternalLink size={14} /></button><a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(SUPPORT_SUBJECT)}&body=${SUPPORT_BODY}`}>PDF help</a></div></footer>
      <div className="support-strip"><span>Payment ke baad PDF nahi mili?</span><a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(SUPPORT_SUBJECT)}&body=${SUPPORT_BODY}`}>Prewritten help email bhejo →</a></div><div className="sticky-buy"><span><strong>DishPrompt PDF</strong><small>One-time · ₹999</small></span><button onClick={startCheckout}>Buy now <ArrowRight size={16} /></button></div>
    </main>
  );
}
