import { useNavigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertCircle, RefreshCw, Home, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

interface StorefrontErrorProps {
  message?: string | null;
  onRetry?: () => void;
}

const StorefrontError: React.FC<StorefrontErrorProps> = ({ message, onRetry }) => {
  const navigate = useNavigate();
  const { storeSlug } = useParams();
  const error = useRouteError();
  const [showDetails, setShowDetails] = React.useState(false);

  // Determine the display message
  let displayMessage = message;
  let technicalDetail = "";

  if (error) {
    if (isRouteErrorResponse(error)) {
        displayMessage = error.data?.message || error.statusText;
        technicalDetail = `Error ${error.status}: ${displayMessage}`;
    } else if (error instanceof Error) {
        displayMessage = "A rendering error occurred in the application.";
        technicalDetail = error.stack || error.message;
    } else {
        displayMessage = "An unknown application error occurred.";
        technicalDetail = JSON.stringify(error);
    }
  }

  const handleGoHome = () => {
    if (storeSlug) {
      navigate(`/${storeSlug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Error Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full" />
          <div className="relative w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center text-primary">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-bold italic tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground leading-relaxed">
            {displayMessage || "We encountered an unexpected error while loading the store. Please try again or return home."}
          </p>
          
          {technicalDetail && (
            <div className="pt-2">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mx-auto"
              >
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Technical Details
              </button>
              
              {showDetails && (
                <div className="mt-4 p-4 bg-accent/50 rounded-xl border border-border text-[10px] font-mono text-left overflow-auto max-h-40 whitespace-pre-wrap text-muted-foreground break-all">
                  {technicalDetail}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          {onRetry && (
            <button 
              onClick={onRetry}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          
          <button 
            onClick={handleGoHome}
            className="w-full bg-accent hover:bg-accent/80 text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-border"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Hard Refresh Page
          </button>
        </div>

        {/* Support Info */}
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] pt-8">
          EYLZA Support ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default StorefrontError;
