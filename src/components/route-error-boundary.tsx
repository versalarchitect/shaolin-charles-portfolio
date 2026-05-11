import { useRouteError, Link } from 'react-router-dom'

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
