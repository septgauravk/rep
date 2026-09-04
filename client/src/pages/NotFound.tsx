import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main className="not-found-page">
      <section className="not-found-panel" aria-labelledby="not-found-title">
        <AlertCircle aria-hidden="true" size={56} />
        <div className="section-kicker">404</div>
        <h1 id="not-found-title">Page Not Found</h1>
        <p>Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.</p>
        <button type="button" onClick={() => setLocation("/")}>
          <Home size={17} /> Go Home
        </button>
      </section>
    </main>
  );
}
