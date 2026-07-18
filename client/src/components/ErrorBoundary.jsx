import React from 'react';

const LazyPixelBlast = React.lazy(() => import('./PixelBlast'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('UI crash captured by ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-app text-primary flex items-center justify-center p-6 relative overflow-hidden">
          {/* Background Pixel Blast */}
          <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
            <React.Suspense fallback={null}>
              <LazyPixelBlast
                variant="square"
                pixelSize={8}
                color="#ef4444"
                patternScale={3}
                patternDensity={1.6}
                pixelSizeJitter={0.15}
                noiseAmount={0.06}
                transparent={true}
              />
            </React.Suspense>
          </div>

          <div className="macos-glass max-w-md p-8 text-center relative z-10">
            <h1 className="text-2xl font-bold mb-3">Unexpected Error</h1>
            <p className="text-secondary mb-6">
              Something went wrong while rendering this page. Please refresh and try again.
            </p>
            <button
              className="px-5 py-2 rounded-lg bg-accent text-white font-semibold"
              onClick={() => window.location.reload()}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

