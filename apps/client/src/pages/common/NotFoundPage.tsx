import React from "react";
import { Home, Search, FileQuestion } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (storeSlug) {
      navigate(`/${storeSlug}`);
    } else {
      navigate('/');
    }
  };

  const handleBrowseProducts = () => {
    if (storeSlug) {
      navigate(`/${storeSlug}/products`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Not Found Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full" />
          <div className="relative w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center text-primary">
            <FileQuestion className="w-10 h-10" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Error 404</p>
            <h1 className="text-4xl font-serif font-bold italic tracking-tight text-foreground">Page Not Found</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={handleGoHome}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </button>
          
          <button 
            onClick={handleBrowseProducts}
            className="w-full bg-accent hover:bg-accent/80 text-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all border border-border"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </button>

          <button 
            onClick={() => window.history.back()}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            Go Back
          </button>
        </div>

        {/* Support Info */}
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] pt-8">
          EYLZA Reference: 404-{Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;