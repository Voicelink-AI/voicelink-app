import React, { type ReactNode } from 'react';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const handleFeatureError = (error: any) => {
    if (error.message?.includes('501') || error.message?.includes('not implemented')) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-yellow-400">🚧</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Feature Coming Soon</h3>
              <p className="mt-1 text-sm text-yellow-700">
                {feature} is currently being developed and will be available soon.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400">❌</div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <React.Suspense 
      fallback={fallback || <div>Loading {feature}...</div>}
    >
      <ErrorBoundary onError={handleFeatureError}>
        {children}
      </ErrorBoundary>
    </React.Suspense>
  );
}

class ErrorBoundary extends React.Component<
  { children: ReactNode; onError: (error: any) => ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.onError(this.state.error);
    }

    return this.props.children;
  }
}
