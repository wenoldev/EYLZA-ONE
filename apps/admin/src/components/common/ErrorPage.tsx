import { useNavigate } from 'react-router-dom'

export const ErrorPage = () => {
  const navigate = useNavigate()

  const handleRetry = () => {
    // Attempt to refresh the dashboard state
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              System Error
            </h1>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm text-center">
                We encountered a persistent problem while communicating with our servers. 
                We tried auto-recovering several times but the connection remains unstable.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Reconnecting
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Return Home
              </button>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex flex-col items-center gap-1">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                Diagnostic Code
              </p>
              <code className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                ERR_CONNECTION_FAILURE_EXCEEDED_RETRIES
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
