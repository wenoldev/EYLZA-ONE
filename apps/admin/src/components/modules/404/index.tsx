import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Large 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 dark:text-zinc-100 mb-4 tracking-tight">
            404
          </h1>
          <div className="w-24 h-1 bg-gray-900 dark:bg-zinc-100 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-zinc-400 text-lg leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL was mistyped.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={handleGoHome}
            className="w-full sm:w-auto bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black flex items-center gap-2 px-6 py-6"
          >
            <Home size={20} />
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="w-full sm:w-auto flex items-center gap-2 px-6 py-6 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800 text-left">
          <div className="flex items-center gap-3 text-gray-700 dark:text-zinc-300 mb-3">
            <Search size={20} />
            <span className="font-medium">Try searching instead</span>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="w-full pl-4 pr-10 py-6"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // In a real app, implement search functionality
                  console.log('Search:', e.currentTarget.value);
                }
              }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 dark:text-zinc-500 mt-6">
          If you believe this is an error, please contact our support team.
        </p>
      </div>
    </div>
  );
}