import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const handleGoHome = () => {
    // In a real app, you'd use your router's navigation
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Large 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-800 mb-4 tracking-tight">
            404
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL was mistyped.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
          >
            <Home size={20} />
            Go Home
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 text-slate-600 mb-3">
            <Search size={20} />
            <span className="font-medium">Try searching instead</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // In a real app, implement search functionality
                  console.log('Search:', e.target);
                }
              }}
            />
            <button className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500 mt-6">
          If you believe this is an error, please contact our support team.
        </p>
      </div>
    </div>
  );
}