"use client"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* EYLZA Logo/Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">EYLZA</h1>
          <p className="text-lg md:text-xl text-gray-400 font-light">Backend Services</p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center space-x-6 mb-12">
          {/* Animated status indicator */}
          <div className="relative">
            <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>

          {/* Status text */}
          <div className="text-left">
            <div className="text-xl font-semibold text-white mb-1">System Running</div>
            <div className="text-sm text-gray-400">
              Status: <span className="text-emerald-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Animated progress dots */}
        <div className="flex justify-center space-x-3 mb-16">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse animation-delay-300"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse animation-delay-600"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse animation-delay-900"></div>
        </div>

        {/* System info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400 mb-2">API</div>
              <div className="text-sm text-gray-400">Operational</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-2">Database</div>
              <div className="text-sm text-gray-400">Connected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400 mb-2">Services</div>
              <div className="text-sm text-gray-400">Running</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>© 2025 EYLZA Backend Services</p>
        </div>
      </div>

      {/* Minimal floating elements */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-emerald-400/50 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-400/50 rounded-full animate-ping animation-delay-1000"></div>
      <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-indigo-400/50 rounded-full animate-ping animation-delay-2000"></div>

      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
