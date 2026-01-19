
export default function TokenInvalidScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Authentication Failed</h1>
          <p className="text-slate-400 mb-2 text-lg">Invalid or missing credentials</p>
          <p className="text-slate-500 mb-8">
            The token or ID provided is invalid or has expired. Please request a new access link.
          </p>

          <button
            onClick={() => {
              window.location.href = "/"
            }}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 mb-4"
          >
            Try Again
          </button>

          <p className="text-slate-500 text-sm">
            Need help?{" "}
            <a href="mailto:support@example.com" className="text-blue-400 hover:text-blue-300 underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
