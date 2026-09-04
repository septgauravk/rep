import { ArrowLeft, ArrowRight, Check, Mail, Sparkles } from "lucide-react";

/** DishPrompt results page: visual proof without fake testimonials or performance claims. */
const SUPPORT_EMAIL = "hey.dishprompt@zohomail.in";
const results = [
  { file: "result-paneer-tikka.jpg", image: "/assets/dishprompt-assets/result-paneer-tikka.jpg", title: "Paneer Tikka", text: "Clean studio-style framing for menu cards and delivery listings.", label: "RESULT 01" },
  { file: "result-biryani.jpg", image: "/assets/dishprompt-assets/result-biryani.jpg", title: "Biryani Platter", text: "Warm, appetizing composition for Google Business and social posts.", label: "RESULT 02" },
  { file: "result-masala-dosa.jpg", image: "/assets/dishprompt-assets/result-masala-dosa.jpg", title: "Masala Dosa", text: "A crisp hero crop designed to make the dish easy to notice.", label: "RESULT 03" },
];

export default function Results() {
  return (
    <main className="results-page">
      <header className="site-header results-header">
        <a className="brand" href="/"><img src="/assets/dishprompt-assets/logo.png" alt="DishPrompt mark" /><span>DishPrompt<small>Better dish photos. Less hassle.</small></span></a>
        <a className="results-back" href="/"><ArrowLeft size={16} /> Back to home</a>
      </header>
      <section className="results-hero section-shell">
        <div className="eyebrow"><Sparkles size={15} /> Example results</div>
        <h1>See the kind of <em>visual upgrade</em> you can create.</h1>
        <p>These are example food visuals to show the direction. Aap apni real dish photo upload karke isi workflow ko apne menu ke liye use karoge.</p>
        <div className="result-note"><Check size={17} /> Start with your real dish. Keep the final image representative.</div>
      </section>
      <section className="results-grid section-shell">
        {results.map((result) => <article className="result-card" key={result.file}><div className="result-image-wrap"><img src={result.image} alt={result.title} /><span>{result.label}</span></div><div className="result-copy"><div><h2>{result.title}</h2><p>{result.text}</p></div><small>{result.file}</small></div></article>)}
      </section>
      <section className="results-cta"><div className="section-shell results-cta-inner"><div><div className="section-kicker">Ready to create yours?</div><h2>Open karo. Copy karo. Better dish photos banao.</h2><p>DishPrompt PDF — one-time purchase ₹999.</p></div><a className="light-button" href="/#buy">Get DishPrompt <ArrowRight size={18} /></a></div></section>
      <footer className="site-footer section-shell"><div className="footer-brand"><img src="/assets/dishprompt-assets/logo.png" alt="" /><strong>DishPrompt</strong></div><p>Need help with your PDF? Email us at {SUPPORT_EMAIL}.</p><div className="footer-actions"><a href={`mailto:${SUPPORT_EMAIL}?subject=DishPrompt%20results%20page%20help`}><Mail size={14} /> Contact support</a><a href="/">Home</a></div></footer>
    </main>
  );
}
