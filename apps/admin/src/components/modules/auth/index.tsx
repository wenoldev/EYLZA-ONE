import {AuthForm} from "@/components/common/AuthForm";

interface AuthPagesProps {
  page: "login" | "register" | "forgot" | "change";
}

const AuthPages: React.FC<AuthPagesProps> = ({ page }) => {
  return (
    <div className="min-h-screen lg:h-screen flex bg-gray-50 lg:overflow-hidden">
      {/* Left Side - Image/Branding */}
      <div className="m-4 hidden lg:flex lg:w-1/2 rounded-lg bg-cover bg-center bg-no-repeat relative" style={{backgroundImage:"url(/auth/auth-bg.png)"}}>
      <div className="absolute bottom-2 left-2 text-2xl font-bold text-white flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full relative"></span> Eylza
      </div>
      </div>
      {/* <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-4">
              Simplify management with our dashboard
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Everything you need to manage your business efficiently in one powerful platform.
            </p>
            
            {/* Illustration placeholder - represents team collaboration
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="flex gap-4 justify-center mb-4">
                  <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/40 rounded-full"></div>
                  </div>
                  <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/40 rounded-full"></div>
                  </div>
                </div>
                <p className="text-white text-sm">Team Collaboration Image</p>
              </div>
            </div> */}
{/* 
            <div className="p-8 flex items-center justify-center h-64">
            <img src="/auth/login-bg.png" alt="" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <AuthForm page={page} />
      </div>
    </div>
  );
};

export default AuthPages;