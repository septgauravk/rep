import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="not-found-page">
          <section className="not-found-panel" aria-labelledby="error-title">
            <AlertTriangle aria-hidden="true" size={48} />
            <h1 id="error-title">Something went wrong.</h1>
            <p>The page could not be loaded. Please reload and try again.</p>
            <button type="button" onClick={() => window.location.reload()}>
              <RotateCcw size={16} /> Reload page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
