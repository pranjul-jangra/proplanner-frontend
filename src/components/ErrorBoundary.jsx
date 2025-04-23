import { Component } from "react";
import '../styles/errorboundary.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-boundary">
          <h3>Something went wrong...</h3>
          <p>Please try refreshing the page or wait until the fix.</p>
          <button onClick={()=> window.location.reload()}>Reload ↻</button>
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
