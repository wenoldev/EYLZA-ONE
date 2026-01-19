import { useState } from "react";
import { Home, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Define valid theme options
type Theme = "green" | "blue" | "purple" | "orange" | "pink";

// Theme configuration type
interface ThemeConfig {
  primary: string;
  primaryHover: string;
  primaryText: string;
  primaryBg: string;
  primaryBorder: string;
  gradient: string;
}

// Themes object with explicit typing
const themes: Record<Theme, ThemeConfig> = {
  green: {
    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    primaryText: "text-emerald-600",
    primaryBg: "bg-emerald-50",
    primaryBorder: "border-emerald-600",
    gradient: "from-emerald-600 to-green-600",
  },
  blue: {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    primaryText: "text-blue-600",
    primaryBg: "bg-blue-50",
    primaryBorder: "border-blue-600",
    gradient: "from-blue-600 to-indigo-600",
  },
  purple: {
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    primaryText: "text-purple-600",
    primaryBg: "bg-purple-50",
    primaryBorder: "border-purple-600",
    gradient: "from-purple-600 to-violet-600",
  },
  orange: {
    primary: "bg-orange-600",
    primaryHover: "hover:bg-orange-700",
    primaryText: "text-orange-600",
    primaryBg: "bg-orange-50",
    primaryBorder: "border-orange-600",
    gradient: "from-orange-600 to-amber-600",
  },
  pink: {
    primary: "bg-pink-600",
    primaryHover: "hover:bg-pink-700",
    primaryText: "text-pink-600",
    primaryBg: "bg-pink-50",
    primaryBorder: "border-pink-600",
    gradient: "from-pink-600 to-rose-600",
  },
};

// Props interface
interface NotFoundPageProps {
  theme?: Theme;
  showButtons?: boolean;
}

// Helper function to get valid theme or fallback
const getValidTheme = (theme: string | undefined): Theme => {
  const validThemes = Object.keys(themes) as Theme[];
  return validThemes.includes(theme as Theme) ? (theme as Theme) : "green";
};

const NotFoundPage: React.FC<NotFoundPageProps> = ({ theme, showButtons = true }) => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const [currentTheme, setCurrentTheme] = useState<Theme>(getValidTheme(theme));

  // Get active theme with fallback
  const activeTheme = themes[currentTheme] || themes.green;

  // Theme colors for buttons (for inline styles)
  const themeColors: Record<Theme, string> = {
    green: "#059669",
    blue: "#2563eb",
    purple: "#7c3aed",
    orange: "#ea580c",
    pink: "#db2777",
  };

  // Text shadow styles based on theme
  const getTextShadow = (theme: Theme): string => {
    switch (theme) {
      case "green":
        return "3px 3px 0 #a7f3d0, 6px 6px 0 rgba(0,0,0,0.1)";
      case "blue":
        return "3px 3px 0 #bfdbfe, 6px 6px 0 rgba(0,0,0,0.1)";
      case "purple":
        return "3px 3px 0 #ddd6fe, 6px 6px 0 rgba(0,0,0,0.1)";
      case "orange":
        return "3px 3px 0 #fed7aa, 6px 6px 0 rgba(0,0,0,0.1)";
      case "pink":
        return "3px 3px 0 #fce7f3, 6px 6px 0 rgba(0,0,0,0.1)";
      default:
        return "3px 3px 0 #a7f3d0, 6px 6px 0 rgba(0,0,0,0.1)"; // Fallback to green
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center p-6">
      {/* Theme Selector */}
      <div className="absolute top-6 right-6">
        <div className="bg-white rounded-lg shadow-sm border p-2 flex gap-2">
          {(Object.keys(themes) as Theme[]).map((themeName) => (
            <button
              key={themeName}
              onClick={() => setCurrentTheme(themeName)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${currentTheme === themeName
                ? `${themes[themeName].primaryBorder} ring-2 ring-offset-1 ring-gray-300`
                : "border-gray-300 hover:border-gray-400"
                }`}
              style={{ backgroundColor: themeColors[themeName] }}
              title={`${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-lg w-full">
        {/* Icon and 404 */}
        <div className="text-center mb-8">
          <h1 className="text-7xl font-bold mb-2">
            <span className="inline-block text-gray-900">4</span>
            <span
              className={`inline-block ${activeTheme.primaryText} mx-1`}
              style={{ textShadow: getTextShadow(currentTheme) }}
            >
              0
            </span>
            <span className="inline-block text-gray-900">4</span>
          </h1>
          <div className={`w-16 h-1 ${activeTheme.primary} mx-auto rounded-full`}></div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get
            you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        {showButtons && (
          <div className="space-y-3 mb-8">
            <button
              onClick={() => navigate(storeSlug ? `/${storeSlug}/home` : "/")}
              className={`w-full ${activeTheme.primary} ${activeTheme.primaryHover} text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>

            <button
              onClick={() => navigate(storeSlug ? `/${storeSlug}/products` : "/products")}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Products
            </button>
          </div>
        )}

        {/* Quick Links */}
        {/* <div className={`${activeTheme.primaryBg} rounded-lg p-4`}>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Categories", path: "/categories" },
              { name: "Support", path: "/support" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`text-left px-3 py-2 text-sm ${activeTheme.primaryText} hover:bg-white rounded-md transition-colors duration-200`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NotFoundPage;