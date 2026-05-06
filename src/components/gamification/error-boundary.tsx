import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface GamificationErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  silent?: boolean
}

interface GamificationErrorBoundaryState {
  hasError: boolean
}

export class GamificationErrorBoundary extends Component<
  GamificationErrorBoundaryProps,
  GamificationErrorBoundaryState
> {
  constructor(props: GamificationErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): GamificationErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Gamification] Component error:', error.message)
    if (info.componentStack) {
      console.error('[Gamification] Component stack:', info.componentStack)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.silent) {
      return null
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
        <p className="text-sm text-foreground/60 mb-2">Something went wrong</p>
        <button
          type="button"
          onClick={this.handleRetry}
          className="text-xs font-mono px-3 py-1.5 rounded-lg bg-foreground/[0.05] border border-foreground/10 text-foreground/70 hover:text-foreground hover:border-foreground/20 hover:bg-foreground/10 transition-all"
        >
          Retry
        </button>
      </div>
    )
  }
}
