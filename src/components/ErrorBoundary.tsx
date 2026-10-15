"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FAF3DE",
            fontFamily: "'Hanken Grotesk', sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#2C2210",
              marginBottom: "1rem",
            }}
          >
            G.VIISUALS
          </h1>
          <p
            style={{
              color: "#6B5A48",
              fontSize: "1rem",
              maxWidth: "400px",
              lineHeight: 1.6,
            }}
          >
            Something went wrong loading the page. Please refresh or try again
            later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              background: "#2C2210",
              color: "#FAF3DE",
              border: "none",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}