
export default function StoreInactiveScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M7.08 6.47a7 7 0 1 1 9.84 0"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Store Inactive</h1>
          <p className="text-slate-400 mb-2 text-lg">Your store is currently inactive</p>
          <p className="text-slate-500 mb-8">
            To access your store, please reactivate your account or contact our support team for assistance.
          </p>

          <button
            onClick={() => {
              window.location.href = import.meta.env.VITE_ADMIN_URL
            }}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200 mb-4"
          >
            Reactivate Store
          </button>

          <button
            onClick={() => {
              window.location.href = "/"
            }}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>

          <p className="text-slate-500 text-sm mt-6">
            Questions?{" "}
            <a href="mailto:support@example.com" className="text-blue-400 hover:text-blue-300 underline">
              Get support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
