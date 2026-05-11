import { Component, type ReactNode } from 'react'
import { useRouteError, Link } from 'react-router-dom'

interface DiagnosticState {
  error: Error | null
  componentStack: string | null
}

export class DiagnosticErrorBoundary extends Component<{ children: ReactNode }, DiagnosticState> {
  state: DiagnosticState = { error: null, componentStack: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string | null }) {
    this.setState({ componentStack: errorInfo.componentStack ?? null })
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', fontSize: 13, background: '#111', color: '#eee', minHeight: '100vh' }}>
          <h1 style={{ color: '#f55', fontSize: 20, marginBottom: 16 }}>Render Error Diagnostic</h1>
          <p style={{ color: '#faa', marginBottom: 8 }}>{this.state.error.message}</p>
          {this.state.componentStack && (
            <pre style={{ whiteSpace: 'pre-wrap', color: '#adf', background: '#1a1a2e', padding: 16, borderRadius: 8, maxHeight: 500, overflow: 'auto' }}>
              {this.state.componentStack}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

export function RouteErrorBoundary() {
  const error = useRouteError() as Error | null

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        {error?.message && (
          <pre className="text-left text-xs font-mono p-4 rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] mb-6 overflow-auto max-h-40">
            {error.message}
          </pre>
        )}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 font-mono text-sm rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            Refresh
          </button>
          <Link
            to="/"
            className="px-6 py-2 font-mono text-sm rounded-lg border border-foreground/10 hover:border-foreground/20 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
