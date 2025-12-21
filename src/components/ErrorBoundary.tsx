import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep this minimal; avoids blank screens if a render-time error occurs.
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-[100svh] w-full bg-[#121212] flex items-center justify-center px-6">
            <div className="max-w-md text-center">
              <p className="text-white text-base">Something went wrong.</p>
              <p className="text-[#9c9aa5] text-sm mt-2">
                Try refreshing the page. If it keeps happening, clearing site storage usually fixes it.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}


