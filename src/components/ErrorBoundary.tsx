import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  isDarkMode?: boolean;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      const dark = this.props.isDarkMode ?? true;
      return (
        <div
          className={`min-h-screen flex items-center justify-center p-6 ${
            dark ? 'bg-neutral-950 text-neutral-100' : 'bg-gray-50 text-gray-900'
          }`}
        >
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold mb-2">Codex failed to load</h1>
            <p className={`text-sm mb-4 ${dark ? 'text-neutral-400' : 'text-gray-600'}`}>
              {this.state.error.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-white text-neutral-900 font-medium"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
